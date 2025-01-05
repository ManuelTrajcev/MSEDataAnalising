import React from "react";
import "../../pages/TechnicalAnalysis.css";

const MovingAverages = ({ movingAverages, selectedTimeframe, renderTable }) => {
    if (!movingAverages || !movingAverages[selectedTimeframe]) {
        return (
            <div className="sentiment-data">
                <h2>Moving Averages</h2>
                <p className="no-data-message">Нема достапни податоци за moving averages во овој момент.</p>
            </div>
        );
    }

    const timeframeData = movingAverages[selectedTimeframe][0] || {}; // Ensure data exists
    const data = [
        { Average: "SMA_50", Value: timeframeData["SMA(50)"] || "N/A", Signal: timeframeData["Signal_SMA(50)"] || "N/A" },
        { Average: "SMA_200", Value: timeframeData["SMA(200)"] || "N/A", Signal: timeframeData["Signal_SMA(200)"] || "N/A" },
        { Average: "EMA_50", Value: timeframeData["EMA(50)"] || "N/A", Signal: timeframeData["Signal_EMA(50)"] || "N/A" },
        { Average: "EMA_200", Value: timeframeData["EMA(200)"] || "N/A", Signal: timeframeData["Signal_EMA(200)"] || "N/A" },
        { Average: "Ichimoku_Baseline", Value: timeframeData.Ichimoku_Baseline || "N/A", Signal: timeframeData.Signal_Ichimoku_Baseline || "N/A" },
    ];

    const headers = ["Average", "Value", "Signal"];
    console.log(data)
    return (
        <div>
            <h2>Moving Averages</h2>
            {renderTable(data, headers)}
        </div>
    );
};

export default MovingAverages;
