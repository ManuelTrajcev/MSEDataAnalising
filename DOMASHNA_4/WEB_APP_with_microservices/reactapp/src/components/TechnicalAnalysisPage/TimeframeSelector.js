import React from "react";

export default function TimeframeSelector({ selectedTimeframe, onSelect }) {
    const timeframes = [
        { display: "1 day", value: "1D" },
        { display: "1 week", value: "1W" },
        { display: "1 month", value: "1ME" },
    ];

    return (
        <div className="timeframe-buttons">
            <h3>Избери временска рамка</h3>
            <div className="button-container">
                {timeframes.map(({ display, value }) => (
                    <button
                        key={value}
                        className={value === selectedTimeframe ? "active" : ""}
                        onClick={() => onSelect(value)}
                    >
                        {display}
                    </button>
                ))}
            </div>
        </div>
    );
}
