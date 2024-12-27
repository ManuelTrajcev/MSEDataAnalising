// import TimeSeriesGraph from "../components/TimeSeriesChart";
import TimeSeriesContainer from "../components/TimeSeriesContainer";
import React from "react";
import VisualizeBackground from "../components/VisualizeBackground";

export default function Visualise() {
    return (
        <div>
            <div>
                <VisualizeBackground/>
                <h1>Визуелизација на податоци</h1>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <TimeSeriesContainer/>
            </div>
        </div>
    )
}