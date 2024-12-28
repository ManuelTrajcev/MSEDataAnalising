import DataTable from "../components/IssuersPage/DataTable";
import React from "react";
import IssuersBackground from "../components/IssuersBackground";
import './ShowData.css'

export default function ShowData() {
    return (
        <div>
            <div className='above'>
                <IssuersBackground/>
                <h1>Берзански издавачи</h1>
            </div>
            <div className='bellow'>
                <h1>Историски податоци за издавачи</h1>
                <DataTable companyCode="KMB"/>
            </div>
        </div>

    )

}
