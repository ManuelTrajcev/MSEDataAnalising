// import TimeSeriesGraph from "../components/TimeSeriesChart";
// import TimeSeriesContainer from "../components/TimeSeriesContainer";
import React from "react";
import VisualizeBackground from "../components/VisualizeBackground";
import './Visualise.css'
import TimeSeriesContainer from "../components/VisualizationPage/TimeSeriesContainer";

export default function Visualise() {
    return (
        <div>
            <div id="container">
                <VisualizeBackground/>
                <h1>Визуелизација на податоци</h1>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <TimeSeriesContainer/>
            </div>
        </div>
    )
}