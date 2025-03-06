import "./Home.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function Home() {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL ;

    useEffect(() => {
        const fetchColleges = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}/colleges`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();

                if (!data || !data.data || !Array.isArray(data.data)) {
                    throw new Error("Invalid data format from API");
                }

                // Sort colleges alphabetically and pick top 3
                const sortedColleges = data.data
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .slice(0, 3);

                setColleges(sortedColleges);
                setError(null);
            } catch (error) {
                console.error("Error fetching colleges in Home:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchColleges();
    }, [apiUrl]);

    return (
        <div className="home-page">
            <main className="home-container">
                <header className="hero-section">
                    <h1 style={{color:"wheat"}}>AI-Powered Multi-College Navigator</h1>
                    <p style={{ color: "wheat" }}>Explore campuses with interactive 2D/3D maps & AI chatbot</p>
                </header>

                <section className="featured-colleges">
                    <h2>Featured Colleges</h2>
                    <div className="college-list">
                        {loading ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                                <p>Loading colleges...</p>
                            </div>
                        ) : error ? (
                            <div className="error-container">
                                <p>Error: {error}</p>
                                <button onClick={() => window.location.reload()} className="btn btn-retry">Try Again</button>
                            </div>
                        ) : colleges.length > 0 ? (
                            colleges.map((college) => (
                                <div key={college._id} className="college-card">
                                    <h3>{college.name}</h3>
                                    <p className="location">{college.city}, {college.state}</p>
                                    {college.courses?.length > 0 && (
                                        <>
                                            <p className="course">Featured Course: {college.courses[0]?.name}</p>
                                            <p className="fees">Fees: ₹{college.courses[0]?.fees?.toLocaleString()}</p>
                                        </>
                                    )}
                                    {college.contact && (
                                        <div className="contact">
                                            <p>Email: {college.contact.email}</p>
                                            <p>Phone: {college.contact.phone}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No colleges available.</p>
                        )}
                    </div>
                    <Link to="/colleges" className="cta-button">More Colleges</Link>

                </section>
            </main>
        </div>
    );
}

export default Home;
