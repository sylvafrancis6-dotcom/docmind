import { useState, useRef, useEffect } from "react";

const ACCENT = "#00FFB2";
const BG = "#0a0a0f";
const SURFACE = "#12121a";
const BORDER = "#1e1e2e";

const styles = {
  root: {
    minHeight: "100vh",
    background: BG,
    color: "#e8e8f0",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    borderBottom: `1px solid ${BORDER}`,
    padding: "20px 40px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: SURFACE,
  },
  logo: { fontSize: "22px", fontWeight: "700", color: ACCENT, letterSpacing: "-0.5px" },
  logoSub: { fontSize: "13px", color: "#555570", marginTop: "2px" },
  main: {
    flex: 1, display: "flex", gap: "0", maxWidth: "1200px",
    margin: "0 auto", width: "100%", padding: "40px 24px",
  },
  leftPanel: { width: "320px", flexShrink: 0, marginRight: "40px" },
  rightPanel: { flex: 1, display: "flex", flexDirection: "column" },
  uploadZone: {
    border: `2px dashed ${BORDER}`, borderRadius: "12px", padding: "32px 20px",
    textAlign: "center", cursor: "pointer", transition: "all 0.2s",
    background: SURFACE, marginBottom: "20px",
  },
  uploadZoneActive: { borderColor: ACCENT, background: "#00FFB208" },
  uploadIcon: { fontSize: "32px", marginBottom: "12px" },
  uploadTitle: { fontSize: "14px", fontWeight: "600", color: "#cccce0", marginBottom: "6px" },
  uploadSub: { fontSize: "12px", color: "#555570" },
  fileChip: {
    background: "#00FFB215", border: `1px solid ${ACCENT}40`, borderRadius: "8px",
    padding: "10px 14px", display: "flex", alignItems: "center",
    gap: "10px", marginBottom: "20px", fontSize: "13px",
  },
  fileIcon: { fontSize: "18px" },
  fileName: { flex: 1, color: ACCENT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  clearBtn: { background: "none", border: "none", color: "#555570", cursor: "pointer", fontSize: "16px", padding: "0" },
  sectionLabel: {
    fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px",
    color: "#555570", textTransform: "uppercase", marginBottom: "12px",
  },
  suggestionsBox: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px" },
  suggestionBtn: {
    display: "block", width: "100%", background: "none", border: `1px solid ${BORDER}`,
    borderRadius: "8px", padding: "10px 12px", color: "#9999bb", fontSize: "12px",
    textAlign: "left", cursor: "pointer", marginBottom: "8px", transition: "all 0.15s", fontFamily: "inherit",
  },
  chatArea: {
    flex: 1, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "12px",
    padding: "24px", overflowY: "auto", marginBottom: "16px", minHeight: "400px",
    display: "flex", flexDirection: "column", gap: "16px",
  },
  emptyState: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", color: "#333350", textAlign: "center", gap: "12px",
  },
  emptyIcon: { fontSize: "48px", opacity: 0.4 },
  emptyText: { fontSize: "14px" },
  msgUser: {
    alignSelf: "flex-end", background: "#00FFB218", border: `1px solid ${ACCENT}30`,
    borderRadius: "12px 12px 2px 12px", padding: "12px 16px", maxWidth: "75%",
    fontSize: "14px", color: "#e0e0f0", lineHeight: "1.6",
  },
  msgBot: {
    alignSelf: "flex-start", background: "#1a1a28", border: `1px solid ${BORDER}`,
    borderRadius: "2px 12px 12px 12px", padding: "12px 16px", maxWidth: "80%",
    fontSize: "14px", color: "#c8c8e0", lineHeight: "1.6",
  },
  msgLabel: { fontSize: "10px", letterSpacing: "1px", marginBottom: "6px", opacity: 0.5 },
  inputRow: { display: "flex", gap: "10px", alignItems: "flex-end" },
  input: {
    flex: 1, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "10px",
    padding: "14px 16px", color: "#e8e8f0", fontSize: "14px", fontFamily: "inherit",
    outline: "none", resize: "none", minHeight: "50px", maxHeight: "120px", transition: "border-color 0.2s",
  },
  sendBtn: {
    background: ACCENT, border: "none", borderRadius: "10px", width: "50px", height: "50px",
    cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0, transition: "opacity 0.2s",
  },
  statusBar: {
    display: "flex", alignItems: "center", gap: "8px", fontSize: "11px",
    color: "#555570", padding: "0 4px", marginBottom: "8px",
  },
  dot: { width: "6px", height: "6px", borderRadius: "50%", background: ACCENT, animation: "pulse 1.5s infinite" },
  thinking: {
    alignSelf: "flex-start", display: "flex", gap: "6px", padding: "14px 18px",
    background: "#1a1a28", border: `1px solid ${BORDER}`, borderRadius: "2px 12px 12px 12px",
  },
  thinkingDot: { width: "7px", height: "7px", borderRadius: "50%", background: ACCENT, opacity: 0.4 },
};

