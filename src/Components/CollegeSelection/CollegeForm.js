import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CollegeForm.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const CollegeForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const mode = location.state?.mode || "add";
    const collegeId = location.state?._id || "";

    const [formData, setFormData] = useState({
        name: "",
        location: { latitude: "", longitude: "", address: "" },
        website: "",
        contact: { email: "", phone: "" },
        facilities: [""],
        departments: [""],
        courses: [{ name: "", duration: "", fees: "", admission_process: "", entrance_exam: "" }],
        events: [],
        reviews: [],
        city: "",
        state: "",
        branches: { science: false, arts: false, medical: false },
        map_id: null,
        created_at: "",
        updated_at: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mode === "update" && collegeId) {
            setLoading(true);
            axios.get(`${API_URL}/colleges/${collegeId}`)
                .then((response) => {
                    // Ensure the courses array has the entrance_exam field
                    const data = response.data.data;
                    if (data.courses) {
                        data.courses = data.courses.map(course => ({
                            ...course,
                            entrance_exam: course.entrance_exam || ""
                        }));
                    }
                    setFormData(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load college data.");
                    setLoading(false);
                });
        }
    }, [mode, collegeId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleNestedInputChange = (e, category, key) => {
        setFormData((prevState) => ({
            ...prevState,
            [category]: { ...prevState[category], [key]: e.target.value }
        }));
    };

    const handleArrayChange = (index, category, key, value) => {
        const updatedArray = [...formData[category]];
        if (key) {
            updatedArray[index][key] = value;
        } else {
            updatedArray[index] = value;
        }
        setFormData((prevState) => ({ ...prevState, [category]: updatedArray }));
    };

    const handleBranchChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            branches: { ...prevState.branches, [name]: checked }
        }));
    };

    const addArrayItem = (category) => {
        if (category === "departments") {
            setFormData((prevState) => ({
                ...prevState,
                departments: [...prevState.departments, ""]
            }));
        } else if (category === "facilities") {
            setFormData((prevState) => ({
                ...prevState,
                facilities: [...prevState.facilities, ""]
            }));
        } else if (category === "courses") {
            setFormData((prevState) => ({
                ...prevState,
                courses: [...prevState.courses, { name: "", duration: "", fees: "", admission_process: "", entrance_exam: "" }]
            }));
        }
    };

    const removeArrayItem = (category, index) => {
        const updatedArray = [...formData[category]];
        updatedArray.splice(index, 1);
        if (updatedArray.length === 0) {
            if (category === "departments") {
                updatedArray.push("");
            } else if (category === "facilities") {
                updatedArray.push("");
            } else if (category === "courses") {
                updatedArray.push({ name: "", duration: "", fees: "", admission_process: "", entrance_exam: "" });
            }
        }
        setFormData((prevState) => ({ ...prevState, [category]: updatedArray }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === "update") {
                await axios.put(`${API_URL}/colleges/${collegeId}`, formData);
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
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required disabled={mode === "update"} />

                <label>Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleInputChange} required />

                <label>Address</label>
                <input type="text" value={formData.location.address} onChange={(e) => handleNestedInputChange(e, "location", "address")} required />

                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />

                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />

                <h3>Contact</h3>
                <label>Email</label>
                <input type="email" value={formData.contact.email} onChange={(e) => handleNestedInputChange(e, "contact", "email")} required />

                <label>Phone</label>
                <input type="tel" value={formData.contact.phone} onChange={(e) => handleNestedInputChange(e, "contact", "phone")} required />

                <h3>Facilities</h3>
                {formData.facilities.map((facility, index) => (
                    <div className="array-item" key={`facility-${index}`}>
                        <input
                            type="text"
                            value={facility}
                            onChange={(e) => handleArrayChange(index, "facilities", null, e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeArrayItem("facilities", index)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => addArrayItem("facilities")}
                >
                    Add Facility
                </button>

                <h3>Departments</h3>
                {formData.departments.map((department, index) => (
                    <div className="array-item" key={`department-${index}`}>
                        <input
                            type="text"
                            value={department}
                            onChange={(e) => handleArrayChange(index, "departments", null, e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeArrayItem("departments", index)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => addArrayItem("departments")}
                >
                    Add Department
                </button>

                <h3>Courses</h3>
                {formData.courses.map((course, index) => (
                    <div className="course-item" key={`course-${index}`}>
                        <h4>Course {index + 1}</h4>
                        <label>Name</label>
                        <input
                            type="text"
                            value={course.name}
                            onChange={(e) => handleArrayChange(index, "courses", "name", e.target.value)}
                            required
                        />

                        <label>Duration</label>
                        <input
                            type="text"
                            value={course.duration}
                            onChange={(e) => handleArrayChange(index, "courses", "duration", e.target.value)}
                            required
                        />

                        <label>Fees</label>
                        <input
                            type="text"
                            value={course.fees}
                            onChange={(e) => handleArrayChange(index, "courses", "fees", e.target.value)}
                            required
                        />

                        <label>Admission Process</label>
                        <input
                            type="text"
                            value={course.admission_process}
                            onChange={(e) => handleArrayChange(index, "courses", "admission_process", e.target.value)}
                            required
                        />

                        <label>Entrance Exam</label>
                        <input
                            type="text"
                            value={course.entrance_exam || ""}
                            onChange={(e) => handleArrayChange(index, "courses", "entrance_exam", e.target.value)}
                            required
                        />

                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeArrayItem("courses", index)}
                        >
                            Remove Course
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => addArrayItem("courses")}
                >
                    Add Course
                </button>

                <h3>Branches</h3>
                <label>
                    <input type="checkbox" name="science" checked={formData.branches.science} onChange={handleBranchChange} /> Science
                </label>
                <label>
                    <input type="checkbox" name="arts" checked={formData.branches.arts} onChange={handleBranchChange} /> Arts
                </label>
                <label>
                    <input type="checkbox" name="medical" checked={formData.branches.medical} onChange={handleBranchChange} /> Medical
                </label>

                <button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "update" ? "Update College" : "Add College"}</button>
            </form>
        </div>
    );
};

export default CollegeForm;