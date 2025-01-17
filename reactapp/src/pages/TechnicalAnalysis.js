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
    const [technicalAnalysisData, setTechnicalAnalysisData] = useState({
        predictions: null,
        oscillators: null,
        movingAverages: null,
    });
    const [message, setMessage] = useState("Изберете компанија која ќе подлежи на техничка анализа.");
    const [sentimentData, setSentimentData] = useState(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
    const [loading, setLoading] = useState(false);

    // Fetch company codes
    useEffect(() => {
        const fetchCompanyCodes = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}:8000/datascraper/api/get-company-codes/`);
                if (!response.ok) throw new Error("Failed to fetch company codes");
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
        if (!selectedCompanyCode) {
            setMessage("Изберете компанија која ќе подлежи на техничка анализа.");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setMessage("");

                // Fetch LSTM predictions
                const predictionsData = await fetchAPI(
                    `${process.env.REACT_APP_BASE_URL}:8001/lstm/api/lstm-predictions/?company_code=${selectedCompanyCode}`,
                    "LSTM predictions"
                );
                const formattedData = formatLSTMData(predictionsData);

                // Fetch oscillator signals
                const oscillatorData = await fetchAPI(
                    `${process.env.REACT_APP_BASE_URL}:8001/lstm/api/oscillator-signals/?company_code=${selectedCompanyCode}`,
                    "oscillator signals"
                );

                // Fetch moving average signals
                const movingAvgData = await fetchAPI(
                    `${process.env.REACT_APP_BASE_URL}:8001/lstm/api/moving-average-signals/?company_code=${selectedCompanyCode}`,
                    "moving average signals"
                );

                // Fetch sentiment analysis data
                const nlpData = await fetchAPI(
                    `${process.env.REACT_APP_BASE_URL}:8002/nlp/api/get-prediction-for-company/?company_code=${selectedCompanyCode}`,
                    "sentiment analysis"
                );
                const sentiment = nlpData[0];
                setSentimentData(sentiment
                    ? { sentiment: sentiment.max_sentiment, sentiment_value: sentiment.max_sentiment_value }
                    : null);

                setChartData(formattedData.filteredData);
                setTechnicalAnalysisData({
                    predictions: predictionsData,
                    oscillators: oscillatorData,
                    movingAverages: movingAvgData,
                });
            } catch (error) {
                console.error(error.message);
                setMessage("Error fetching technical analysis data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCompanyCode]);

    const fetchAPI = async (url, description) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${description}`);
        return await response.json();
    };

    // Helper function to format LSTM data
    const formatLSTMData = (predictionsData) => {
        const formattedCompanyData = predictionsData.company_data.map((companyDatum) => ({
            timestamp: new Date(companyDatum.date_string.split('.').reverse().join('-')).toISOString(),
            value: companyDatum.last_transaction_price,
        }));

        const formattedPredictionData = predictionsData.predictions.map((prediction, index) => ({
            timestamp: new Date(predictionsData.prediction_dates[index]).toISOString(),
            value: prediction,
        }));

        const combinedData = [...formattedCompanyData, ...formattedPredictionData].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        const lastYearDate = new Date();
        lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
        const filteredData = combinedData.filter((dataPoint) => new Date(dataPoint.timestamp) >= lastYearDate);

        return { filteredData };
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
            <Background imageSrc={image1} headingText={"Техничка анализа на податоци"} altText="Image for Page 4" />
            <div className="contain">
                <CompanySelector
                companyCodes={companyCodes}
                selectedCompanyCode={selectedCompanyCode}
                onChange={(e) => setSelectedCompanyCode(e.target.value)}
            />

            {message && <p className="error-message">{message}</p>}

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
                            oscillators={technicalAnalysisData.oscillators}
                            selectedTimeframe={selectedTimeframe}
                            renderTable={renderTable}
                        />
                        <MovingAveragesTable
                            movingAverages={technicalAnalysisData.movingAverages}
                            selectedTimeframe={selectedTimeframe}
                            renderTable={renderTable}
                        />
                        <LSTMChartContainer chartData={chartData} />
                        <SentimentAnalysis sentimentData={sentimentData} />
                    </div>
                )
            )}

            </div>
            <Footer margin={!selectedCompanyCode}/>
        </div>
    );
}
