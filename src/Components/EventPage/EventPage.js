import "./EventPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import EventManagement from "./EventManagement";  // ✅ Import Event Management Component

const API_URL = process.env.REACT_APP_API_URL;

function EventPage() {
    const [search, setSearch] = useState("");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Get logged-in user
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ Fetch events from API on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_URL}/events`);
                if (response.data.success) {
                    setEvents(response.data.data);
                } else {
                    throw new Error("Failed to fetch events");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // ✅ Filter events based on search input
    const filteredEvents = events.filter(event =>
        event.event_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="event-page-container">
            <h1>Upcoming Events</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-bar"
            />

            {/* ✅ Show Event Management Panel for Admins */}
            {user && user.role === "admin" && (
                <EventManagement events={events} setEvents={setEvents} />
            )}

            {/* Loading State */}
            {loading ? (
                <p>Loading events...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="event-list">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <div key={event._id} className="event-card">
                                <h3>{event.event_name}</h3>
                                <p><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
                                <p><strong>Location:</strong> {event.location}</p>
                                <p><strong>College:</strong> {event.college_name}</p>
                                <p><strong>Description:</strong> {event.description}</p>
                                {event.registration_link && (
                                    <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="btn-register">
                                        Register
                                    </a>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default EventPage;
