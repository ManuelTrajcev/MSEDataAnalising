import React from 'react';

export default function FilterSelect({ label, id, value, onChange, options, placeholder }) {
    return (
        <span>
            <label htmlFor={id}>{label} </label>
            <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </span>
    );
}
