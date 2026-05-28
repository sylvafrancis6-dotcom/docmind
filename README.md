# ⚡ DocMind — AI-Powered Document Intelligence

> Upload any document. Ask anything. Get instant AI-powered answers.

![DocMind](https://img.shields.io/badge/Built%20with-React%20%2B%20FastAPI-00FFB2?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Claude%20Sonnet-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

-----

## 🚀 What It Does

DocMind is a full-stack AI web application that allows users to upload documents and have intelligent conversations about their content. Powered by Claude (Anthropic), it understands context, summarises content, and answers questions with precision.

**Use cases:**

- Quickly extract key information from long documents
- Summarise reports, contracts, or research papers
- Ask follow-up questions in a natural chat interface
- Process CSV data, JSON configs, or plain text files

-----

## 🛠 Tech Stack

|Layer        |Technology                            |
|-------------|--------------------------------------|
|Frontend     |React, Tailwind-inspired CSS-in-JS    |
|Backend      |Python, FastAPI                       |
|AI           |Anthropic Claude API (claude-sonnet-4)|
|Auth (future)|JWT / OAuth2                          |
|Deployment   |AWS (EC2 + S3) / Docker               |

-----

## 📁 Project Structure

```
docmind/
├── frontend/
│   └── src/
│       └── App.jsx          # Full React frontend
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
└── README.md
```

-----

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Anthropic API key → [get one here](https://console.anthropic.com)

-----

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set your API key
export ANTHROPIC_API_KEY=your_api_key_here

# Run the server
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

-----

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

-----

## 🔌 API Endpoints

|Method  |Endpoint       |Description                                    |
|--------|---------------|-----------------------------------------------|
|`POST`  |`/upload`      |Upload a document, returns `session_id`        |
|`POST`  |`/chat`        |Send a message with `session_id` + chat history|
|`DELETE`|`/session/{id}`|Clear a document session                       |
|`GET`   |`/health`      |Health check                                   |

-----

## 💡 Example API Usage

```python
import requests

# 1. Upload document
with open("report.txt", "rb") as f:
    res = requests.post("http://localhost:8000/upload", files={"file": f})
session_id = res.json()["session_id"]

# 2. Ask a question
res = requests.post("http://localhost:8000/chat", json={
    "session_id": session_id,
    "messages": [{"role": "user", "content": "What are the key findings?"}]
})
print(res.json()["response"])
```

-----

## 🗺 Roadmap

- [ ] PDF support (PyMuPDF)
- [ ] PostgreSQL session persistence
- [ ] User authentication (JWT)
- [ ] Multi-document comparison
- [ ] Export chat as PDF report
- [ ] Deployed live demo

-----

## 👤 Author

**Sylvester Francis**
Software Engineer & AI Developer — Lagos, Nigeria
📧 sylvafrancis6@gmail.com

-----

## 📄 License

MIT License — free to use and modify.
