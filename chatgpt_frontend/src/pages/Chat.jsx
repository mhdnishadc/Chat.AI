import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/Chatwindow";

export default function Dashboard() {
  const [currentThread, setCurrentThread] = useState(null);

  return (
    <div className="d-flex">
      <Sidebar currentThread={currentThread} setCurrentThread={setCurrentThread} />
      <ChatWindow currentThread={currentThread} setCurrentThread={setCurrentThread} />
    </div>
  );
}
