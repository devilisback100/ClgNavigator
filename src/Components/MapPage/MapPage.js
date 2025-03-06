import React, { useState } from "react";
import "./MapPage.css";

const campusTours = [
    {
        name: "Lakeside Campus",
        url: "https://www.immersivetourz.com/cmrlakeside/",
    },
    {
        name: "OMBR Campus",
        url: "https://www.immersivetourz.com/cmrombr/",
    },
    {
        name: "HRBR Campus",
        url: "https://www.immersivetourz.com/cmrhrbr/",
    },
];

function MapPage() {
    const [selectedCampus, setSelectedCampus] = useState(campusTours[0]);

    return (
        <div className="map-container">
            <h1 className="map-title">CMR University 3D Campus Tour</h1>

            {/* Campus Selection Tabs */}
            <div className="campus-tabs">
                {campusTours.map((campus, index) => (
                    <button
                        key={index}
                        className={`campus-tab ${selectedCampus.name === campus.name ? "active" : ""}`}
                        onClick={() => setSelectedCampus(campus)}
                    >
                        {campus.name}
                    </button>
                ))}
            </div>

            {/* 3D Immersive Tour Frame */}
            <div className="iframe-container">
                <iframe
                    src={selectedCampus.url}
                    width="100%"
                    height="700"
                    frameBorder="0"
                    allowFullScreen
                    title={selectedCampus.name}
                ></iframe>
            </div>
        </div>
    );
}

export default MapPage;
