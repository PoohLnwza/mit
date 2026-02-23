"""
test_rag.py
===========
ทดสอบ RAG retrieval จากตาราง knowledge_chunks
- รับคำถามจาก user
- ค้นหา documents ที่เกี่ยวข้องจาก pgvector (cosine similarity)
- แสดงผลลัพธ์ที่ได้
"""

import psycopg2
from sentence_transformers import SentenceTransformer

# ── Config ──────────────────────────────────────────────
DB_CONFIG = {
    "dbname": "postgres",
    "user": "myuser",
    "password": "mypassword",
    "host": "localhost",
    "port": "5432",
}
EMBEDDING_MODEL = "paraphrase-multilingual-mpnet-base-v2"
TOP_K = 5  # จำนวนผลลัพธ์ที่ต้องการ


def search(query: str, hint_level: int = None, doc_type: str = None, top_k: int = TOP_K):
    """ค้นหา documents ที่เกี่ยวข้องกับ query"""

    # Generate query embedding
    embedding = embedder.encode(query).tolist()

    # Build WHERE clause
    conditions = []
    params = [str(embedding), top_k]

    if hint_level is not None:
        conditions.append("hint_level = %s")
        params.insert(-1, hint_level)

    if doc_type is not None:
        conditions.append("type = %s")
        params.insert(-1, doc_type)

    where_clause = ""
    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    sql = f"""
        SELECT lab_id, content, hint_level, type,
               1 - (embedding <=> %s::vector) AS similarity
        FROM knowledge_chunks
        {where_clause}
        ORDER BY embedding <=> %s::vector
        LIMIT %s
    """

    # Adjust params for the two embedding references
    final_params = [str(embedding)]
    if hint_level is not None:
        final_params.append(hint_level)
    if doc_type is not None:
        final_params.append(doc_type)
    final_params.append(str(embedding))
    final_params.append(top_k)

    cur.execute(sql, final_params)
    return cur.fetchall()


def print_results(results, query):
    """แสดงผลลัพธ์แบบสวยงาม"""
    print(f"\n{'='*60}")
    print(f"🔍 Query: {query}")
    print(f"{'='*60}")

    if not results:
        print("❌ ไม่พบผลลัพธ์")
        return

    for i, (lab_id, content, hint_level, doc_type, similarity) in enumerate(results, 1):
        print(f"\n--- [{i}] similarity: {similarity:.4f} ---")
        print(f"📁 lab: {lab_id} | 📝 type: {doc_type} | 💡 hint_level: {hint_level}")
        # แสดง content ย่อ (ไม่เกิน 200 ตัวอักษร)
        preview = content[:200] + "..." if len(content) > 200 else content
        print(f"📄 {preview}")

    print(f"\n{'='*60}\n")


# ── Main ────────────────────────────────────────────────
if __name__ == "__main__":
    print("Loading embedding model ...")
    embedder = SentenceTransformer(EMBEDDING_MODEL)

    print("Connecting to database ...")
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # ── ตรวจสอบจำนวน records ──
    cur.execute("SELECT COUNT(*) FROM knowledge_chunks")
    count = cur.fetchone()[0]
    print(f"✅ knowledge_chunks มี {count} records\n")

    # ══════════════════════════════════════════════
    # ทดสอบ 1: ค้นหาทั่วไป
    # ══════════════════════════════════════════════
    test_queries = [
        "คำสั่งดูไฟล์ใน Linux",
        "สิทธิ์ไฟล์ chmod",
        "password hash เก็บที่ไหน",
        "เขียน shell script ยังไง",
        "SUID bit คืออะไร",
    ]

    print("=" * 60)
    print("🧪 TEST 1: ค้นหาทั่วไป (ทุก type, ทุก hint_level)")
    print("=" * 60)

    for q in test_queries:
        results = search(q, top_k=3)
        print_results(results, q)

    # ══════════════════════════════════════════════
    # ทดสอบ 2: ค้นหาเฉพาะ theory
    # ══════════════════════════════════════════════
    print("=" * 60)
    print("🧪 TEST 2: ค้นหาเฉพาะ type='theory'")
    print("=" * 60)

    results = search("Linux filesystem structure", doc_type="theory", top_k=3)
    print_results(results, "Linux filesystem structure (theory only)")

    # ══════════════════════════════════════════════
    # ทดสอบ 3: ค้นหา quiz พร้อม hint levels
    # ══════════════════════════════════════════════
    print("=" * 60)
    print("🧪 TEST 3: ค้นหา quiz ที่แต่ละ hint_level")
    print("=" * 60)

    for level in [0, 1, 2]:
        results = search("chmod permission", hint_level=level, doc_type="quiz", top_k=2)
        print_results(results, f"chmod permission (quiz, hint_level={level})")

    # ══════════════════════════════════════════════
    # ทดสอบ 4: Interactive mode
    # ══════════════════════════════════════════════
    print("\n" + "=" * 60)
    print("🎮 Interactive Mode — พิมพ์คำถามเพื่อค้นหา (พิมพ์ 'q' เพื่อออก)")
    print("=" * 60)

    while True:
        query = input("\n❓ คำถาม: ").strip()
        if query.lower() in ("q", "quit", "exit"):
            break
        if not query:
            continue
        results = search(query, top_k=3)
        print_results(results, query)

    cur.close()
    conn.close()
    print("👋 Bye!")
