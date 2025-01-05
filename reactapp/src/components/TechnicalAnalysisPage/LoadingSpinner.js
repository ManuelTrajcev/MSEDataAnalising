import React from "react";

export default function LoadingSpinner() {
    return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <div className="loading-text">Се вчитува<span className="dots">...</span></div>
            <p className="loading-message">
                Ве молиме почекајте да се направи анализата врз податоците.
            </p>
        </div>
    );
}
