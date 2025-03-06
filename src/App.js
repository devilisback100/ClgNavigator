import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./Components/HomeSection/Home";
import CollegeSelection from "./Components/CollegeSelection/CollegeSection";
import MapPage from "./Components/MapPage/MapPage";
import Events from "./Components/EventPage/EventPage";
import SearchDirectory from "./Components/SearchDirectory/SearchDirectory";
import UserProfile from "./Components/UserProfile/UserProfile";
import AdminPanel from "./Components/AdminPanel/AdminPanel";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/LoginPage/Login";
import CollegeForm from "./Components/CollegeSelection/CollegeForm";
import "./App.css";
import { useState, useEffect } from "react";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [showChatbot, setShowChatbot] = useState(window.innerWidth > 768); // Initially open on big screens

  // ✅ Load user from localStorage when App starts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // ✅ Handle user login
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ✅ Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // ✅ Toggle chatbot visibility (only for small screens)
  const toggleChatbot = () => {
    if (window.innerWidth <= 768) {
      setShowChatbot(!showChatbot);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="app-wrapper">
          <Navbar
            user={user}
            handleLogout={handleLogout}
            toggleSidebar={toggleSidebar}
          />
          <div className="content-wrapper">
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/colleges" element={<CollegeSelection />} />
                <Route path="/events" element={<Events />} />
                <Route path="/search" element={<SearchDirectory />} />
                <Route path="/profile" element={<UserProfile user={user} handleLogout={handleLogout} />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/college-form" element={<CollegeForm />} />
                <Route path="/login" element={<Login handleLogin={handleLogin} />} />
              </Routes>
            </div>

            {/* Chatbot Toggle Button (Only for small screens) */}
            {window.innerWidth <= 768 && (
              <button className="chatbot-toggle" onClick={toggleChatbot}>
                {showChatbot ? "Close Chatbot" : "Open Chatbot"}
              </button>
            )}

            {/* Chatbot Sidebar (Always visible on big screens, toggle for small) */}
            {showChatbot && (
              <div className="chatbot-sidebar">
                <iframe
                  src="https://cmr-s-chatbot-4.onrender.com/"
                  title="Chatbot"
                  frameBorder="0"
                  className="chatbot-iframe"
                />
              </div>
            )}
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
