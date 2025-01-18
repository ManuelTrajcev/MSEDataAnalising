import React, { useEffect, useState } from 'react';
import './Background.css';

const Background = ({ imageSrc, altText = "Background Image", headingText }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            setIsImageLoaded(true);
        };
    }, [imageSrc]); // Dependency on the `imageSrc` prop

    return (
        <div className="background-container">
            {isImageLoaded ? (
                <>
                    <img src={imageSrc} className="about-background" alt={altText} />
                    <h1 className="background-heading">{headingText}</h1>
                </>
            ) : (
                <div className="placeholder">Loading...</div> // Optional placeholder
            )}
        </div>
    );
};

export default Background;
