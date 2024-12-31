import React, { useState } from "react";
import './About.css';
import AboutBackground from "../components/AboutPage/AboutBackground";
import Footer from "../components/Footer";
import img from '../images/finance.jpg'

const About = () => {
    const heroData = [
        { text1: "Мисија и визија", text2: "на тимот" },
    ];

    return (
        <div id='about-container'>
            <AboutBackground/>
            <div id='about-content'>
                <h1 className="heading">Мисија и визија на тимот</h1>
                <p>
                    Мисијата на Берзата е да овозможи ефикасно, транспарентно и безбедно работење на организираниот секундарен пазар на хартии од вредност во Република Македонија. Целта е да се обезбеди пристап за сите инвеститори при купување или продавање финансиски инструменти на различните берзански пазари, по фер пазарна цена. Дополнително, Берзата се стреми да им помогне на компаниите да привлечат нов капитал за нивниот развој, истовремено придонесувајќи за зголемување на довербата во македонскиот пазар на хартии од вредност.
                </p>
                <p>
                    Визијата на Берзата е да се позиционира како атрактивен и значаен секундарен пазар на хартии од вредност во Југоисточна Европа. Ова ќе се постигне преку постојано одржување на високи професионални стандарди, добро корпоративно управување и внимателно управување со односите со своите членки, акционери и други засегнати страни. Во иднина, Берзата ќе продолжи со иницијативи за регионална интеграција во различни форми, како и со анализа на можностите за сопственичко поврзување со други берзи, имајќи ја предвид променливата деловна и пазарна средина.
                </p>
            </div>
            <Footer/>
        </div>
    );
};

export default About;