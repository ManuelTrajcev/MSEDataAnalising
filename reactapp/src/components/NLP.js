import React, {useEffect, useState} from "react";

export default function NLP() {
    const [data, setData] = useState([]);
    const [companyCodes, setCompanyCodes] = useState([]);

    useEffect(() => {
        const fetchCompanyCodes = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/get-company-codes/");
                const companyCodes = await response.json();
                console.log(companyCodes[0].name)
                setCompanyCodes(companyCodes);
            } catch (error) {
                console.error("Error fetching company codes:", error);
            }
        };
        fetchCompanyCodes();
    }, []);

    useEffect(() => {
        const fetchCompanyPredictions = async () => {
            try {
                const serializedCompanyCodes = companyCodes.map(item => item.name).join(',');
                const response = await fetch(
                    `http://localhost:8000/nlp/api/get-company-predictions/?company_codes=${serializedCompanyCodes}`);
                const data = await response.json();
                const formattedData = Object.keys(data).map(key => ({
                    company_code: key,
                    prediction: data[key],
                }));
                setData(formattedData);
            } catch (error) {
                console.error("Error fetching company predictions:", error);
            }
        };
        fetchCompanyPredictions();
    }, [companyCodes]);


    return (
        <div className="data-table">
            <table border="1">
                <thead>
                <tr>
                    <th>Company code</th>
                    <th>Prediction</th>
                </tr>
                </thead>
                <tbody>
                {data.length > 0 ? (
                    data.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.company_code || "N/A"}</td>
                            <td>{entry.prediction || "N/A"}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="2" style={{textAlign: "center"}}>
                            No data available.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
