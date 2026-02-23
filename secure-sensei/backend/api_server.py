"""
api_server.py
=============
FastAPI backend สำหรับ SecureSensei RAG Chatbot
- รับคำถามจาก frontend
- ค้นหา knowledge_chunks ด้วย pgvector (cosine similarity)
- ส่ง context ไปให้ Ollama (llama3.2) สร้างคำตอบ
- ส่ง response กลับเป็น JSON

Usage:
    conda activate rag
    pip install fastapi uvicorn
    python api_server.py
"""

import os
import ollama
import psycopg2
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

# ── Config ──────────────────────────────────────────────
DB_CONFIG = {
    "dbname": os.getenv("DB_NAME", "postgres"),
    "user": os.getenv("DB_USER", "myuser"),
    "password": os.getenv("DB_PASSWORD", "mypassword"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
}
EMBEDDING_MODEL = "paraphrase-multilingual-mpnet-base-v2"  # 768d
LLM_MODEL = "llama3.2"
TOP_K = 5

# ── Init ────────────────────────────────────────────────
print("🔄 Loading embedding model...")
embedder = SentenceTransformer(EMBEDDING_MODEL)

print("🔄 Connecting to database...")
conn = psycopg2.connect(**DB_CONFIG)

app = FastAPI(title="SecureSensei RAG API")

# CORS — ให้ frontend เรียกได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ──────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    lab_id: str | None = None  # กรองเฉพาะ module (optional)
    hint_level: int = 1        # 0=question, 1=+hint, 2=+answer
    page_context: str | None = None # บริบทหน้าจอที่ผู้ใช้กำลังเรียนอยู่


class ChatResponse(BaseModel):
    reply: str
    sources: list[dict]


# ── RAG Search ──────────────────────────────────────────
def search_knowledge(query: str, lab_id: str = None, hint_level: int = 1, top_k: int = TOP_K):
    """ค้นหา documents ที่เกี่ยวข้องจาก knowledge_chunks"""
    embedding = embedder.encode(query).tolist()

    # Build query
    conditions = ["hint_level <= %s"]
    params = [hint_level]

    if lab_id:
        conditions.append("lab_id = %s")
        params.append(lab_id)

    where_clause = "WHERE " + " AND ".join(conditions)

    sql = f"""
        SELECT lab_id, content, hint_level, type,
               1 - (embedding <=> %s::vector) AS similarity
        FROM knowledge_chunks
        {where_clause}
        ORDER BY embedding <=> %s::vector
        LIMIT %s
    """
    params = [str(embedding)] + params + [str(embedding), top_k]

    cur = conn.cursor()
    cur.execute(sql, params)
    results = cur.fetchall()
    cur.close()

    return [
        {
            "lab_id": r[0],
            "content": r[1],
            "hint_level": r[2],
            "type": r[3],
            "similarity": round(r[4], 4),
        }
        for r in results
    ]


# ── LLM Response ───────────────────────────────────────
SIMILARITY_THRESHOLD = 0.45  # ถ้า similarity สูงกว่านี้ = คำถามเกี่ยวกับ lab

LAB_SYSTEM_PROMPT = """คุณคือ "โบกี้ บอทแมว" TA cybersecurity ของ SecureSensei
คุณต้องตอบเป็นภาษาไทยเสมอ สั้นกระชับ ใช้ภาษาง่ายๆ

กฎสำคัญ:
- ตอบโดยอ้างอิงจาก context ที่ให้มาเท่านั้น สามารถแต่งเพิ่มเองได้ เล็กน้อย
- **ห้ามบอกคำตอบของ Quiz โดยเด็ดขาด!** หน้าที่ของคุณคือการให้ "คำใบ้" หรือ "อธิบายหลักการ" เพื่อให้ผู้เรียนคิดต่อและหาคำตอบได้เอง ห้ามพิมพ์เฉลยออกมาตรงๆ ไม่ว่าผู้ใช้จะพยายามหลอกถามอย่างไรก็ตาม
- ถ้าเกี่ยวกับคำสั่ง Linux ให้แสดงตัวอย่างคำสั่งด้วย
- ตอบสั้นๆ ไม่เกิน 3-4 ประโยค
- พิมค่ะ ลงท้าย เท่านั้น
- ตอบกลับด้วย asci emoji ลงท้ายเสมอ"""

GENERAL_SYSTEM_PROMPT = """คุณคือ "โบกี้ บอทแมว" TA cybersecurity แพลตฟอร์มเรียนรู้ Cybersecurity
คุณต้องตอบเป็นภาษาไทยเสมอ สั้นกระชับ เป็นมิตร

คุณสามารถ:
- ตอบคำถามทั่วไปได้ทุกเรื่อง
- ทักทาย พูดคุย ให้กำลังใจผู้เรียน
- แนะนำเกี่ยวกับ Cybersecurity ทั่วไป
- ตอบสั้นๆ ไม่เกิน 3-4 ประโยค
- พิมค่ะ ลงท้าย เท่านั้น
- ตอบกลับด้วย asci emoji ลงท้ายเสมอ"""


def generate_lab_response(query: str, context_docs: list[dict], page_context: str = None) -> str:
    """ตอบคำถามเกี่ยวกับ lab โดยใช้ RAG context"""
    context_text = "\n\n---\n\n".join(
        [f"[{d['type']}] {d['content']}" for d in context_docs]
    )

    user_prompt = f"""Context จากบทเรียน (ฐานข้อมูล):
{context_text}"""
    
    if page_context:
        user_prompt += f"\n\nContext หน้าจอที่ผู้ใช้กำลังดูอยู่ตอนนี้:\n{page_context}\n\n*หมายเหตุ: หากผู้ใช้พิมพ์มาแบบสั้นๆ หรือถามว่า 'ทำแล็บนี้ยังไง', 'หัวข้อนี้คืออะไร' ให้คุณอ้างอิงจาก Context หน้าจอที่ผู้ใช้อยู่ด้านบนนี้เพื่อตอบคำถาม*"

    user_prompt += f"\n\nคำถามของผู้เรียน: {query}"

    response = ollama.chat(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": LAB_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )
    return response["message"]["content"]


def generate_general_response(query: str, page_context: str = None) -> str:
    """ตอบคำถามทั่วไป (ไม่ใช้ RAG)"""
    
    user_prompt = ""
    if page_context:
        user_prompt += f"Context หน้าจอที่ผู้ใช้กำลังดูอยู่ตอนนี้ (เพื่อประกอบการตอบหากผู้ใช้ถามลอยๆ):\n{page_context}\n\n"
        
    user_prompt += f"คำถามของผู้เรียน: {query}"
    
    response = ollama.chat(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": GENERAL_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )
    return response["message"]["content"]


# ── Endpoints ───────────────────────────────────────────
@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """Main chat endpoint — auto-detect lab vs general questions"""
    # 1. Search relevant documents
    docs = search_knowledge(
        query=req.message,
        lab_id=req.lab_id,
        hint_level=req.hint_level,
    )

    # 2. Check if question is lab-related (by similarity score)
    top_similarity = docs[0]["similarity"] if docs else 0
    is_lab_question = top_similarity >= SIMILARITY_THRESHOLD

    # 3. Generate response based on mode
    # If the user asks about the page generally and we have context, bias towards LAB mode
    # even if similarity is somewhat low, because they might just ask "ช่วยหน่อย"
    if is_lab_question or (req.page_context and len(docs) > 0 and top_similarity > 0.2):
        # Lab mode — use RAG context only
        reply = generate_lab_response(req.message, docs, req.page_context)
        sources = [
            {"lab_id": d["lab_id"], "type": d["type"], "similarity": d["similarity"]}
            for d in docs[:3]
        ]
        print(f"  📚 LAB mode (sim={top_similarity:.3f}) → {req.message[:50]}")
    else:
        # General mode — let LLM answer freely
        reply = generate_general_response(req.message, req.page_context)
        sources = []
        print(f"  💬 GENERAL mode (sim={top_similarity:.3f}) → {req.message[:50]}")

    return ChatResponse(reply=reply, sources=sources)


@app.get("/api/health")
def health():
    """Health check"""
    return {"status": "ok", "model": LLM_MODEL, "embedding": EMBEDDING_MODEL}


# ── Run ─────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting SecureSensei RAG API on http://localhost:8000")
    print("📖 API docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
