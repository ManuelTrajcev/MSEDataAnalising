import {color} from "chart.js/helpers";
import React from "react";
import TechnicalAnalysisBackground from "../components/TechnicalAnalysisBackground";

export default function TechnicalAnalysis() {
     return (
         <div>
             <div>
                 <TechnicalAnalysisBackground/>
                 <h1>Техничка анализа на податоци</h1>
             </div>
             <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                 <p color="black">tech analysis</p>
             </div>
         </div>
     )
}