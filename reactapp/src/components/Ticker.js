import React from 'react';
import Ticker from 'react-ticker';
import './Ticker.css'; // Optional: Add styles for the ticker here

const TickerComponent = () => {
    return (
        <div className="ticker-container">
            <Ticker>
                {() => (
                    <>
                        <h1 style={{ paddingRight: "1em", color: "white" }}>
                            Latest News: Market is up by 5% today!
                        </h1>
                    </>
                )}
            </Ticker>
        </div>
    );
};

export default TickerComponent;
