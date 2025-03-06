import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export function Navbar({ user, handleLogout, toggleSidebar }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Close menu when a link is clicked
    const closeMenu = () => {
        if (menuOpen) setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="logo">College Navigator</div>

            <li
                className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
            />

            <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                <li><Link to="/colleges" onClick={closeMenu}>Colleges</Link></li>
                <li><Link to="/map" onClick={closeMenu}>Map</Link></li>
                <li><Link to="/events" onClick={closeMenu}>Events</Link></li>
                <li><Link to="/search" onClick={closeMenu}>Search</Link></li>
                <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>

                {/* Show "Logout" if user is logged in, otherwise show "Login" */}
                <div className="navbar-auth">
                    {user ? (
                        <>
                            <li onClick={handleLogout} className="logout-btn" style={{ marginBottom: "15px" }}>Logout</li>
                        </>
                    ) : (
                        <Link to="/login" className="login-btn" style={{marginBottom:"15px"}}>Login</Link>
                    )}

                    <li style={{color:"grey",backgroundColor:"white"}}
                        className="sidebar-toggle"
                        onClick={toggleSidebar}
                        aria-label="Toggle chatbot sidebar"
                    >
                        ChatBot
                    </li>
                </div>
            </ul>
        </nav>
    );
}

export default Navbar;