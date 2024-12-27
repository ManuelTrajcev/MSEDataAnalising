import React, { useState } from "react";
import Background from "../components/Background";
import Hero from "../components/Hero";

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
            <Background playStatus={playStatus} heroCount={heroCount} />
            <Hero
                setPlayStatus={setPlayStatus}
                heroData={heroData[heroCount]}
                heroCount={heroCount}
                setHeroCount={setHeroCount}
                playStatus={playStatus}
            />

        </div>
    );
};

export default Home;
