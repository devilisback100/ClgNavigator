import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CollegeForm.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const CollegeForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const mode = location.state?.mode || "add";
    const collegeName = location.state?.collegeName || "";

    const [formData, setFormData] = useState({
        name: "",
        location: {
            latitude: "",
            longitude: "",
            address: ""
        },
        website: "",
        contact: { email: "", phone: "" },
        facilities: [""],
        departments: [""],
        courses: [{ name: "", duration: "", fees: "", admission_process: "" }],
        city: "",
        state: "",
        branches: {
            science: false,
            arts: false,
            medical: false
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mode === "update" && collegeName) {
            setLoading(true);
            axios.get(`${API_URL}/colleges/${collegeName}`)
                .then((response) => {
                    setFormData(response.data.data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load college data.");
                    setLoading(false);
                });
        }
    }, [mode, collegeName]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleNestedInputChange = (e, category, key) => {
        setFormData((prevState) => ({
            ...prevState,
            [category]: { ...prevState[category], [key]: e.target.value },
        }));
    };

    const handleBranchChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            branches: { ...prevState.branches, [name]: checked },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === "update") {
                await axios.put(`${API_URL}/colleges/${collegeName}`, formData);
                alert("College updated successfully!");
            } else {
                await axios.post(`${API_URL}/colleges`, formData);
                alert("College added successfully!");
            }
            navigate("/profile");
        } catch {
            setError("Failed to save data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="college-form">
            <h2>{mode === "update" ? "Edit College" : "Add College"}</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required disabled={mode === "update"} />
                </div>
                <div>
                    <label>Website</label>
                    <input type="url" name="website" value={formData.website} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Address</label>
                    <input type="text" name="location.address" value={formData.location.address} onChange={(e) => handleNestedInputChange(e, "location", "address")} required />
                </div>
                <div>
                    <label>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Latitude</label>
                    <input type="text" name="location.latitude" value={formData.location.latitude} onChange={(e) => handleNestedInputChange(e, "location", "latitude")} required />
                </div>
                <div>
                    <label>Longitude</label>
                    <input type="text" name="location.longitude" value={formData.location.longitude} onChange={(e) => handleNestedInputChange(e, "location", "longitude")} required />
                </div>
                <h3>Contact</h3>
                <div>
                    <label>Email</label>
                    <input type="email" value={formData.contact.email} onChange={(e) => handleNestedInputChange(e, "contact", "email")} required />
                </div>
                <div>
                    <label>Phone</label>
                    <input type="tel" value={formData.contact.phone} onChange={(e) => handleNestedInputChange(e, "contact", "phone")} required />
                </div>
                <h3>Branches</h3>
                <div>
                    <label>
                        <input type="checkbox" name="science" checked={formData.branches.science} onChange={handleBranchChange} /> Science
                    </label>
                    <label>
                        <input type="checkbox" name="arts" checked={formData.branches.arts} onChange={handleBranchChange} /> Arts
                    </label>
                    <label>
                        <input type="checkbox" name="medical" checked={formData.branches.medical} onChange={handleBranchChange} /> Medical
                    </label>
                </div>
                <button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "update" ? "Update College" : "Add College"}</button>
            </form>
        </div>
    );
};

export default CollegeForm;
