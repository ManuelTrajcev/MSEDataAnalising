import React from 'react'
import Ticker from "./Ticker";
import './Features.css'
import LandingPageTable from "./LandingPageTable";

const Features = () => {
    return (
        <div id="feature">
                <div className="ticker">
                    <Ticker/>
                </div>
                <div className="features-content">
                    <LandingPageTable/>
                </div>
        </div>
    )
}
export default Features;