import { useState } from "react";
import axios from "axios";
import "./EventManagement.css";

const API_URL = process.env.REACT_APP_API_URL ;

function EventManagement({ events, setEvents }) {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        console.error("Error parsing user data:", error);
    }

    const [formData, setFormData] = useState({
        college_name: "",
        event_name: "",
        description: "",
        date: "",
        location: "",
        registration_link: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [showForm, setShowForm] = useState(false); // ✅ Controls form visibility

    if (!user || user.role !== "admin") {
        return null; // Hide if not admin
    }

    // ✅ Handle input change
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Open form for adding new event
    const openAddEventForm = () => {
        setIsEditing(false);
        setEditingEventId(null);
        setShowForm(true);
        setFormData({
            college_name: "",
            event_name: "",
            description: "",
            date: "",
            location: "",
            registration_link: "",
        });
    };

    // ✅ Open form for updating existing event
    const openUpdateEventForm = (event) => {
        setIsEditing(true);
        setEditingEventId(event._id);
        setShowForm(true);
        setFormData({
            college_name: event.college_name,
            event_name: event.event_name,
            description: event.description,
            date: event.date.split("T")[0], // Extract date part
            location: event.location,
            registration_link: event.registration_link || "",
        });
    };

    // ✅ Handle form submission (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.college_name || !formData.event_name || !formData.date || !formData.location) {
            alert("All fields except registration link are required.");
            return;
        }

        try {
            if (isEditing) {
                const response = await axios.put(`${API_URL}/events/${editingEventId}`, formData);
                if (response.data.success) {
                    alert("Event updated successfully!");
                    setEvents(events.map(event => event._id === editingEventId ? { ...event, ...formData } : event));
                } else {
                    alert("Failed to update event.");
                }
            } else {
                const response = await axios.post(`${API_URL}/events`, formData);
                if (response.data.success) {
                    alert("Event added successfully!");
                    setEvents([...events, response.data.data]);
                } else {
                    alert("Failed to add event.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while processing the request.");
        }

        closeForm(); // ✅ Close form after submission
    };

    // ✅ Handle deleting an event
    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) {
            return;
        }

        try {
            const response = await axios.delete(`${API_URL}/events/${eventId}`);
            if (response.data.success) {
                alert("Event deleted successfully!");
                setEvents(events.filter(event => event._id !== eventId));
            } else {
                alert("Failed to delete event.");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("An error occurred while deleting the event.");
        }
    };

    // ✅ Close form function (prevents unnecessary re-renders)
    const closeForm = () => {
        setShowForm(false);
        setIsEditing(false);
        setEditingEventId(null);
    };

    return (
        <div className="admin-controls">
            <h2>Admin Controls</h2>
            <button className="btn btn-primary" onClick={openAddEventForm}>➕ Add Event</button>

            {/* ✅ Event Form (Shows Only When Adding or Editing) */}
            {showForm && (
                <form onSubmit={handleSubmit} className="event-form">
                    <h3>{isEditing ? "Edit Event" : "Add New Event"}</h3>

                    <label>College Name:</label>
                    <input type="text" name="college_name" value={formData.college_name} onChange={handleInputChange} required />

                    <label>Event Name:</label>
                    <input type="text" name="event_name" value={formData.event_name} onChange={handleInputChange} required />

                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} required></textarea>

                    <label>Date:</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />

                    <label>Location:</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />

                    <label>Registration Link (Optional):</label>
                    <input type="url" name="registration_link" value={formData.registration_link} onChange={handleInputChange} />

                    <button type="submit" className="btn btn-success">
                        {isEditing ? "Update Event" : "Add Event"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={closeForm}>
                        Cancel
                    </button>
                </form>
            )}

            {/* ✅ Event List */}
            <div className="event-list">
                {events.map(event => (
                    <div key={event._id} className="event-card">
                        <h3>{event.event_name}</h3>
                        <button className="btn btn-warning" onClick={() => openUpdateEventForm(event)}>✏️ Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDeleteEvent(event._id)}>❌ Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventManagement;