const SUGGESTIONS = [
  "📄 What is this document about?",
  "🔑 What are the key points?",
  "📊 Summarise in 3 bullet points",
  "❓ What questions does this answer?",
];

export default function App() {
  const [file, setFile] = useState(null);
  const [fileText, setFileText] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const chatRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const readFile = (f) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setFileText(e.target.result);
    reader.readAsText(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) readFile(f);
  };

  const handleFileInput = (e) => {
    const f = e.target.files[0];
    if (f) readFile(f);
  };

  const sendMessage = async (text) => {
    const q = text || input.trim();
    if (!q || !fileText) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are DocMind, an AI assistant that answers questions about documents.
Be concise, accurate, and cite specific parts of the document when relevant.
Here is the document content:\n\n${fileText.slice(0, 8000)}`,
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: q },
          ],
        }),
      });
      const data = await response.json();
      const answer = data.content?.[0]?.text || "Sorry, I couldn't process that.";
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Error connecting to AI. Please try again." }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 4px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .sugg:hover { border-color: ${ACCENT}60 !important; color: #ccccee !important; background: #00FFB208 !important; }
        .send:hover { opacity: 0.85; }
      `}</style>

      <header style={styles.header}>
        <div>
          <div style={styles.logo}>⚡ DocMind</div>
          <div style={styles.logoSub}>AI-Powered Document Intelligence</div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.leftPanel}>
          {!file ? (
            <div
              style={{ ...styles.uploadZone, ...(dragging ? styles.uploadZoneActive : {}) }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <div style={styles.uploadIcon}>📂</div>
              <div style={styles.uploadTitle}>Drop your document here</div>
              <div style={styles.uploadSub}>TXT, MD, CSV, JSON — click to browse</div>
              <input ref={fileInputRef} type="file" accept=".txt,.md,.csv,.json"
                style={{ display: "none" }} onChange={handleFileInput} />
            </div>
          ) : (
            <div style={styles.fileChip}>
              <span style={styles.fileIcon}>📄</span>
              <span style={styles.fileName}>{file.name}</span>
              <button style={styles.clearBtn}
                onClick={() => { setFile(null); setFileText(""); setMessages([]); }}>✕</button>
            </div>
          )}
          <div style={styles.sectionLabel}>Try asking</div>
          <div style={styles.suggestionsBox}>
            {SUGGESTIONS.map((s) => (
              <button key={s} className="sugg" style={styles.suggestionBtn}
                onClick={() => file && sendMessage(s.replace(/^[^\s]+ /, ""))}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.rightPanel}>
          {loading && (
            <div style={styles.statusBar}>
              <div style={styles.dot} />
              DocMind is thinking...
            </div>
          )}
          <div ref={chatRef} style={styles.chatArea}>
            {messages.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🧠</div>
                <div style={styles.emptyText}>
                  {file ? "Document loaded. Ask me anything about it." : "Upload a document to get started."}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={m.role === "user" ? styles.msgUser : styles.msgBot}>
                  <div style={styles.msgLabel}>{m.role === "user" ? "YOU" : "DOCMIND"}</div>
                  {m.content}
                </div>
              ))
            )}
            {loading && (
              <div style={styles.thinking}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ ...styles.thinkingDot,
                    animation: `bounce 1s ${i * 0.15}s infinite` }} />
                ))}
              </div>
            )}
          </div>
          <div style={styles.inputRow}>
            <textarea
              style={styles.input}
              placeholder={file ? "Ask anything about your document..." : "Upload a document first..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!file || loading}
            />
            <button
              className="send"
              style={{ ...styles.sendBtn, opacity: (!file || loading || !input.trim()) ? 0.4 : 1 }}
              onClick={() => sendMessage()}
              disabled={!file || loading || !input.trim()}
            >
              ↑
            </button>
          </div>
