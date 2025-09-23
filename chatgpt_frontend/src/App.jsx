import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/Chatwindow";
import { useState } from "react";

function App() {
  const [activeThread, setActiveThread] = useState(null);

  return (
    <BrowserRouter>
   <Routes>
  {/* Login Page */}
  <Route path="/" element={<Login />} />

  {/* Chat without thread */}
  <Route
    path="/chat"
    element={
      <div className="d-flex vh-100">
        <Sidebar onSelectThread={setActiveThread} currentThread={activeThread} />
        <div className="flex-grow-1">
          <ChatWindow currentThread={activeThread} onSelectThread={setActiveThread} />
        </div>
      </div>
    }
  />

  {/* Chat with thread id */}
  <Route
    path="/chat/:id"
    element={
      <div className="d-flex vh-100">
        <Sidebar onSelectThread={setActiveThread} currentThread={activeThread} />
        <div className="flex-grow-1">
          <ChatWindow currentThread={activeThread} onSelectThread={setActiveThread} />
        </div>
      </div>
    }
  />
</Routes>

    </BrowserRouter>
  );
}

export default App;
