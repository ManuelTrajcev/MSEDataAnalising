import React, { useEffect, useState } from "react";
import TechnicalAnalysisBackground from "../components/AnalysisPage/TechnicalAnalysisBackground";
import LSTMChart from "../components/AnalysisPage/LSTMChart";
import './TechnicalAnalysis.css'
import Footer from "../components/Footer";

export default function TechnicalAnalysis() {
    const [companyCodes, setCompanyCodes] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [selectedCompanyCode, setSelectedCompanyCode] = useState("");
    const [technicalAnalysisData, setTechnicalAnalysisData] = useState({});
    const [message, setMessage] = useState("Изберете компанија која ќе подлежи на техничка анализа.");
    const [sentimentData, setSentimentData] = useState("");
    const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCompanyCodes = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/get-company-codes/");
                const data = await response.json();
                setCompanyCodes(data);
            } catch (error) {
                console.error("Error fetching company codes:", error);
            }
        };

        fetchCompanyCodes();
    }, []);

    useEffect(() => {
        if (selectedCompanyCode) {
            const fetchTechnicalAnalysisData = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(
                        `http://localhost:8000/lstm/api/lstm-predictions/?company_code=${selectedCompanyCode}`
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

                    const combinedData = [
                        ...formattedCompanyData,
                        ...formattedPredictionData,
                    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                    const lastYearDate = new Date();
                    lastYearDate.setFullYear(lastYearDate.getFullYear() - 1); // Set the date to 1 year ago
                    const filteredData = combinedData.filter((dataPoint) => {
                        return new Date(dataPoint.timestamp) >= lastYearDate;
                    });

                    // Fetch oscillator signals
                    const responseOscillators = await fetch(
                        `http://localhost:8000/lstm/api/oscillator_signals/?company_code=${selectedCompanyCode}`
                    );
                    const oscillatorData = await responseOscillators.json();

                    // Fetch moving average signals
                    const responseMovingAvg = await fetch(
                        `http://localhost:8000/lstm/api/moving_average_signals/?company_code=${selectedCompanyCode}`
                    );
                    const movingAvgData = await responseMovingAvg.json();

                    const nlp_response = await fetch(
                        `http://localhost:8000/nlp/api/get-company-predictions/`
                    );
                    const nlp_data = await nlp_response.json();

                    const sentiment = nlp_data.find((item) => item.company_code === selectedCompanyCode);

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
                    setMessage(""); // Clear the message
                } catch (error) {
                    console.error("Error fetching technical analysis data:", error);
                    setMessage("Error fetching technical analysis data. Please try again.");
                }  finally {
                    setLoading(false); // End loading
                }
            };

            fetchTechnicalAnalysisData();
        } else {
            setMessage("Изберете компанија која ќе подлежи на техничка анализа.");
        }
    }, [selectedCompanyCode]);

    const handleCompanySelect = (event) => {
        setSelectedCompanyCode(event.target.value);
    };

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
                            let cellClass = ""; // Default class for styling

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

const renderOscillators = (oscillators) => {
    const timeframeData = oscillators[selectedTimeframe] || [];
    const data = [
        { Oscillator: "RSI", Value: timeframeData[0]?.RSI, Signal: timeframeData[0]?.Signal_RSI },
        { Oscillator: "Stochastic_K", Value: timeframeData[0]?.stoch_k, Signal: timeframeData[0]?.Signal_stoch_k },
        { Oscillator: "CCI", Value: timeframeData[0]?.cci, Signal: timeframeData[0]?.Signal_cci },
        { Oscillator: "MACD", Value: timeframeData[0]?.macd, Signal: timeframeData[0]?.Signal_macd },
        { Oscillator: "ADX", Value: timeframeData[0]?.adx, Signal: timeframeData[0]?.Signal_adx },
    ];

    const headers = ["Oscillator", "Value", "Signal"];
    return renderTable(data, headers);
};

