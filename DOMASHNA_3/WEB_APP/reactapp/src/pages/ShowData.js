import DataTable from "../components/IssuersPage/DataTable";
import React from "react";
import IssuersBackground from "../components/IssuersPage/IssuersBackground";
import './ShowData.css'
import AboutBackground from "../components/AboutPage/AboutBackground";
import Footer from "../components/Footer";

export default function ShowData() {
    return (
        <div id='issuers-container'>
            <IssuersBackground/>
            <div id='above'>
                <h1>Берзански издавачи</h1>
            </div>
            <div id='bellow'>
                <h1>Историски податоци за издавачи</h1>
                <DataTable companyCode="KMB"/>
            </div>
            <Footer/>
        </div>
    )

}
