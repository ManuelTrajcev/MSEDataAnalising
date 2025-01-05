import React, { useEffect, useState } from "react";
import TimeSeriesChart from "./TimeSeriesChart";
import DataSelectionInput from "./DataSelectionInput";
import './TimeSeriesContainer.css';

// Utility function to fetch time series data
const fetchTimeSeriesData = async (url, setChartData, setMessage) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("Raw API response:", data);
        setChartData(data);
        setMessage("");
    } catch (error) {
        console.error("Error fetching data:", error);
        setChartData([]);
        setMessage("Нема доволно достапни податоци за избраната компанија.");
    }
};

const TimeSeriesContainer = () => {
    const [, setRawData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [message, setMessage] = useState("Ве молиме изберете влезни податоци за да го видите графиконот.");
    const [selectedCompanyCode, setSelectedCompanyCode] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [companyCodes, setCompanyCodes] = useState([]);
    const [trendChartData, setTrendChartData] = useState([]);
    const [seasonalChartData, setSeasonalChartData] = useState([]);
    const [residChartData, setResidChartData] = useState([]);

    // Fetch company codes
    useEffect(() => {
        const fetchCompanyCodes = async () => {
            try {
                const response = await fetch("http://localhost:8000/datascraper/api/get-company-codes/");
                const companyCodes = await response.json();
                setCompanyCodes(companyCodes);
            } catch (error) {
                console.error("Грешка при преземање на кодовите на компании:", error);
            }
        };

        fetchCompanyCodes();
    }, []);

    // Fetch real time series data (e.g., for chart)
    useEffect(() => {
        if (selectedCompanyCode && startDate && endDate) {
            const timeSeriesUrl = `http://localhost:8000/datascraper/api/get-data/?company_code=${selectedCompanyCode}&start_date=${startDate}&end_date=${endDate}`;
            fetchTimeSeriesData(timeSeriesUrl, (data) => {
                const formattedData = data.map((entry) => ({
                    timestamp: entry.date,
                    value: parseFloat(entry.total_profit.replace('.', '').replace(',', '.')),
                }));
                setChartData(formattedData);
                setRawData(data);
            }, setMessage);
        } else {
            setChartData([]);
            setMessage("Изберете влезни податоци за да го видите графиконот.");
        }
    }, [selectedCompanyCode, startDate, endDate]);

    // Fetch LSTM time series analysis (Trend, Seasonal, Residual)
    useEffect(() => {
        if (selectedCompanyCode && startDate && endDate) {
            const lstmUrl = `http://localhost:8001/lstm/api/time-series-analysis/?company_code=${selectedCompanyCode}&start_date=${startDate}&end_date=${endDate}`;
            fetchTimeSeriesData(lstmUrl, (data_time_series) => {
                const formattedTrendData = data_time_series.trend.map((value, index) => ({
                    timestamp: data_time_series.timestamp[index],
                    value: value,
                }));
                const formattedSeasonalData = data_time_series.seasonal.map((value, index) => ({
                    timestamp: data_time_series.timestamp[index],
                    value: value,
                }));
                const formattedResidualData = data_time_series.residual.map((value, index) => ({
                    timestamp: data_time_series.timestamp[index],
                    value: value,
                }));
                setTrendChartData(formattedTrendData);
                setSeasonalChartData(formattedSeasonalData);
                setResidChartData(formattedResidualData);
                setMessage("");
            }, setMessage);
        } else {
            setTrendChartData([]);
            setSeasonalChartData([]);
            setResidChartData([]);
            setMessage("Изберете влезни податоци.");
        }
    }, [selectedCompanyCode, startDate, endDate]);

    // Handle input changes
    const handleInputChange = (field, value) => {
        if (field === "selectedCompanyCode") setSelectedCompanyCode(value);
        if (field === "startDate") setStartDate(value);
        if (field === "endDate") setEndDate(value);
    };

    return (
        <div className="time-series-container">
            {/* Data selection inputs */}
            <DataSelectionInput
                companyCodes={companyCodes}
                selectedCompanyCode={selectedCompanyCode}
                startDate={startDate}
                endDate={endDate}
                onInputChange={handleInputChange}
            />

            {/* Display message if any */}
            {message && <p>{message}</p>}

            {/* Time Series Charts */}
            <div className="charts-section">
                <h1>Реални податоци</h1>
                <TimeSeriesChart chartData={chartData} />
            </div>

            <div className="charts-section">
                <h1>Тренд</h1>
                <TimeSeriesChart chartData={trendChartData} />
            </div>

            <div className="charts-section">
                <h1>Сезоналност</h1>
                <TimeSeriesChart chartData={seasonalChartData} />
            </div>

            <div className="charts-section">
                <h1>Грешка</h1>
                <TimeSeriesChart chartData={residChartData} />
            </div>
        </div>
    );
};

export default TimeSeriesContainer;
