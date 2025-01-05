import React from "react";
import './Visualise.css'
import TimeSeriesContainer from "../components/VisualizationPage/TimeSeriesContainer";
import Footer from "../components/Footer";
import Background from "../components/Background";
import image1 from "../images/visualise.jpg";

export default function Visualise() {
    return (
        <div id="vis-container">
            <Background imageSrc={image1} altText="Image for Page 4" />
            <div id="vis-above">
                <h1>Визуелизација на податоци</h1>
            </div>
            <div id="vis-bellow"
                 style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <h1>Графички приказ на податоци за издавачи</h1>
                <TimeSeriesContainer/>
            </div>
            <Footer/>
        </div>
    )
}