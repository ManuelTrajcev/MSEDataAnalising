import React, { useEffect, useState } from "react";

export default function LatestNews() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchCompanyPredictions = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/nlp/api/get-latest-newss/`
                );
                const data = await response.json();
                setData(data.slice(0, 3)); // Only get the first 3 latest news
            } catch (error) {
                console.error("Error fetching company predictions:", error);
            }
        };
        fetchCompanyPredictions();
    }, []);

    const truncateContent = (content) => {
        if (!content) return "Опис на новоста";
        const maxLength = 100; // Set a max length for the content
        return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
    };

    return (
        <div
            className="news"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#ffffff",
                fontFamily: "Jost, Arial, sans-serif", // Update font here
            }}
        >
            <h2 style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#1a1a75",
            }}>Последно на маркетот</h2>
            <p style={{
                fontSize: "16px",
                color: "#333",
                marginBottom: "40px",
                textAlign: "center",
            }}>Биди во тек со последните актуелни новости на полето на Македонската берза</p>
            {data.length > 0 ? (
                <div
                    className="news-cards"
                    style={{
                        display: "flex",
                        gap: "20px",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    {data.map((entry, index) => (
                        <div
                            className="news-card"
                            key={index}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                width: "300px",
                                padding: "20px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <h3 style={{
                                fontSize: "18px",
                                color: "#1a1a75",
                                marginBottom: "10px",
                            }}>{entry.company_name || "Наслов"}</h3>
                            <p style={{
                                fontSize: "14px",
                                color: "#555",
                                marginBottom: "10px",
                                lineHeight: "1.5",
                            }}>{truncateContent(entry.content)}</p>
                            <p style={{
                                fontSize: "12px",
                                color: "#999",
                            }}><strong>Датум:</strong> {entry.date || "N/A"}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    className="no-data"
                    style={{
                        fontSize: "16px",
                        color: "#666",
                        textAlign: "center",
                        padding: "20px",
                    }}
                >No data available.</div>
            )}
        </div>
    );
}
