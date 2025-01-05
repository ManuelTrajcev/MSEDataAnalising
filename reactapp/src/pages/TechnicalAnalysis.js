import React, { useEffect, useState } from "react";
import Background from "../components/Background";
import Footer from "../components/Footer";
import CompanySelector from "../components/TechnicalAnalysisPage/CompanySelector";
import TimeframeSelector from "../components/TechnicalAnalysisPage/TimeframeSelector";
import OscillatorsTable from "../components/TechnicalAnalysisPage/OscillatorsTable";
import MovingAveragesTable from "../components/TechnicalAnalysisPage/MovingAveragesTable";
import SentimentAnalysis from "../components/TechnicalAnalysisPage/SentimentAnalysis";
import LSTMChartContainer from "../components/TechnicalAnalysisPage/LSTMChartContainer";
import LoadingSpinner from "../components/TechnicalAnalysisPage/LoadingSpinner";
import './TechnicalAnalysis.css';
import image1 from "../images/technical.jpg";

export default function TechnicalAnalysis() {
    const [companyCodes, setCompanyCodes] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [selectedCompanyCode, setSelectedCompanyCode] = useState("");
    const [technicalAnalysisData, setTechnicalAnalysisData] = useState({});
    const [message, setMessage] = useState("Изберете компанија која ќе подлежи на техничка анализа.");
    const [sentimentData, setSentimentData] = useState("");
    const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
    const [loading, setLoading] = useState(false);

    // Fetch company codes
    useEffect(() => {
        const fetchCompanyCodes = async () => {
            try {
                const response = await fetch("http://localhost:8000/datascraper/api/get-company-codes/");
                const data = await response.json();
                setCompanyCodes(data);
            } catch (error) {
                console.error("Error fetching company codes:", error);
            }
        };

        fetchCompanyCodes();
    }, []);

    // Fetch technical analysis data
    useEffect(() => {
        if (selectedCompanyCode) {
            const fetchTechnicalAnalysisData = async () => {
                try {
                    setLoading(true);

                    // Fetch LSTM predictions
                    const response = await fetch(
                        `http://localhost:8001/lstm/api/lstm-predictions/?company_code=${selectedCompanyCode}`
                    );
                    const predictionsData = await response.json();

                    const formattedCompanyData = predictionsData.company_data.map((companyDatum) => {
                        const date = new Date(companyDatum.date_string.split('.').reverse().join('-'));
                        return {
                            timestamp: date.toISOString(),
                            value: companyDatum.last_transaction_price,
                        };
                    });

                    const formattedPredictionData = predictionsData.predictions.map((prediction, index) => {
                        const predictionDate = new Date(predictionsData.prediction_dates[index]);
                        return {
                            timestamp: predictionDate.toISOString(),
                            value: prediction,
                        };
                    });

                    const combinedData = [...formattedCompanyData, ...formattedPredictionData].sort(
                        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                    );

                    const lastYearDate = new Date();
                    lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
                    const filteredData = combinedData.filter((dataPoint) => {
                        return new Date(dataPoint.timestamp) >= lastYearDate;
                    });

                    // Fetch oscillator signals
                    const responseOscillators = await fetch(
                        `http://localhost:8001/lstm/api/oscillator-signals/?company_code=${selectedCompanyCode}`
                    );
                    const oscillatorData = await responseOscillators.json();

                    // Fetch moving average signals
                    const responseMovingAvg = await fetch(
                        `http://localhost:8001/lstm/api/moving-average-signals/?company_code=${selectedCompanyCode}`
                    );
                    const movingAvgData = await responseMovingAvg.json();

                    // Fetch sentiment analysis data
                    const nlpResponse = await fetch(`http://localhost:8002/nlp/api/get-company-predictions/`);
                    const nlpData = await nlpResponse.json();

                    const sentiment = nlpData.find((item) => item.company_code === selectedCompanyCode);
                    if (sentiment) {
                        setSentimentData({
                            sentiment: sentiment.max_sentiment,
                            sentiment_value: sentiment.max_sentiment_value,
                        });
                    } else {
                        setSentimentData("");
                    }

                    setChartData(filteredData);
                    setTechnicalAnalysisData({
                        predictions: predictionsData,
                        oscillators: oscillatorData,
                        movingAverages: movingAvgData,
                    });
                    setMessage("");
                } catch (error) {
                    console.error("Error fetching technical analysis data:", error);
                    setMessage("Error fetching technical analysis data. Please try again.");
                } finally {
                    setLoading(false);
                }
            };

            fetchTechnicalAnalysisData();
        } else {
            setMessage("Изберете компанија која ќе подлежи на техничка анализа.");
        }
    }, [selectedCompanyCode]);

    const renderTable = (data, headers) => (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((header, colIndex) => {
                                const cellValue = row[header] || "N/A";
                                let cellClass = "";

                                if (header === "Signal") {
                                    if (cellValue === "Buy") cellClass = "signal-buy";
                                    else if (cellValue === "Sell") cellClass = "signal-sell";
                                    else if (cellValue === "Hold") cellClass = "signal-hold";
                                }

                                return (
                                    <td key={colIndex} className={cellClass}>
                                        {cellValue}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div id="tech-container">
            <Background imageSrc={image1} altText="Image for Page 4" />
            <div id="tech-front">
                <h1>Техничка анализа на податоци</h1>
            </div>

            <CompanySelector
                companyCodes={companyCodes}
                selectedCompanyCode={selectedCompanyCode}
                onChange={(e) => setSelectedCompanyCode(e.target.value)}
            />

            {!selectedCompanyCode && <p className="error-message">{message}</p>}

            {loading ? (
                <LoadingSpinner />
            ) : (
                selectedCompanyCode && (
                    <div className="calculations">
                        <TimeframeSelector
                            selectedTimeframe={selectedTimeframe}
                            onSelect={setSelectedTimeframe}
                        />

                        <OscillatorsTable
                            oscillators={technicalAnalysisData.oscillators?.[selectedTimeframe]}
                            renderTable={renderTable}
                        />

                        <MovingAveragesTable
                            movingAverages={technicalAnalysisData.movingAverages?.[selectedTimeframe]}
                            renderTable={renderTable}
                        />

                        <LSTMChartContainer chartData={chartData} />

                        <SentimentAnalysis sentimentData={sentimentData} />
                    </div>
                )
            )}

            <Footer />
        </div>
    );
}
