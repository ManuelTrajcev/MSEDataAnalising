import React from "react";

const DataSelectionInput = ({ companyCodes, selectedCompanyCode, startDate, endDate, onInputChange }) => {
    return (
        <div>
            <span>
                <label htmlFor="companyCode">Select Company: </label>
                <select
                    id="companyCode"
                    value={selectedCompanyCode}
                    onChange={(e) => onInputChange("selectedCompanyCode", e.target.value)}
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
                <label htmlFor="startDate">Date From: </label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => onInputChange("startDate", e.target.value)}
                />
            </span>

            <span>
                <label htmlFor="endDate">Date To: </label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => onInputChange("endDate", e.target.value)}
                />
            </span>
        </div>
    );
};

export default DataSelectionInput;
