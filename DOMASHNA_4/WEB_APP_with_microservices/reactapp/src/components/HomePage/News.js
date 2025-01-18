import React, { useEffect, useState } from "react";
import "./News.css";

export default function News() {
    const [data, setData] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanyPredictions = async () => {
            try {
                const number_of_news = 3
                const response = await fetch(`http://localhost:8002/nlp/api/get-latest-newss/?number_of_news=${number_of_news}`);
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error("Error fetching company predictions:", error);
                setError("Failed to load news. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanyPredictions();
    }, []);

    const truncateContent = (content) => {
        const maxLength = 200;
        return content && content.length > maxLength ? content.substring(0, maxLength) + "..." : content || "Опис на новоста";
    };

    const openModal = (news) => setSelectedNews(news);

    const closeModal = () => setSelectedNews(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div id="news">
            <h2>Последно на маркетот</h2>
            <p className="p">Биди во тек со последните актуелни новости на полето на Македонската берза</p>
            {isLoading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : data.length > 0 ? (
                <div className="news-cards">
                    {data.map((entry, index) => (
                        <div className="news-card" key={index} onClick={() => openModal(entry)}>
                            <h3>{entry.company_name || "Наслов"}</h3>
                            <p>{truncateContent(entry.content)}</p>
                            <p><strong>Датум:</strong> {entry.date || "N/A"}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-data">No data available.</div>
            )}
            {selectedNews && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedNews.company_name || "Наслов"}</h3>
                        <p>{selectedNews.content || "Опис на новоста"}</p>
                        <p><strong>Датум:</strong> {selectedNews.date || "N/A"}</p>
                        <button onClick={closeModal}>Затвори</button>
                    </div>
                </div>
            )}
        </div>
    );
}
