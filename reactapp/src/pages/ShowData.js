import DataTable from "../components/DataTable";
import ShowDataBackground from "../components/ShowDataBackground";
import About from "./About";
import AboutBackground from "../components/AboutBackground";
import React from "react";
import IssuersBackground from "../components/IssuersBackground";

export default function ShowData() {
    return (
        <div>
            <div>
                <IssuersBackground/>
                <h1>Берзански издавачи</h1>
            </div>
            <div>
                <h1>Историски податоци за издавачи</h1>
                <DataTable companyCode="KMB"/>
            </div>
        </div>

    )

}
