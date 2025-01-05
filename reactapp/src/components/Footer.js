import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo-footer.jpg';
import './Footer.css';

const Footer = () => {
    const navigate = useNavigate();

    const quickLinks = [
        { href: "#feature", label: "Последно на берза" },
        { href: "#static", label: "Мотивација" },
        { href: "#company-container", label: "Издавачи на берза" },
        { href: "#news", label: "Новости" },
    ];

    const usefulLinks = [
        { href: "/show-data", label: "Издавачи" },
        { href: "/visualisation", label: "Визуелизација" },
        { href: "/technical-analysis", label: "Техничка анализа" },
    ];

    const handleQuickLinkClick = (hash) => {
        navigate(`/${hash}`, { replace: true }); // Navigate to HomePage and add the hash
        setTimeout(() => {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0); // Ensure DOM has updated
    };

    const renderLinks = (links, isQuickLink = false) => (
        links.map((link, index) => (
            <a
                key={index}
                onClick={() =>
                    isQuickLink
                        ? handleQuickLinkClick(link.href)
                        : navigate(link.href)
                }
                style={{ cursor: "pointer" }}
            >
                {link.label}
            </a>
        ))
    );

    return (
        <footer>
            <div className="container">
                <div className="footer-box">
                    <img src={logo} alt="Footer Logo" />
                </div>
                <div className="footer-box">
                    <h1>Брзи линкови</h1>
                    <div className="footer-links">
                        {renderLinks(quickLinks, true)}
                    </div>
                </div>
                <div className="footer-box">
                    <h1>Потребни линкови</h1>
                    <div className="footer-links">
                        {renderLinks(usefulLinks)}
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Македонска Берза. Сите права се задржани.</p>
            </div>
        </footer>
    );
};

export default Footer;
