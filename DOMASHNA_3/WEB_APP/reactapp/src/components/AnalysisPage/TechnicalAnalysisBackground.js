import React, { useEffect, useState } from 'react';
import '../AboutPage/AboutBackground.css';
import image1 from '../../images/technical.jpg';

const TechnicalAnalysisBackground = () => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = image1;
        img.onload = () => {
            setIsImageLoaded(true);
        };
    }, []);

    return (
        <>
            {isImageLoaded ? (
                <img src={image1} className="about-background" alt="Technical Analysis Background" />
            ) : (
                <div className="placeholder">Loading...</div> // Optional placeholder
            )}
        </>
    );
};

export default TechnicalAnalysisBackground;