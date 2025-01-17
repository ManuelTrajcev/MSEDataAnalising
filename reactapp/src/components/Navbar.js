import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../images/white-logo.png';

export default function Navbar() {
    const navItems = [
        { path: '/about', label: 'За Берзата' },
        { path: '/show-data', label: 'Издавачи' },
        { path: '/visualisation', label: 'Визуелизација' },
        { path: '/technical-analysis', label: 'Техничка Анализа' },
    ];

    return (
        <nav className="nav">
            <div className="logo">
                <NavLink to="/">
                    <img src={logo} alt="logo" width="40%" height="30%" />
                </NavLink>
            </div>
            <div className="nav-links">
                <ul className="pages">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
