import React, { useState } from "react";
import HomeBg from "../components/HomePage/HomeBg";
import Hero from "../components/HomePage/Hero";
import Companies from "../components/HomePage/Companies";
import Footer from "../components/Footer";
import News from "../components/HomePage/News";
import Features from "../components/HomePage/Feautres";
import StaticContent from "../components/HomePage/StaticContent";

const Home = () => {
    const heroData = [
        { text1: "Следете", text2: "трендови" },
        { text1: "Учете", text2: "стратегии" },
        { text1: "Инвестирајте", text2: "правилно" },
    ];
    const [heroCount, setHeroCount] = useState(0);
    const [playStatus, setPlayStatus] = useState(false);

    return (
        <div>
            <HomeBg playStatus={playStatus} heroCount={heroCount} />
            <Hero
                setPlayStatus={setPlayStatus}
                heroData={heroData[heroCount]}
                heroCount={heroCount}
                setHeroCount={setHeroCount}
                playStatus={playStatus}
            />
            <Features/>
            <StaticContent/>
            <Companies/>
            <News/>
            <Footer/>
        </div>
    );
};

export default Home;
