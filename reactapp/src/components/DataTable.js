import React, {useEffect, useState} from "react";
import TimeSeriesChart from "./TimeSeriesChart";

export default function DataTable() {
    const [data, setData] = useState([]);
    const [companyCodes, setCompanyCodes] = useState([]);
    const [selectedCompanyCode, setSelectedCompanyCode] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [message, setMessage] = useState("Please select a company.");
    const [chartData, setChartData] = useState([]);

    // Fetch all company codes on component mount
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

    // Update the message based on the selected company and dates
    useEffect(() => {
        if (!selectedCompanyCode) {
            setMessage("Please select a company.");
        } else if (!startDate || !endDate) {
            setMessage("Please select Date From and Date To.");
        } else {
            setMessage(""); // Clear the message when all required inputs are selected
        }
    }, [selectedCompanyCode, startDate, endDate]);

    // Fetch data when valid inputs are provided
    useEffect(() => {
        if (selectedCompanyCode && startDate && endDate) {
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:8000/api/get-data/?company_code=${selectedCompanyCode}&start_date=${startDate}&end_date=${endDate}`
                    );
                    const data = await response.json();
                    setData(data);

                    const formattedData = data.map((entry) => ({
                        timestamp: entry.date,
                        value: parseFloat(entry.total_profit.replace('.', '').replace(',', '.')),
                    }));

                    console.log("Formatted Chart Data:", formattedData);
                    setChartData(formattedData);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setMessage("Error fetching data. Please try again.");
                }
            };

            fetchData();
        }
    }, [selectedCompanyCode, startDate, endDate]);

    // Handle dropdown change
    const handleCompanyCodeChange = (event) => {
        setSelectedCompanyCode(event.target.value);
    };

    // Handle date change
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    return (
        <div className="data-table">
            <div>
                <span>
                    {/* Dropdown menu for selecting a company */}
                    <label htmlFor="companyCode">Select Company: </label>
                    <select
                        id="companyCode"
                        value={selectedCompanyCode}
                        onChange={handleCompanyCodeChange}
                    >
                        <option value="">--Select Company--</option>
                        {companyCodes.map((company, index) => (
                            <option key={index} value={company.code}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </span>

                <span>
                    {/* Date range pickers */}
                    <label htmlFor="startDate">Date From: </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </span>

                <span>
                    <label htmlFor="endDate">Date To: </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </span>
            </div>

            {/* Display message if necessary */}
            {message && <p style={{color: "red"}}>{message}</p>}

            <table border="1">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Last Transaction Price</th>
                    <th>Max Price</th>
                    <th>Min Price</th>
                    <th>Avg Price</th>
                    <th>Percentage</th>
                    <th>Profit</th>
                    <th>Total Profit</th>
                    <th>Company Code</th>
                </tr>
                </thead>
                <tbody>
                {data.length > 0 ? (
                    data.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.date_string || "N/A"}</td>
                            <td>{entry.last_transaction_price || "N/A"}</td>
                            <td>{entry.max_price || "N/A"}</td>
                            <td>{entry.min_price || "N/A"}</td>
                            <td>{entry.avg_price || "N/A"}</td>
                            <td>{entry.percentage || "N/A"}</td>
                            <td>{entry.profit || "N/A"}</td>
                            <td>{entry.total_profit || "N/A"}</td>
                            <td>{entry.company_code || "N/A"}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" style={{textAlign: "center"}}>
                            No data available.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <TimeSeriesChart chartData={chartData}/>

        </div>
    );
}
