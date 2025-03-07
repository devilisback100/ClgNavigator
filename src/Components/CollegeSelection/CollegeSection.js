import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CollegeSection.css";

export function CollegeSelection() {
    const [search, setSearch] = useState("");
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewMessage, setReviewMessage] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState(null);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    // Get logged-in user from localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

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

                // Sort colleges alphabetically
                const sortedColleges = data.data.sort((a, b) => a.name.localeCompare(b.name));
                setColleges(sortedColleges);
                setError(null);
            } catch (error) {
                console.error("Error fetching colleges:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchColleges();
    }, [apiUrl]);

    // Filtered list based on search
    const filteredColleges = colleges.filter(college =>
        college.name?.toLowerCase().includes(search.toLowerCase())
    );

    // Reset selected college when search changes
    useEffect(() => {
        if (selectedCollege && !filteredColleges.find(c => c.name === selectedCollege.name)) {
            setSelectedCollege(null);
        }
    }, [search, filteredColleges, selectedCollege]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleMapClick = (e, college) => {
        e.stopPropagation();
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(college.name)}`, "_blank");
    };

    const redirectToLogin = () => {
        navigate("/login", { state: { from: `/colleges`, message: "Please log in to submit a review" } });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setReviewError("Please log in to submit a review");
            return;
        }

        setReviewSubmitting(true);
        setReviewError(null);
        setReviewSuccess(false);

        try {
            const response = await fetch(`${apiUrl}/colleges/${encodeURIComponent(selectedCollege.name)}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_email: user.email,
                    rating: reviewRating,
                    message: reviewMessage
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit review");
            }

            // Success - refresh college data to show new review
            setReviewSuccess(true);
            setReviewMessage("");

            // Refresh the college data to include the new review
            const collegeResponse = await fetch(`${apiUrl}/colleges/${encodeURIComponent(selectedCollege.name)}`);
            if (collegeResponse.ok) {
                const collegeData = await collegeResponse.json();
                setSelectedCollege(collegeData.data);
            }

        } catch (error) {
            console.error("Error submitting review:", error);
            setReviewError(error.message);
        } finally {
            setReviewSubmitting(false);
        }
    };

    const renderStarRating = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= rating ? 'filled' : 'empty'}`}
                    onClick={() => setReviewRating(i)}
                >
                    {i <= rating ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    };

    const renderReviews = () => {
        if (!selectedCollege.reviews || selectedCollege.reviews.length === 0) {
            return (
                <div className="no-reviews">
                    <p>No reviews yet. Be the first to share your experience!</p>
                </div>
            );
        }

        return (
            <div className="reviews-list">
                {selectedCollege.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <div className="review-header">
                            <div className="review-stars">
                                {Array(5).fill().map((_, i) => (
                                    <span key={i} className={`star ${i < review.rating ? 'filled' : 'empty'}`}>
                                        {i < review.rating ? '★' : '☆'}
                                    </span>
                                ))}
                            </div>
                            <div className="review-author">
                                {review.user_email && review.user_email.split('@')[0]}
                            </div>
                            <div className="review-date">
                                {new Date(review.timestamp).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="review-message">{review.message}</div>
                    </div>
                ))}
            </div>
        );
    };

    const renderReviewForm = () => {
        if (!user) {
            return (
                <div className="login-prompt">
                    <p>You need to log in to submit a review.</p>
                    <button
                        className="btn btn-primary"
                        onClick={redirectToLogin}
                    >
                        Log In
                    </button>
                </div>
            );
        }

        return (
            <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                    <label>Your Rating:</label>
                    <div className="rating-selector">
                        {renderStarRating(reviewRating)}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="reviewMessage">Your Review:</label>
                    <textarea
                        id="reviewMessage"
                        value={reviewMessage}
                        onChange={(e) => setReviewMessage(e.target.value)}
                        placeholder="Share your experience with this college..."
                        rows="4"
                        required
                    ></textarea>
                </div>

                {reviewError && (
                    <div className="review-error">
                        <p>{reviewError}</p>
                    </div>
                )}

                {reviewSuccess && (
                    <div className="review-success">
                        <p>Review submitted successfully!</p>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={reviewSubmitting}
                >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        );
    };

    return (
        <div className="college-container">
            <h1>Find Your Perfect College</h1>

            <div className="search-section">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search colleges by name..."
                        value={search}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    {search && (
                        <button
                            className="search-clear"
                            onClick={() => setSearch("")}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="content-section">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading colleges...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <div className="error-icon">⚠️</div>
                        <p>Error: {error}</p>
                        <button onClick={() => window.location.reload()} className="btn btn-retry">Try Again</button>
                    </div>
                ) : selectedCollege ? (
                    <div className="college-details">
                        <div className="college-header">
                            <h2>{selectedCollege.name}</h2>
                            <button
                                className="btn btn-back"
                                onClick={() => setSelectedCollege(null)}
                            >
                                ← Back to List
                            </button>
                        </div>

                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Location</span>
                                <span className="detail-value">{selectedCollege.location?.address || "N/A"}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Departments</span>
                                <span className="detail-value">{selectedCollege.departments?.join(", ") || "N/A"}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Facilities</span>
                                <span className="detail-value">{selectedCollege.facilities?.join(", ") || "N/A"}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Contact</span>
                                <span className="detail-value">
                                    {selectedCollege.contact?.email && (
                                        <a href={`mailto:${selectedCollege.contact.email}`}>{selectedCollege.contact.email}</a>
                                    )}
                                    {selectedCollege.contact?.email && selectedCollege.contact?.phone && ", "}
                                    {selectedCollege.contact?.phone && (
                                        <a href={`tel:${selectedCollege.contact.phone}`}>{selectedCollege.contact.phone}</a>
                                    )}
                                    {!selectedCollege.contact?.email && !selectedCollege.contact?.phone && "N/A"}
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Website</span>
                                <span className="detail-value">
                                    {selectedCollege.website ? (
                                        <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer">
                                            {selectedCollege.website.replace(/^https?:\/\/(www\.)?/, '')}
                                        </a>
                                    ) : "N/A"}
                                </span>
                            </div>
                        </div>

                        <div className="actions">
                            <button className="btn btn-primary" onClick={(e) => handleMapClick(e, selectedCollege)}>
                                <span className="icon">🗺️</span> View Campus Map
                            </button>
                        </div>

                        {/* Reviews Section */}
                        <div className="college-reviews">
                            <h3>Student Reviews</h3>

                            {/* Display existing reviews */}
                            {renderReviews()}

                            {/* Add Review Form */}
                            <div className="add-review-section">
                                <h4>Share Your Experience</h4>
                                {renderReviewForm()}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="college-cards">
                        {filteredColleges.length > 0 ? (
                            filteredColleges.slice(0, 6).map((college) => (
                                <div
                                    key={college.name}
                                    className="college-card"
                                    onClick={() => setSelectedCollege(college)}
                                >
                                    <div className="card-header">
                                        <h3>{college.name}</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="card-location">
                                            <span className="icon">📍</span>
                                            <span>{college.location?.address || "Location not available"}</span>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedCollege(college);
                                            }}
                                        >
                                            Details
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={(e) => handleMapClick(e, college)}
                                        >
                                            Map
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <div className="no-results-icon">🔍</div>
                                <p>No colleges match your search.</p>
                                {search && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setSearch("")}
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CollegeSelection;