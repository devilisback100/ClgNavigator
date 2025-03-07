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
import LoginForm from "./LoginForm";
import "./App.css";
import { useState, useEffect } from "react";
import { IoClose, IoChatbubbleEllipses, IoExpand } from "react-icons/io5";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    setFullScreen(false);
  };

  const toggleFullScreen = () => {
    setFullScreen((prev) => !prev);
    setSidebarOpen(false);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="app-wrapper">
          <Navbar user={user} handleLogout={handleLogout} toggleSidebar={toggleSidebar} />
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
                <Route path="/Login-form" element={<LoginForm />} />
                <Route path="/login" element={<Login handleLogin={handleLogin} />} />
              </Routes>
            </div>

            {/* Chatbot Toggle Button */}
            <button
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                backgroundColor: "#9aa0e3",
                border: "none",
                color: "white",
                height: "50px",
                width: "50px",
                fontSize: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: "9999",
              }}
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <IoClose /> : <IoChatbubbleEllipses />}
            </button>

            {/* Viewer Button (Only Show in Sidebar Mode) */}
            {sidebarOpen && (
              <button
                style={{
                  position: "fixed",
                  bottom: "80px",
                  right: "20px",
                  backgroundColor: "#4caf50",
                  border: "none",
                  color: "white",
                  height: "50px",
                  width: "50px",
                  fontSize: "24px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: "9999",
                }}
                onClick={toggleFullScreen}
              >
                <IoExpand />
              </button>
            )}

            {/* Chatbot Sidebar (Full Height) */}
            {sidebarOpen && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  right: 0,
                  width: "390px",
                  height: "100vh",
                  backgroundColor: "white",
                  borderRadius: "10px 0 0 10px",
                  boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  zIndex: "101",
                }}
              >
                <iframe
                  src="https://cmr-s-chatbot-4.onrender.com/"
                  title="Chatbot"
                  frameBorder="0"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}

            {/* Full-Screen Chatbot */}
            {fullScreen && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: "10000",
                }}
              >
                <iframe
                  src="https://cmr-s-chatbot-4.onrender.com/"
                  title="Chatbot"
                  frameBorder="0"
                  style={{
                    width: "100%",
                    height: "90%",
                    borderRadius: "10px",
                    backgroundColor: "white",
                  }}
                />
                <button
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    backgroundColor: "red",
                    border: "none",
                    color: "white",
                    height: "40px",
                    width: "40px",
                    fontSize: "20px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: "10001",
                  }}
                  onClick={toggleFullScreen}
                >
                  <IoClose />
                </button>
              </div>
            )}
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
