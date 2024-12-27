import React, { useState } from "react";
import './About.css';
import AboutBackground from "../components/AboutBackground";

const About = () => {
    const heroData = [
        { text1: "Мисија и визија", text2: "на тимот" },
    ];

    return (
        <div>
            <AboutBackground/>
            <h1>Мисија и визија на тимот</h1>
        </div>
    );
};

export default About;
