import React, {useEffect, useState} from 'react'

const LandingPageTable1 = () => {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState("Please select a company.");
    let selectedCompanyCode = "ALK,GRNT,KMB,MPT,REPL,SBT,STB,TEL,TTK"

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/get-last-day-data/?company_codes=${selectedCompanyCode}`
                );
                const data = await response.json();
                console.log(data)
                setData(data);

                const formattedData = data.map((entry) => ({
                    company_code: entry.company_code,
                    avg_price: entry.avg_price,
                    total_profit: entry.total_profit,
                    percentage_string: entry.percentage,
                    percentage: parseFloat(entry.percentage.replace('.', '').replace(',', '.')),
                }));

                console.log("Formatted Chart Data:", formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setMessage("Error fetching data. Please try again.");
            }
        };
        fetchData();
    }, []);
    return (
        <div>
            <h1>Header</h1>
        </div>
    )
}
export default LandingPageTable1;