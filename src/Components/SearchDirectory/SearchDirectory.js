import "./SearchDirectory.css";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL; // Load API URL from .env

function SearchDirectory() {
    const [search, setSearch] = useState("");
    const [colleges, setColleges] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState("");
    const [facilities, setFacilities] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    // Fetch map data from API
    useEffect(() => {
        fetch(`${API_BASE_URL}/map-data`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.data.length > 0) {
                    setColleges(data.data);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Update facilities when a college is selected
    useEffect(() => {
        if (selectedCollege) {
            const collegeData = colleges.find(college => college.College_name === selectedCollege);
            if (collegeData) {
                const facilityList = Object.entries(collegeData)
                    .filter(([key]) => key !== "College_name" && key !== "_id")
                    .map(([name, coords]) => ({ name, coords }));

                setFacilities(facilityList);
            }
        }
    }, [selectedCollege, colleges]);

    // Get user's current location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => console.error("Error getting location:", error)
        );
    }, []);

    // Filtered facility list based on search
    const filteredFacilities = facilities.filter(facility =>
        facility.name.toLowerCase().includes(search.toLowerCase())
    );

    // Function to open Google Maps in a new tab
    const openGoogleMaps = (facility) => {
        if (userLocation && facility) {
            const googleMapsURL = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${facility.coords[1]},${facility.coords[0]}`;
            window.open(googleMapsURL, "_blank"); // Opens in new tab
        } else {
            alert("User location not available!");
        }
    };

    return (
        <div className="search-directory-container">
            <h1>Search Directory</h1>

            {/* College Dropdown */}
            <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="college-dropdown"
            >
                <option value="">Select a College</option>
                {colleges.map((college) => (
                    <option key={college._id} value={college.College_name}>
                        {college.College_name}
                    </option>
                ))}
            </select>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search facilities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-bar"
            />

            {/* Facility List */}
            <div className="directory-list">
                {filteredFacilities.map((facility, index) => (
                    <div
                        key={index}
                        className="directory-card"
                        onClick={() => openGoogleMaps(facility)}
                    >
                        <h3>{facility.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchDirectory;
