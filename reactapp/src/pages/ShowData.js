// ShowData.js
import React, { useState } from "react";
import DataTable from "../components/IssuersPage/DataTable";
import './ShowData.css'
import Background from "../components/Background";
import image1 from "../images/issuers.jpg";
import Footer from "../components/Footer";

export default function ShowData() {
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const handleDataLoaded = (data) => {
        setIsDataLoaded(data.length > 0);
    };

    return (
        <div id='issuers-container'>
            <Background imageSrc={image1} headingText={"Берзански издавачи"} altText="Image for Page 3" />
            <div id='issuers-bellow'>
                <h1>Историски податоци за издавачи</h1>
                <DataTable companyCode="KMB" onDataLoaded={handleDataLoaded} />
            </div>
            <Footer margin={!isDataLoaded} />
        </div>
    );
}
