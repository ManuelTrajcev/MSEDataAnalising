import React from "react";
import "../../pages/TechnicalAnalysis.css";

const Oscillators = ({ oscillators, selectedTimeframe, renderTable }) => {
    if (!oscillators || !oscillators[selectedTimeframe]) {
        return (
            <div className="sentiment-data">
                <h2>Осцилатори</h2>
                <p className="no-data-message">Нема достапни податоци за осцилатор во овој момент.</p>
            </div>
        );
    }

    const timeframeData = oscillators[selectedTimeframe][0] || {}; // Ensure data exists
    const data = [
        { Oscillator: "RSI", Value: timeframeData.RSI || "N/A", Signal: timeframeData.Signal_RSI || "N/A" },
        { Oscillator: "Stochastic_K", Value: timeframeData.stoch_k || "N/A", Signal: timeframeData.Signal_stoch_k || "N/A" },
        { Oscillator: "CCI", Value: timeframeData.cci || "N/A", Signal: timeframeData.Signal_cci || "N/A" },
        { Oscillator: "MACD", Value: timeframeData.macd || "N/A", Signal: timeframeData.Signal_macd || "N/A" },
        { Oscillator: "ADX", Value: timeframeData.adx || "N/A", Signal: timeframeData.Signal_adx || "N/A" },
    ];

    const headers = ["Oscillator", "Value", "Signal"];
    return (
        <div>
            <h2>Осцилатори</h2>
            {renderTable(data, headers)}
        </div>
    );
};

export default Oscillators;
