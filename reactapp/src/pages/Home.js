import React from 'react';
import './Home.css';
import TickerComponent from '../components/Ticker'; // Import the new Ticker component

export default function Home() {
   return (
       <div id="page">
           <div className="home-section">
               <div className="home-text">
                   <h1><span>Инвестирај</span> правилно во твојата иднина</h1>
                   <p>преку нашата анализа на Македонската берза</p>
               </div>
           </div>

           {/* Add the Ticker component below the text */}
           {/*<TickerComponent />*/}
       </div>
   );
}
