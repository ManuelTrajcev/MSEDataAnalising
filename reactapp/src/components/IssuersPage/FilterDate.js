import React from 'react';

export default function FilterDate({ label, id, value, onChange }) {
    return (
        <span>
            <label htmlFor={id}>{label} </label>
            <input type="date" id={id} value={value} onChange={(e) => onChange(e.target.value)} />
        </span>
    );
}
