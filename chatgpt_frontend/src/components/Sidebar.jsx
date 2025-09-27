import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Sidebar({ currentThread, onSelectThread }) {
  const [threads, setThreads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    API.get("/api/threads/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setThreads(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleThreadClick = (t) => {
    onSelectThread(t);
    navigate(`/chat/${t.id}`);
  };

  const startNewChat = () => {
    // Just create a temporary chat object (no backend call)
    const tempThread = { id: null, title: "New Chat", messages: [] };
    onSelectThread(tempThread);
    navigate(`/chat/new`); // Use a special route for temporary chats
  };
    const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate('/'); // Refresh to redirect to login
  };

  return (
    <div className="d-flex flex-column bg-light border-end p-3" style={{ width: "250px" }}>
      <button className="btn btn-primary w-100 mb-3" onClick={startNewChat}>
        ➕ New Chat
      </button>
      <ul className="list-group">
        {threads.map((t) => (
          <li
            key={t.id}
            className={`list-group-item ${currentThread?.id === t.id ? "active" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => handleThreadClick(t)}
          >
            {t.title || `Thread ${t.id}`}
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <button
          className="btn btn-danger w-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
