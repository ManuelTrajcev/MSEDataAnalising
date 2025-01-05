import React from "react";

export default function SentimentAnalysis({ sentimentData }) {
    if (!sentimentData) {
        return (
            <div className="sentiment-data">
                <h2>Анализа на сентимент</h2>
                <p className="no-data-message">Нема достапни податоци за компанијата.</p>
            </div>
        );
    }

    const sentimentClass =
        sentimentData.sentiment === "positive"
            ? "sentiment-positive"
            : sentimentData.sentiment === "negative"
            ? "sentiment-negative"
            : "sentiment-neutral";

    return (
        <div className="sentiment-data">
            <h2>Анализа на сентимент</h2>
            <p>
                Сентимент: <strong className={sentimentClass}>{sentimentData.sentiment}</strong>
            </p>
            <p>
                Вредност на сентимент:{" "}
                <strong className={sentimentClass}>{sentimentData.sentiment_value.toFixed(2)}</strong>
            </p>
            <div className="progress-container">
                <div
                    className={`progress-bar ${sentimentData.sentiment}`}
                    style={{ width: `${sentimentData.sentiment_value * 100}%` }}
                ></div>
            </div>
        </div>
    );
}
