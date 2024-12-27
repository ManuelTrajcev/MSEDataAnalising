import React, {useEffect, useState} from "react";

export default function LatestNews() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchCompanyPredictions = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/nlp/api/get-latest-newss/`);
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error("Error fetching company predictions:", error);
            }
        };
        fetchCompanyPredictions();
    }, []);


    return (
        <div
            className="news"
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "center",
                padding: "20px",
                backgroundColor: "#f9f9f9",
            }}
        >
            {data.length > 0 ? (
                <div className="news-cards"
                     style={{
                         display: "flex",
                         flexWrap: "wrap",
                         gap: "20px",
                         justifyContent: "center",
                     }}
                >
                    {data.map((entry, index) => (
                        <div className="news-card" key={index}
                             style={{
                                 border: "1px solid #ddd",
                                 borderRadius: "8px",
                                 width: "250px", /* Adjust the size as needed */
                                 height: "250px",/* Ensures square shape */
                                 padding: "20px",
                                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                 display: "flex",
                                 flexDirection: "column",
                                 justifyContent: "space-between",
                                 textAlign: "center",
                             }}
                        >
                            <div className="news-card-item"
                                 style={{
                                     margin: "10px 0",
                                     fontSize: "14px",
                                     color: "#333"
                                 }}
                            >
                                <strong>Company Code:</strong> {entry.company_code || "N/A"}
                            </div>
                            <div className="news-card-item"
                                 style={{
                                     margin: "10px 0",
                                     fontSize: "14px",
                                     color: "#333"
                                 }}
                            >
                                <strong>Company Name:</strong> {entry.company_name || "N/A"}
                            </div>
                            <div className="news-card-item"
                                 style={{
                                     margin: "10px 0",
                                     fontSize: "14px",
                                     color: "#333",
                                     overflow: "hidden",
                                     textOverflow: "ellipsis",
                                     whiteSpace: "nowrap",
                                 }}
                            >
                                <strong>Content:</strong> {entry.content || "N/A"}
                            </div>
                            <div className="news-card-item"
                                 style={{
                                     margin: "10px 0",
                                     fontSize: "14px",
                                     color: "#333"
                                 }}
                            >
                                <strong>Date:</strong> {entry.date || "N/A"}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-data"
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
