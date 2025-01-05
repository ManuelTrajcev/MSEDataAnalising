import React from "react";

export default function CompanySelector({ companyCodes, selectedCompanyCode, onChange }) {
    return (
        <div id="tech-button">
            <select onChange={onChange} value={selectedCompanyCode}>
                <option value="">Избери компанија</option>
                {companyCodes.map((company, index) => (
                    <option key={index} value={company.code}>
                        {company.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
