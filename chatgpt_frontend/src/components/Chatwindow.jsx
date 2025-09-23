import { useEffect, useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";

export default function Chatwindow({ currentThread, onSelectThread}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { id } = useParams();

  // Load existing thread messages
useEffect(() => {
  if (id) {
    const token = localStorage.getItem("access"); // Retrieve the access token
    API.get(`api/threads/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
    })
      .then((res) => {
        console.log("Thread Details:", res.data);
        setMessages(res.data.messages);
        onSelectThread(res.data);
      })
      .catch((err) => console.error(err));
  }
}, [id]);

const sendMessage = async () => {
  if (!input.trim()) return;

  const token = localStorage.getItem("access"); // Retrieve the access token

  try {
    if (currentThread) {
      // Continue chat
      const res = await API.post(
        `api/threads/${currentThread.id}/messages/`,
        { content: input },
        {
          headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
        }
      );
      setMessages([
        ...messages,
        { sender: "user", content: input },
        { sender: "assistant", content: res.data.assistant },
      ]);
    } else {
      // Start new chat
      const res = await API.post(
        `api/messages/`,
        { content: input },
        {
          headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
        }
      );
      onSelectThread({ id: res.data.thread_id, title: res.data.title || "New Chat" });
      setMessages([
        { sender: "user", content: input },
        { sender: "assistant", content: res.data.assistant },
      ]);
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
               style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", maxWidth: "80%"}}
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
