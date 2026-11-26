import { useState } from "react";

function ChatPanel({ onSendMock }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Bonjour ! Je suis l'assistant BuildGen AI. Décrivez votre bâtiment.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    const userText = input;
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `🤖 Je comprends : "${userText}". (BETA)` },
      ]);
    }, 500);

    if (onSendMock) onSendMock(userText);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span style={{ fontSize: 16, fontWeight: "bold" }}>
          💬 Assistant IA
        </span>
        <span style={styles.badge}>BETA</span>
      </div>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={msg.role === "user" ? styles.msgUser : styles.msgBot}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <textarea
          style={styles.textarea}
          placeholder="Décrivez votre bâtiment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
        />
        <button style={styles.sendBtn} onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    position: "absolute",
    bottom: 16,
    left: 16,
    width: 340,
    height: 350, // Height mta3ek elli 3jbek
    background: "rgba(20, 20, 25, 0.95)",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    overflow: "hidden",
    zIndex: 10,
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid #333",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    fontSize: 10,
    background: "#4a90e2",
    padding: "2px 6px",
    borderRadius: 4,
    fontWeight: "bold",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  msgUser: {
    alignSelf: "flex-end",
    background: "#4a90e2",
    padding: "8px 12px",
    borderRadius: "12px 12px 2px 12px",
    maxWidth: "85%",
  },
  msgBot: {
    alignSelf: "flex-start",
    background: "#2a2a35",
    padding: "8px 12px",
    borderRadius: "12px 12px 12px 2px",
    maxWidth: "85%",
  },
  inputArea: {
    padding: 12,
    borderTop: "1px solid #333",
    display: "flex",
    gap: 6,
  },
  textarea: {
    flex: 1,
    background: "#111",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: 6,
    padding: "8px",
    resize: "none",
    fontFamily: "inherit",
    fontSize: 13,
    outline: "none",
  },
  sendBtn: {
    background: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    width: 36,
    cursor: "pointer",
    fontSize: 16,
  },
};

export default ChatPanel;