const renderMovingAverages = (movingAverages) => {
    const timeframeData = movingAverages[selectedTimeframe] || [];
    const data = [
        { Average: "SMA_50", Value: timeframeData[0]?.["SMA(50)"], Signal: timeframeData[0]?.["Signal_SMA(50)"] },
        { Average: "SMA_200", Value: timeframeData[0]?.["SMA(200)"], Signal: timeframeData[0]?.["Signal_SMA(200)"] },
        { Average: "EMA_50", Value: timeframeData[0]?.["EMA(50)"], Signal: timeframeData[0]?.["Signal_EMA(50)"] },
        { Average: "EMA_200", Value: timeframeData[0]?.["EMA(200)"], Signal: timeframeData[0]?.["Signal_EMA(200)"] },
        { Average: "Ichimoku_Baseline", Value: timeframeData[0]?.Ichimoku_Baseline, Signal: timeframeData[0]?.Signal_Ichimoku_Baseline },
    ];

    const headers = ["Average", "Value", "Signal"];
    return renderTable(data, headers);
};


    return ( <div id="tech-container">
            <TechnicalAnalysisBackground />
            <div id="tech-front">
                <h1>Техничка анализа на податоци</h1>
            </div>

            <div id="tech-button">
                <select onChange={handleCompanySelect} value={selectedCompanyCode}>
                    <option value="">Избери компанија</option>
                    {companyCodes.map((company, index) => (
                        <option key={index} value={company.code}>
                            {company.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display message if no company is selected */}
            {!selectedCompanyCode && <p className="error-message">{message}</p>}

            {/* Loading screen */}
            {loading && (
                <div className="loading-screen">
                    <div className="spinner"></div>
                    <div className="loading-text">Се вчитува<span className="dots">...</span></div>
                    <p className="loading-message">
                        Ве молиме почекајте да се направи анализата врз податоците.
                    </p>
                </div>
            )}

            <div className="calculations">
            {/* Render only after a company is selected */}
            {!loading && selectedCompanyCode && (
                <>
                    <div className="timeframe-buttons">
                        <h3>Избери временска рамка за пресметка на Осцилатори и Moving Averages</h3>
                        <div className="button-container">
                            {[
                                { display: "1 day", value: "1D" },
                                { display: "1 week", value: "1W" },
                                { display: "1 month", value: "1ME" },
                            ].map(({ display, value }) => (
                                <button
                                    key={value}
                                    className={value === selectedTimeframe ? "active" : ""}
                                    onClick={() => setSelectedTimeframe(value)}
                                >
                                    {display}
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* Display Oscillators */}
                    {technicalAnalysisData.oscillators ? (
                        <div>
                            <h2>Осцилатори</h2>
                            {renderOscillators(technicalAnalysisData.oscillators)}
                        </div>
                    ) : (
                        <div className='sentiment-data'>
                            <h2>Осцилатори</h2>
                            <p className='no-data-message'>Нема доволно податоци за осцилатор во овој момент.</p>
                        </div>
                    )}

                    {/* Display Moving Averages */}
                    {technicalAnalysisData.movingAverages ? (
                        <div>
                            <h2>Moving Averages</h2>
                            {renderMovingAverages(technicalAnalysisData.movingAverages)}
                        </div>
                    ) : (
                        <div className="sentiment-data">
                            <h2>Moving averages</h2>
                            <p className="no-data-message">Нема доволно податоци за moving averages во овој момент.</p>
                        </div>
                    )}


                    {/* Display technical analysis data */}
                    {technicalAnalysisData.predictions ? (
                        <div className="chart-container">
                            <h2>LSTM Модел</h2>
                            <LSTMChart chartData={chartData} />
                        </div>
                    ) : (
                        <div className="sentiment-data">
                            <h2>LSTM предикции</h2>
                            <p className="no-data-message">Нема доволно податоци за LSTM во овој момент.</p>
                        </div>
                    )}

                    {/* Display Sentiment Data */}
                    {sentimentData ? (
                        <div className="sentiment-data">
                            <h2>Анализа на сентимент</h2>
                            <p>Сентимент:
                                <strong className={sentimentData.sentiment === "positive" ? "sentiment-positive" :
                                    sentimentData.sentiment === "negative" ? "sentiment-negative" : "sentiment-neutral"}>
                                    {sentimentData.sentiment}
                                </strong>
                            </p>

                            <p>Вредност на сентимент:
                                <strong className={sentimentData.sentiment === "positive" ? "sentiment-positive" :
                                    sentimentData.sentiment === "negative" ? "sentiment-negative" : "sentiment-neutral"}>
                                    {sentimentData.sentiment_value.toFixed(2)}
                                </strong>
                            </p>

                            {/* Sentiment Progress Bar */}
                            <div className="progress-container">
                                <div className={`progress-bar ${sentimentData.sentiment}`} style={{ width: `${sentimentData.sentiment_value * 100}%` }}></div>
                            </div>
                        </div>
                    ) : (
                        <div className='sentiment-data'>
                            <h2>Анализа на сентимент</h2>
                            <p class="no-data-message">Нема достапни податоци за компанијата.</p>
                        </div>
                    )}
                </>
            )}
            </div>
            <Footer/>
        </div>
    );
}