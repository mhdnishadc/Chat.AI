import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function ChatWindow({ currentThread, onSelectThread }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { id } = useParams();

  // Load existing thread messages only if id exists (real thread)
  useEffect(() => {
    if (currentThread?.id) {
      const token = localStorage.getItem("access");
      API.get(`/api/threads/${currentThread.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setMessages(res.data.messages))
        .catch((err) => console.error(err));
    } else {
      setMessages([]); // temporary new chat
    }
  }, [currentThread]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("access");
    try {
      let threadId = currentThread?.id;
      let res;

      if (!threadId) {
        // First message → create backend thread
        res = await API.post(
          `/api/messages/`,
          { content: input },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update current thread with backend response
        onSelectThread({
          id: res.data.thread_id,
          title: res.data.title || "New Chat",
          messages: [
            { sender: "user", content: input },
            { sender: "assistant", content: res.data.assistant },
          ],
        });
        setMessages([
          { sender: "user", content: input },
          { sender: "assistant", content: res.data.assistant },
        ]);
      } else {
        // Continue chat in existing thread
        res = await API.post(
          `/api/threads/${threadId}/messages/`,
          { content: input },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages((prev) => [
          ...prev,
          { sender: "user", content: input },
          { sender: "assistant", content: res.data.assistant },
        ]);
        fetchThreads();
      }
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="d-flex flex-column flex-grow-1 p-2" style={{ height: "100vh" }}>
      <div className="flex-grow-1 overflow-auto border p-2 mb-3 rounded">
        {messages.map((m, idx) => (
          <div key={idx} className={`mb-2 ${m.sender === "user" ? "text-end" : "text-start"}`}>
            <span
              className={`badge ${m.sender === "user" ? "bg-primary text-white" : "bg-light text-dark"}`}
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", maxWidth: "80%" }}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="btn btn-success" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
