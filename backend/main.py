from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import anthropic
import os

app = FastAPI(title="DocMind API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

document_store = {}


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    session_id: str
    messages: List[Message]


@app.get("/")
def root():
    return {"status": "DocMind API running", "version": "1.0.0"}


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    content = await file.read()
    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File must be a readable text file.")

    if len(text) > 100_000:
        text = text[:100_000]

    import uuid
    session_id = str(uuid.uuid4())
    document_store[session_id] = {
        "filename": file.filename,
        "content": text,
        "char_count": len(text),
    }

    return {
        "session_id": session_id,
        "filename": file.filename,
        "char_count": len(text),
        "message": "Document uploaded successfully.",
    }


@app.post("/chat")
async def chat(request: ChatRequest):
    if request.session_id not in document_store:
        raise HTTPException(status_code=404, detail="Session not found. Please upload a document first.")

    doc = document_store[request.session_id]

    system_prompt = f"""You are DocMind, an expert AI assistant that answers questions 
about documents with precision and clarity. 

Always:
- Answer based on the document content provided
- Cite specific sections when relevant
- Be concise but thorough
- If something is not in the document, say so clearly

Document: {doc['filename']}

Content:
{doc['content'][:8000]}"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=system_prompt,
        messages=[{"role": m.role, "content": m.content} for m in request.messages],
    )

    return {
        "response": response.content[0].text,
        "session_id": request.session_id,
        "filename": doc["filename"],
    }


@app.delete("/session/{session_id}")
def clear_session(session_id: str):
    if session_id in document_store:
        del document_store[session_id]
        return {"message": "Session cleared."}
    raise HTTPException(status_code=404, detail="Session not found.")


@app.get("/health")
def health():
    return {"status": "healthy"}
