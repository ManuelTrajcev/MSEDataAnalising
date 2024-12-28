import React, { useEffect, useState } from "react";
import TimeSeriesChart from "./TimeSeriesChart";
import DataSelectionInput from "./DataSelectionInput";

const TimeSeriesContainer = () => {
    const [rawData, setRawData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [trendChartData, setTrendChartData] = useState([]);
    const [seasonalChartData, setSeasonalChartData] = useState([]);
    const [residChartData, setResidChartData] = useState([]);
    const [message, setMessage] = useState("Please select inputs to view the chart.");
    const [selectedCompanyCode, setSelectedCompanyCode] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [companyCodes, setCompanyCodes] = useState([]);

    useEffect(() => {
        const fetchCompanyCodes = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/get-company-codes/");
                const companyCodes = await response.json();
                setCompanyCodes(companyCodes);
            } catch (error) {
                console.error("Error fetching company codes:", error);
            }
        };

        fetchCompanyCodes();
    }, []);

    useEffect(() => {
        if (selectedCompanyCode && startDate && endDate) {
            const fetchTimeSeriesData = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:8000/api/get-data/?company_code=${selectedCompanyCode}&start_date=${startDate}&end_date=${endDate}`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    const data = await response.json();
                    console.log("Raw API Response:", data);
                    setRawData(data)

                    const formattedData = data.map((entry) => ({
                        timestamp: entry.date,
                        value: parseFloat(entry.last_transaction_price.replace('.', '').replace(',', '.')),
                    }));


                    const response_time_series = await fetch(
                        `http://localhost:8000/lstm/api/time_series_analysis/?company_code=${selectedCompanyCode}&start_date=${startDate}&end_date=${endDate}`
                    );
                    if (!response_time_series.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    const data_time_series = await response_time_series.json();

                   const formattedTrendData = data_time_series.trend.map((trendValue, index) => ({
                        timestamp: data_time_series.timestamp[index],
                        value: trendValue,
                    }));

                    const formattedSeasonalData = data_time_series.seasonal.map((seasonalValue, index) => ({
                        timestamp: data_time_series.timestamp[index],
                        value: seasonalValue,
                    }));

                    const formattedResidualData = data_time_series.residual.map((residualValue, index) => ({
                        timestamp: data_time_series.timestamp[index],
                        value: residualValue,
                    }));

                    console.log(formattedTrendData)

                    console.log("Formatted Chart Data:", formattedData);
                    setChartData(formattedData);
                    setTrendChartData(formattedTrendData);
                    setSeasonalChartData(formattedSeasonalData);
                    setResidChartData(formattedResidualData)
                    setMessage("");
                } catch (error) {
                    console.error("Error fetching time series data:", error);
                    setChartData([]);
                    setMessage("Error fetching time series data. Please try again.");
                }
            };

            fetchTimeSeriesData();
        } else {
            setChartData([]);
            setMessage("Please select inputs to view the chart.");
        }
    }, [selectedCompanyCode, startDate, endDate]);

    const handleInputChange = (field, value) => {
        if (field === "selectedCompanyCode") setSelectedCompanyCode(value);
        if (field === "startDate") setStartDate(value);
        if (field === "endDate") setEndDate(value);
    };

    return (
        <div>
            <DataSelectionInput
                companyCodes={companyCodes}
                selectedCompanyCode={selectedCompanyCode}
                startDate={startDate}
                endDate={endDate}
                onInputChange={handleInputChange}
            />
            {message && <p style={{ color: "red" }}>{message}</p>}
            <h1>Raw Data</h1>
            <TimeSeriesChart chartData={chartData} />
            <h1>Trend Data</h1>
            <TimeSeriesChart chartData={trendChartData} yAxisLabel="Тренд"/>
            <h1>Seasonal Data</h1>
            <TimeSeriesChart chartData={seasonalChartData} yAxisLabel="Сезоналност" />
            <h1>Residuals</h1>
            <TimeSeriesChart chartData={residChartData} yAxisLabel="Грешка"/>
        </div>
    );
};

export default TimeSeriesContainer;
