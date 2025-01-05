import React, { useEffect, useState } from "react";
import './DataTable.css';
import FilterSelect from './FilterSelect';
import FilterDate from './FilterDate';
import DataTableContent from './DataTableContent';

export default function DataTable() {
    const [data, setData] = useState([]);
    const [companyCodes, setCompanyCodes] = useState([]);
    const [selectedCompanyCode, setSelectedCompanyCode] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [message, setMessage] = useState("Молиме изберете компанија.");
    const [, setChartData] = useState([]);

    useEffect(() => {
        const fetchCompanyCodes = async () => {
            try {
                const response = await fetch("http://localhost:8000/datascraper/api/get-company-codes/");
                const companyCodes = await response.json();
                setCompanyCodes(companyCodes);
            } catch (error) {
                console.error("Грешка при вчитување на кодови на компании:", error);
            }
        };

        fetchCompanyCodes();
    }, []);

    useEffect(() => {
        updateMessage();
    }, [selectedCompanyCode, startDate, endDate]);

    const updateMessage = () => {
        if (!selectedCompanyCode) {
            setMessage("Изберете компанија.");
        } else if (!startDate || !endDate) {
            setMessage("Изберете Датум од и Датум до.");
        } else {
            setMessage(""); // Clear message when inputs are valid
        }
    };

    useEffect(() => {
        if (selectedCompanyCode && startDate && endDate) {
            fetchData();
        }
    }, [selectedCompanyCode, startDate, endDate]);

    const fetchData = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/datascraper/api/get-data/?company_code=${selectedCompanyCode}&start_date=${startDate}&end_date=${endDate}`
            );
            const data = await response.json();
            setData(data);

            const formattedData = formatChartData(data);
            // console.log("Форматирани податоци за график:", formattedData);
            setChartData(formattedData);
        } catch (error) {
            console.error("Грешка при вчитување на податоци:", error);
            setMessage("Грешка при вчитување на податоци. Молиме обидете се повторно.");
        }
    };

    const formatChartData = (data) => {
        return data.map((entry) => ({
            timestamp: entry.date,
            value: parseFloat(entry.total_profit.replace('.', '').replace(',', '.')),
        }));
    };

    return (
        <div className="data-table">
            <div className="filters">
                <FilterSelect
                    label="Изберете компанија:"
                    id="companyCode"
                    value={selectedCompanyCode}
                    onChange={setSelectedCompanyCode}
                    options={companyCodes.map(({ code, name }) => ({ value: code, label: name }))}
                    placeholder="--Изберете Компанија--"
                />
                <FilterDate
                    label="Датум од:"
                    id="startDate"
                    value={startDate}
                    onChange={setStartDate}
                />
                <FilterDate
                    label="Датум до:"
                    id="endDate"
                    value={endDate}
                    onChange={setEndDate}
                />
            </div>

            {message && <p className="error-message">{message}</p>}

            <DataTableContent data={data} />
        </div>
    );
}
