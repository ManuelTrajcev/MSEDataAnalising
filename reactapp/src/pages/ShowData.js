import React from "react";
import DataTable from "../components/IssuersPage/DataTable";
import './ShowData.css'
import Background from "../components/Background";
import image1 from "../images/issuers.jpg";
import Footer from "../components/Footer";


export default function ShowData() {
    return (
        <div id='issuers-container'>
            <Background imageSrc={image1} headingText={"Берзански издавачи"} altText="Image for Page 3" />
            <div id='issuers-bellow'>
                <h1>Историски податоци за издавачи</h1>
                <DataTable companyCode="KMB"/>
            </div>
            <Footer/>
        </div>
    )
}
