import "./AdminPanel.css";
import { useState } from "react";

const initialColleges = [
    { id: 1, name: "College A", location: "City X" },
    { id: 2, name: "College B", location: "City Y" },
    { id: 3, name: "College C", location: "City Z" },
];

function AdminPanel() {
    const [colleges, setColleges] = useState(initialColleges);
    const [newCollege, setNewCollege] = useState({ name: "", location: "" });

    const handleAddCollege = () => {
        if (newCollege.name && newCollege.location) {
            setColleges([...colleges, { id: colleges.length + 1, ...newCollege }]);
            setNewCollege({ name: "", location: "" });
        }
    };

    const handleDeleteCollege = (id) => {
        setColleges(colleges.filter((college) => college.id !== id));
    };

    return (
        <div className="admin-panel-container">
            <h1>Admin Panel</h1>
            <div className="add-college-form">
                <input
                    type="text"
                    placeholder="College Name"
                    value={newCollege.name}
                    onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={newCollege.location}
                    onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
                />
                <button onClick={handleAddCollege}>Add College</button>
            </div>
            <div className="college-list">
                {colleges.map((college) => (
                    <div key={college.id} className="college-card">
                        <h3>{college.name}</h3>
                        <p><strong>Location:</strong> {college.location}</p>
                        <button className="delete-btn" onClick={() => handleDeleteCollege(college.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPanel;