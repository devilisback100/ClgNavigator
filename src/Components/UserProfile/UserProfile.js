import "./UserProfile.css";
import { useNavigate } from "react-router-dom";

function UserProfile({ user, handleLogout }) {
    const navigate = useNavigate();

    // ✅ Redirect to login if not logged in
    if (!user) {
        return (
            <div className="user-profile-container">
                <h1>User Profile</h1>
                <p>You are not logged in.</p>
                <button className="login-btn" onClick={() => navigate("/login")}>
                    Login
                </button>
            </div>
        );
    }

    const handleAdminAction = (action) => {
        if (user.role !== "admin") {
            alert(`Only admin can ${action}`);
            return;
        }

        // Redirect with state to differentiate between "Add" and "Update"
        if (action === "Add College") {
            navigate("/college-form", { state: { mode: "add" } });
        } else if (action === "Update College Info") {
            navigate("/college-form", { state: { mode: "update" } });
        } else {
            alert(`${action} functionality triggered`);
        }
    };

    return (
        <div className={`user-profile-container ${user.theme?.toLowerCase() || "light"}-theme`}>
            <h1>User Profile</h1>
            <div className="profile-card">
                <img src={user.profile_picture} alt="Profile" className="profile-picture" />
                <h2>{user.name}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>

                <h3>Saved Locations</h3>
                <ul>
                    {user.savedLocations && user.savedLocations.length > 0 ? (
                        user.savedLocations.map((location, index) => (
                            <li key={index}>{location}</li>
                        ))
                    ) : (
                        <p>No saved locations yet.</p>
                    )}
                </ul>

                {/* Buttons for admin actions */}
                {user.role === "admin" && (
                    <div className="admin-actions">
                       
                        <button className="action-btn" onClick={() => handleAdminAction("Add College")}>
                            Add College
                        </button>
                        <button className="action-btn" onClick={() => handleAdminAction("Update College Info")}>
                            Update College Info
                        </button>
                    </div>
                )}

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default UserProfile;
