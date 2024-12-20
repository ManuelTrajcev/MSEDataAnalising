import './navBar.css';
import { NavLink } from 'react-router-dom';
import logo from '../images/stock-logo.png';

export default function Navbar() {
    return (
        <nav className="nav">
            <ul id="logo">
                <li>
                    <NavLink to="/">
                        <img src={logo} alt="logo" width="300" height="80"/>
                    </NavLink>
                </li>
            </ul>
            <ul id="pages">
                <li>
                    <NavLink
                        to="/about"
                        className={({isActive}) => (isActive ? 'active' : '')}
                    >
                        За Берзата
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/show-data"
                        className={({isActive}) => (isActive ? 'active' : '')}
                    >
                        Издавачи
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/visulisation"
                        className={({isActive}) => (isActive ? 'active' : '')}
                    >
                        Визуелизација
                    </NavLink>
                </li>

            </ul>
        </nav>
    );
}
