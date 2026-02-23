"""
insert_knowledge.py
====================
Insert module content into PostgreSQL knowledge_chunks table.
Supports any module JSON file that follows the standard format.

Usage:
    # Insert linux modules (default)
    python insert_knowledge.py

    # Insert a specific file
    python insert_knowledge.py --file /path/to/network-modules.json

    # Clear ALL data first, then insert
    python insert_knowledge.py --file linux-modules.json --clear

    # Clear only a specific module's data
    python insert_knowledge.py --clear-module networking

    # List what's currently in the database
    python insert_knowledge.py --list
"""

import argparse
import json
import os
import sys

import psycopg2
from sentence_transformers import SentenceTransformer

# ── Config ──────────────────────────────────────────────
DB_CONFIG = {
    "dbname": os.getenv("DB_NAME", "postgres"),
    "user": os.getenv("DB_USER", "myuser"),
    "password": os.getenv("DB_PASSWORD", "mypassword"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
}
DEFAULT_DATA_DIR = os.getenv("DATA_DIR", "/Users/attachatchannakorn/secure-sensei/data")
DEFAULT_FILE = "linux-modules.json"
EMBEDDING_MODEL = "paraphrase-multilingual-mpnet-base-v2"  # 768-dim, supports Thai


# ── Parse arguments ─────────────────────────────────────
def parse_args():
    parser = argparse.ArgumentParser(
        description="Insert module knowledge into PostgreSQL pgvector database"
    )
    parser.add_argument(
        "--file", "-f",
        help="Path to module JSON file (default: linux-modules.json in data/)",
        default=None,
    )
    parser.add_argument(
        "--clear",
        action="store_true",
        help="Clear ALL existing data before inserting",
    )
    parser.add_argument(
        "--clear-module",
        metavar="MODULE_ID",
        help="Clear data for a specific module ID only (e.g., 'intro', 'networking')",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List current data in the database and exit",
    )
    return parser.parse_args()


# ── Resolve file path ───────────────────────────────────
def resolve_file(file_arg):
    if file_arg is None:
        return os.path.join(DEFAULT_DATA_DIR, DEFAULT_FILE)

    # If it's just a filename, look in data/ dir
    if not os.path.isabs(file_arg) and not os.path.exists(file_arg):
        in_data = os.path.join(DEFAULT_DATA_DIR, file_arg)
        if os.path.exists(in_data):
            return in_data

    return file_arg


# ── Prepare documents from JSON ─────────────────────────
def prepare_documents(modules):
    documents = []

    for module in modules:
        lab_id = module["id"]
        module_title = module["title"]

        for section in module["sections"]:
            sec_type = section["type"]

            if sec_type == "content":
                heading = section.get("heading", "")
                text = section.get("text", "")
                content = f"[{module_title}] {heading}\n{text}"
                documents.append({
                    "lab_id": lab_id,
                    "content": content,
                    "hint_level": 0,
                    "type": "theory",
                })

            elif sec_type == "code":
                language = section.get("language", "bash")
                code = section.get("code", "")
                content = f"[{module_title}] Code Example ({language})\n{code}"
                documents.append({
                    "lab_id": lab_id,
                    "content": content,
                    "hint_level": 0,
                    "type": "code",
                })

            elif sec_type == "quiz":
                question = section.get("question", "")
                answer = section.get("answer", "")
                hint = section.get("hint", "")

                # hint_level 0: question only
                documents.append({
                    "lab_id": lab_id,
                    "content": f"[{module_title}] Quiz\nคำถาม: {question}",
                    "hint_level": 0,
                    "type": "quiz",
                })

                # hint_level 1: question + hint
                documents.append({
                    "lab_id": lab_id,
                    "content": f"[{module_title}] Quiz\nคำถาม: {question}\nคำใบ้: {hint}",
                    "hint_level": 1,
                    "type": "quiz",
                })

                # hint_level 2: question + hint + answer
                documents.append({
                    "lab_id": lab_id,
                    "content": (
                        f"[{module_title}] Quiz\n"
                        f"คำถาม: {question}\n"
                        f"คำใบ้: {hint}\n"
                        f"คำตอบ: {answer}"
                    ),
                    "hint_level": 2,
                    "type": "quiz",
                })

    return documents


# ── Main ────────────────────────────────────────────────
def main():
    args = parse_args()

    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Ensure table exists
    cur.execute("""
        CREATE TABLE IF NOT EXISTS knowledge_chunks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            lab_id TEXT NOT NULL,
            content TEXT NOT NULL,
            embedding VECTOR(768) NOT NULL,
            hint_level INT NOT NULL DEFAULT 0,
            type TEXT DEFAULT 'theory',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)
    conn.commit()

    # ── List mode ──
    if args.list:
        cur.execute("""
            SELECT lab_id, type, hint_level, COUNT(*) 
            FROM knowledge_chunks 
            GROUP BY lab_id, type, hint_level 
            ORDER BY lab_id, type, hint_level
        """)
        rows = cur.fetchall()
        if not rows:
            print("Database is empty.")
        else:
            print(f"{'LAB_ID':<20} {'TYPE':<10} {'HINT':<6} {'COUNT':<6}")
            print("-" * 44)
            total = 0
            for r in rows:
                print(f"{r[0]:<20} {r[1]:<10} {r[2]:<6} {r[3]:<6}")
                total += r[3]
            print("-" * 44)
            print(f"Total: {total} documents")
        cur.close()
        conn.close()
        return

    # ── Clear all ──
    if args.clear:
        cur.execute("DELETE FROM knowledge_chunks")
        deleted = cur.rowcount
        conn.commit()
        print(f"Cleared {deleted} existing documents.")

    # ── Clear specific module ──
    if args.clear_module:
        cur.execute("DELETE FROM knowledge_chunks WHERE lab_id = %s", (args.clear_module,))
        deleted = cur.rowcount
        conn.commit()
        print(f"Cleared {deleted} documents for module '{args.clear_module}'.")
        if args.file is None:
            # Just clearing, no insert needed
            cur.close()
            conn.close()
            return

    # ── Load JSON ──
    json_path = resolve_file(args.file)
    if not os.path.exists(json_path):
        print(f"Error: File not found: {json_path}")
        sys.exit(1)

    print(f"[1/4] Loading {os.path.basename(json_path)} ...")
    with open(json_path, "r", encoding="utf-8") as f:
        modules = json.load(f)

    # ── Prepare documents ──
    print("[2/4] Preparing documents ...")
    documents = prepare_documents(modules)
    print(f"      {len(documents)} documents ready")

    # ── Load embedding model ──
    print(f"[3/4] Loading embedding model: {EMBEDDING_MODEL} ...")
    embedder = SentenceTransformer(EMBEDDING_MODEL)

    # ── Insert ──
    print("[4/4] Generating embeddings & inserting ...")
    for i, doc in enumerate(documents, 1):
        embedding = embedder.encode(doc["content"]).tolist()
        cur.execute(
            """
            INSERT INTO knowledge_chunks (lab_id, content, embedding, hint_level, type)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (doc["lab_id"], doc["content"], str(embedding), doc["hint_level"], doc["type"]),
        )
        print(f"   [{i}/{len(documents)}] {doc['type']:<8} | lab={doc['lab_id']:<15} | hint={doc['hint_level']}")

    conn.commit()
    cur.close()
    conn.close()

    print(f"\nDone! Inserted {len(documents)} documents from {os.path.basename(json_path)}.")


if __name__ == "__main__":
    main()
