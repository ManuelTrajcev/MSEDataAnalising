import React, { useEffect, useState } from 'react';
import image1 from '../../images/issuers.jpg';

const IssuersBackground = () => {
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
                <img src={image1} className="about-background" alt="Issuers HomeBg" />
            ) : (
                <div className="placeholder">Loading...</div> // Optional placeholder
            )}
        </>
    );
};

export default IssuersBackground;
