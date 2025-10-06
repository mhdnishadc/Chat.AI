import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/Chatwindow";
import { useState } from "react";
import SignUp from "./pages/SignUp";

function App() {
  const [activeThread, setActiveThread] = useState(null);
  const [refreshSidebar, setRefreshSidebar] = useState(0);

  // Function to trigger sidebar refresh
  const triggerSidebarRefresh = () => {
    setRefreshSidebar(prev => prev + 1);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Chat without thread */}
        <Route
          path="/chat"
          element={
            <div className="d-flex vh-100">
              <Sidebar 
                onSelectThread={setActiveThread} 
                currentThread={activeThread}
                refreshTrigger={refreshSidebar}
              />
              <div className="flex-grow-1">
                <ChatWindow 
                  currentThread={activeThread} 
                  onSelectThread={setActiveThread}
                  onThreadCreated={triggerSidebarRefresh}
                />
              </div>
            </div>
          }
        />

        {/* Chat with thread id */}
        <Route
          path="/chat/:id"
          element={
            <div className="d-flex vh-100">
              <Sidebar 
                onSelectThread={setActiveThread} 
                currentThread={activeThread}
                refreshTrigger={refreshSidebar}
              />
              <div className="flex-grow-1">
                <ChatWindow 
                  currentThread={activeThread} 
                  onSelectThread={setActiveThread}
                  onThreadCreated={triggerSidebarRefresh}
                />
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;