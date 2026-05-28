# ⚡ DocMind — AI-Powered Document Intelligence

> Upload any document. Ask anything. Get instant AI-powered answers.

![DocMind](https://img.shields.io/badge/Built%20with-React%20%2B%20FastAPI-00FFB2?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Claude%20Sonnet-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🚀 What It Does

DocMind is a full-stack AI web application that allows users to upload documents and have intelligent conversations about their content. Powered by Claude (Anthropic), it understands context, summarises content, and answers questions with precision.

**Use cases:**
- Quickly extract key information from long documents
- Summarise reports, contracts, or research papers
- Ask follow-up questions in a natural chat interface
- Process CSV data, JSON configs, or plain text files

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, CSS-in-JS |
| Backend | Python, FastAPI |
| AI | Anthropic Claude API |
| Deployment | AWS / Docker |

---

## 📁 Project Structure


---

docmind/
├── frontend/
│   └── src/
│       └── App.jsx
├── backend/
│   ├── main.py
│   └── requirements.txt
└── README.md

## ⚙️ Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_api_key_here
uvicorn main:app --reload --port 8000

Frontend
cd frontend
npm install
npm run dev

