import React from 'react';

export default function DataTableContent({ data }) {
    return (
        <table border="1">
            <thead>
                <tr>
                    <th>Датум</th>
                    <th>Цена на последна трансакција</th>
                    <th>Макс.</th>
                    <th>Мин.</th>
                    <th>Просечна цена</th>
                    <th>% пром.</th>
                    <th>Количина</th>
                    <th>Промет во БЕСТ</th>
                    <th>Издавач</th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.date_string || "Н/А"}</td>
                            <td>{entry.last_transaction_price || "Н/А"}</td>
                            <td>{entry.max_price || "Н/А"}</td>
                            <td>{entry.min_price || "Н/А"}</td>
                            <td>{entry.avg_price || "Н/А"}</td>
                            <td>{entry.percentage || "Н/А"}</td>
                            <td>{entry.profit || "Н/А"}</td>
                            <td>{entry.total_profit || "Н/А"}</td>
                            <td>{entry.company_code || "Н/А"}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" style={{ textAlign: "center" }}>
                            Нема податоци достапни.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
