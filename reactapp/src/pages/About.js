import React, { useState } from "react";
import './About.css';
import AboutBackground from "../components/AboutBackground";
import Footer from "../components/Footer";

const About = () => {
    const heroData = [
        { text1: "Мисија и визија", text2: "на тимот" },
    ];

    return (
        <div id='container'>
            <AboutBackground/>
            <div id='content'>
                <h1 className="heading">Мисија и визија на тимот</h1>
                <p>
                    Мисијата на Берзата е да овозможи ефикасно, транспарентно и безбедно работење на организираниот секундарен пазар на хартии од вредност во Република Македонија. Целта е да се обезбеди пристап за сите инвеститори при купување или продавање финансиски инструменти на различните берзански пазари, по фер пазарна цена. Дополнително, Берзата се стреми да им помогне на компаниите да привлечат нов капитал за нивниот развој, истовремено придонесувајќи за зголемување на довербата во македонскиот пазар на хартии од вредност.
                </p>
            </div>
        </div>
    );
};

export default About;
