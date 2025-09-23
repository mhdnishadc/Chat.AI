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
    console.log("Thread ID:", t.id); // Debugging
    onSelectThread(t); // Use the correct prop name
    navigate(`/chat/${t.id}`); // Navigate to the correct frontend route
  };


  const startNewChat = async () => {
  const token = localStorage.getItem("access");
  try {
    const res = await API.post(
      "/api/threads/", // URL
      { title: "New Chat" }, // POST body (optional)
      {
        headers: { Authorization: `Bearer ${token}` } // ✅ Correct place
      }
    );
    onSelectThread(res.data); // Pass the full thread object
    navigate(`/chat/${res.data.id}`);
  } catch (err) {
    console.error("Failed to create a new thread:", err);
  }
};


  return (
    <div className="bg-light border-end p-3" style={{ width: "250px" }}>
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
    </div>
  );
}