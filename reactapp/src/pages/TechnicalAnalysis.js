import React, { useEffect, useState } from "react";
import TechnicalAnalysisBackground from "../components/AnalysisPage/TechnicalAnalysisBackground";
import TimeSeriesChart from "../components/VisualizationPage/TimeSeriesChart";

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
                            {headers.map((header, colIndex) => (
                                <td key={colIndex}>{row[header] || "N/A"}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderOscillators = (oscillators) => {
        return Object.keys(oscillators).map((timeframe) => {
            const data = oscillators[timeframe].map((oscillator) => ({
                RSI: oscillator.RSI,
                Signal_RSI: oscillator.Signal_RSI,
                Stochastic_K: oscillator.stoch_k,
                Signal_Stochastic_K: oscillator.Signal_stoch_k,
                CCI: oscillator.cci,
                Signal_CCI: oscillator.Signal_cci,
                MACD: oscillator.macd,
                Signal_MACD: oscillator.Signal_macd,
                ADX: oscillator.adx,
                Signal_ADX: oscillator.Signal_adx,
            }));

            const headers = [
                "RSI",
                "Signal_RSI",
                "Stochastic_K",
                "Signal_Stochastic_K",
                "CCI",
                "Signal_CCI",
                "MACD",
                "Signal_MACD",
                "ADX",
                "Signal_ADX",
            ];

            return (
                <div key={timeframe}>
                    <h3>{timeframe}</h3>
                    {renderTable(data, headers)}
                </div>
            );
        });
    };

    const renderMovingAverages = (movingAverages) => {
        return Object.keys(movingAverages).map((timeframe) => {
            const data = movingAverages[timeframe].map((ma) => ({
                SMA_50: ma["SMA(50)"],
                Signal_SMA_50: ma.Signal_SMA_50,
                SMA_200: ma["SMA(200)"],
                Signal_SMA_200: ma.Signal_SMA_200,
                EMA_50: ma["EMA(50)"],
                Signal_EMA_50: ma.Signal_EMA_50,
                EMA_200: ma["EMA(200)"],
                Signal_EMA_200: ma.Signal_EMA_200,
                Ichimoku_Baseline: ma.Ichimoku_Baseline,
                Signal_Ichimoku_Baseline: ma.Signal_Ichimoku_Baseline,
            }));

            const headers = [
                "SMA_50",
                "Signal_SMA_50",
                "SMA_200",
                "Signal_SMA_200",
                "EMA_50",
                "Signal_EMA_50",
                "EMA_200",
                "Signal_EMA_200",
                "Ichimoku_Baseline",
                "Signal_Ichimoku_Baseline",
            ];

            return (
                <div key={timeframe}>
                    <h3>{timeframe}</h3>
                    {renderTable(data, headers)}
                </div>
            );
        });
    };

     return (
         <div id="container">
             <div id="front">
                 <TechnicalAnalysisBackground/>
                 <h1>Техничка анализа на податоци</h1>
             </div>
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
             {message && <p className="error-message">{message}</p>}

             {/* Display technical analysis data */}
             {technicalAnalysisData.predictions && (
                 <TimeSeriesChart chartData={chartData} highlightLast10={true}/>
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
                 <div className="sentiment-data">
                     <p><strong>Sentiment: </strong>{sentimentData.sentiment}</p>
                     <p><strong>Sentiment Value: </strong>{sentimentData.sentiment_value}</p>
                 </div>
             ) : (
                 <p>No sentiment data available</p>
             )}
         </div>
     )
}
