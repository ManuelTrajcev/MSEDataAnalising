import React from "react";
import LSTMChart from "../TechnicalAnalysisPage/LSTMChart";

export default function LSTMChartContainer({ chartData }) {
    if (!chartData || chartData.length === 0) {
        return (
            <div className="sentiment-data">
                <h2>LSTM предикции</h2>
                <p className="no-data-message">Нема доволно податоци за LSTM во овој момент.</p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h2>LSTM Модел</h2>
            <LSTMChart chartData={chartData} />
        </div>
    );
}
