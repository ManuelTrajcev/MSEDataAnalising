import React from 'react'
import logo from '../images/logo-footer.jpg'
import './Footer.css'

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer-box">
                    <img src={logo} alt="" style={{ width: '200px', height: '280px' }} />
                </div>
                <div className="footer-box">
                    <h1>Брзи линкови</h1>
                    <div className="footer-links">
                        <a href="#">За нас</a>
                        <a href="#">Издавачи</a>
                        <a href="#">Визуелизација</a>
                        <a href="#">Техничка анализа</a>
                    </div>
                </div>
                <div className="footer-box">
                    <h1>Брзи линкови</h1>
                    <div className="footer-links">
                        <a href="#">За нас</a>
                        <a href="#">Издавачи</a>
                        <a href="#">Визуелизација</a>
                        <a href="#">Техничка анализа</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer;