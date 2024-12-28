import React, { useEffect, useState } from "react";
import TimeSeriesChart from "./TimeSeriesChart";
import DataSelectionInput from "./DataSelectionInput";
import './TimeSeriesContainer.css'

const TimeSeriesContainer = () => {
    const [rawData, setRawData] = useState([]);
    const [chartData, setChartData] = useState([]);
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
                        value: parseFloat(entry.total_profit.replace('.', '').replace(',', '.')),
                    }));

                    console.log("Formatted Chart Data:", formattedData);
                    setChartData(formattedData);
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
        <div className="time-series-container">
            <DataSelectionInput
                companyCodes={companyCodes}
                selectedCompanyCode={selectedCompanyCode}
                startDate={startDate}
                endDate={endDate}
                onInputChange={handleInputChange}
            />
            {message && <p>{message}</p>}
            <TimeSeriesChart chartData={chartData}/>
        </div>

    );
};

export default TimeSeriesContainer;
