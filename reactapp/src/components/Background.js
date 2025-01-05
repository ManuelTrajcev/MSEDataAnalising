import React, { useEffect, useState } from 'react';
import './Background.css';

const Background = ({ imageSrc, altText = "Background Image" }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            setIsImageLoaded(true);
        };
    }, [imageSrc]); // Dependency on the `imageSrc` prop

    return (
        <>
            {isImageLoaded ? (
                <img src={imageSrc} className="about-background" alt={altText} />
            ) : (
                <div className="placeholder">Loading...</div> // Optional placeholder
            )}
        </>
    );
};

export default Background;
