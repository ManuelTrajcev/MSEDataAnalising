import React, { useEffect, useState } from "react";
import TechnicalAnalysisBackground from "../components/TechnicalAnalysisBackground";
import TimeSeriesChart from "../components/TimeSeriesChart";

export default function TechnicalAnalysis() {
    const [companyCodes, setCompanyCodes] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [selectedCompanyCode, setSelectedCompanyCode] = useState("");
    const [technicalAnalysisData, setTechnicalAnalysisData] = useState({});
    const [message, setMessage] = useState("Please select a company to view the technical analysis.");
    const [sentimentData, setSentimentData] = useState('');

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
                    const response = await fetch(
                        `http://localhost:8000/lstm/api/lstm-predictions/?company_code=${selectedCompanyCode}`
                    );
                    const predictionsData = await response.json();

                    const formattedCompanyData = predictionsData.company_data.map((companyDatum) => {
                        const date = new Date(companyDatum.date_string.split('.').reverse().join('-'));
                        return {
                            timestamp: date.toISOString(),
                            value: companyDatum.last_transaction_price
                        };
                    });

                    const formattedPredictionData = predictionsData.predictions.map((prediction, index) => {
                        const predictionDate = new Date(predictionsData.prediction_dates[index]);
                        return {
                            timestamp: predictionDate.toISOString(),
                            value: prediction
                        };
                    });

                    const combinedData = [
                        ...formattedCompanyData,
                        ...formattedPredictionData
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
                    const nlp_data = await nlp_response.json()

                    console.log(nlp_data);

                    const sentiment = nlp_data.find((item) => item.company_code === selectedCompanyCode);

                   if (sentiment) {
                        setSentimentData({
                            sentiment: sentiment.max_sentiment,
                            sentiment_value: sentiment.max_sentiment_value
                        });
                    }

                    setChartData(filteredData);
                    // Combine all data
                    setTechnicalAnalysisData({
                        predictions: predictionsData,
                        oscillators: oscillatorData,
                        movingAverages: movingAvgData
                    });
                    setMessage(""); // Clear the message
                } catch (error) {
                    console.error("Error fetching technical analysis data:", error);
                    setMessage("Error fetching technical analysis data. Please try again.");
                }
            };

            fetchTechnicalAnalysisData();
        } else {
            setMessage("Please select a company to view the technical analysis.");
        }
    }, [selectedCompanyCode]);

    const handleCompanySelect = (event) => {
        setSelectedCompanyCode(event.target.value);
    };

    const renderOscillators = (oscillators) => {
        return Object.keys(oscillators).map((timeframe) => (
            <div key={timeframe}>
                <h3>{timeframe}</h3>
                {oscillators[timeframe].map((oscillator, index) => (
                    <div key={index}>
                        <p><strong>RSI:</strong> {oscillator.RSI} Signal: {oscillator.Signal_RSI}</p>
                        <p><strong>Stochastic K:</strong> {oscillator.stoch_k} Signal: {oscillator.Signal_stoch_k}</p>
                        <p><strong>CCI:</strong> {oscillator.cci} Signal: {oscillator.Signal_cci}</p>
                        <p><strong>MACD:</strong> {oscillator.macd} Signal: {oscillator.Signal_macd}</p>
                        <p><strong>ADX:</strong> {oscillator.adx} Signal: {oscillator.Signal_adx}</p>
                    </div>
                ))}
            </div>
        ));
    };

    const renderMovingAverages = (movingAverages) => {
        return Object.keys(movingAverages).map((timeframe) => (
            <div key={timeframe}>
                <h3>{timeframe}</h3>
                {movingAverages[timeframe].map((ma, index) => (
                    <div key={index}>
                        <p><strong>SMA(50):</strong> {ma["SMA(50)"]} Signal: {ma.Signal_SMA_50}</p>
                        <p><strong>SMA(200):</strong> {ma["SMA(200)"]} Signal: {ma.Signal_SMA_200}</p>
                        <p><strong>EMA(50):</strong> {ma["EMA(50)"]} Signal: {ma.Signal_EMA_50}</p>
                        <p><strong>EMA(200):</strong> {ma["EMA(200)"]} Signal: {ma.Signal_EMA_200}</p>
                        <p><strong>Ichimoku Baseline:</strong> {ma.Ichimoku_Baseline} Signal: {ma.Signal_Ichimoku_Baseline}</p>
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <div>
            <TechnicalAnalysisBackground />
            <h1>Техничка анализа на податоци</h1>
            {/* Dropdown to select company */}
            <div>
                <select onChange={handleCompanySelect} value={selectedCompanyCode}>
                    <option value="">Select Company</option>
                    {companyCodes.map((company, index) => (
                        <option key={index} value={company.code}>
                            {company.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display message if no company is selected */}
            {message && <p style={{ color: "red" }}>{message}</p>}

            {/* Display technical analysis data */}
            {technicalAnalysisData.predictions && (
                <TimeSeriesChart chartData={chartData} highlightLast10={true} />
            )}

            {/* Display Oscillators */}
            {technicalAnalysisData.oscillators && (
                <div>
                    <h2>Oscillator Signals</h2>
                    {renderOscillators(technicalAnalysisData.oscillators)}
                </div>
            )}

            {/* Display Moving Averages */}
            {technicalAnalysisData.movingAverages && (
                <div>
                    <h2>Moving Average Signals</h2>
                    {renderMovingAverages(technicalAnalysisData.movingAverages)}
                </div>
            )}

            {sentimentData ? (
                <div>
                    <p><strong>Sentiment: </strong>{sentimentData.sentiment}</p>
                    <p><strong>Sentiment Value: </strong>{sentimentData.sentiment_value}</p>
                </div>
            ) : (
                <p>No sentiment data available</p>
            )}
        </div>
    );
}
