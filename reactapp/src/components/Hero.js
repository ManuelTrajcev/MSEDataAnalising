import React from 'react'
import './Hero.css'
import arrow_btn from '../images/play.png'
import play_icon from '../images/play-btn.png'
import pause_icon from '../images/stop-btn.png'
import {NavLink} from "react-router-dom";

const Hero = ({heroData, setHeroCount, heroCount, setPlayStatus, playStatus}) => {
    return (
        <div className="hero">
            <div className="hero-text">
                <p>{heroData.text1}</p>
                <p>{heroData.text2}</p>
            </div>
            <div className='hero-explore'>
                <p>За Берзата</p>
                <NavLink to="/about">
                    <img src={arrow_btn} alt=""/>
                </NavLink>
            </div>
            <div className="hero-dot-play">
                <ul className="hero-dots">
                    <li onClick={()=>setHeroCount(0)} className={heroCount === 0 ? "hero-dot orange" : "hero-dot"}></li>
                    <li onClick={()=>setHeroCount(1)} className={heroCount === 1 ? "hero-dot orange" : "hero-dot"}></li>
                    <li onClick={()=>setHeroCount(2)} className={heroCount === 2 ? "hero-dot orange" : "hero-dot"}></li>
                </ul>
                <div className="hero-play">
                    <img onClick={()=>setPlayStatus(!playStatus)} src={playStatus?pause_icon:play_icon} alt=""/>
                </div>
            </div>
        </div>
    )
}

export default Hero