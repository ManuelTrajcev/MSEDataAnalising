import logo from "../images/logo.png";
import {useEffect, useState} from "react";

export default function DataTable({ companyCode }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch data from the API
        fetch(`http://localhost:8000/api/get-data/?company_code=${companyCode}`)
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="data-table">
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
                    {data.map((entry, index) => (
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}