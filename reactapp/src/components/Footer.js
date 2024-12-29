import React from 'react';
import logo from '../images/logo-footer.jpg';
import './Footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer-box">
                    <img src={logo} alt="Footer Logo"/>
                </div>
                <div className="footer-box">
                    <h1>Брзи линкови</h1>
                    <div className="footer-links">
                        <a href="#">Последно на берза</a>
                        <a href="#">Мотивација</a>
                        <a href="#">Издавачи на берза</a>
                        <a href="#">Новости</a>
                    </div>
                </div>
                <div className="footer-box">
                    <h1>Потребни линкови</h1>
                    <div className="footer-links">
                        <a href="#">Издавачи</a>
                        <a href="#">Визуелизација</a>
                        <a href="#">Техничка анализа</a>
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
