import React, {useEffect, useState} from "react";
import TimeSeriesChart from "./TimeSeriesChart";
import DataSelectionInput from "./DataSelectionInput";
import './TimeSeriesContainer.css'

const TimeSeriesContainer = () => {
    const [rawData, setRawData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [message, setMessage] = useState("Ве молиме изберете влезни податоци за да го видите графиконот.");
    const [selectedCompanyCode, setSelectedCompanyCode] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [companyCodes, setCompanyCodes] = useState([]);
    const [trendChartData, setTrendChartData] = useState([]);
    const [seasonalChartData, setSeasonalChartData] = useState([]);
    const [residChartData, setResidChartData] = useState([]);

    useEffect(() => {
        const fetchCompanyCodes = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/get-company-codes/");
                const companyCodes = await response.json();
                setCompanyCodes(companyCodes);
            } catch (error) {
                console.error("Грешка при преземање на кодовите на компании:", error);
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
                        throw new Error("Не успеа да се преземат податоците");
                    }
                    const data = await response.json();
                    console.log("Сиров API одговор:", data);
                    setRawData(data);

                    const formattedData = data.map((entry) => ({
                        timestamp: entry.date,
                        value: parseFloat(entry.total_profit.replace('.', '').replace(',', '.')),
                    }));

                    console.log("Форматирани податоци за графикон:", formattedData);
                    setChartData(formattedData);
                    setMessage("");
                } catch (error) {
                    console.error("Грешка при преземање на временски податоци:", error);
                    setChartData([]);
                    setMessage("Грешка при преземање на временски податоци. Обидете се повторно.");
                }
            };

            fetchTimeSeriesData();
        } else {
            setChartData([]);
            setMessage("Изберете влезни податоци за да го видите графиконот.");
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
            <TimeSeriesChart chartData={chartData} />
        </div>
    );
};

export default TimeSeriesContainer;
