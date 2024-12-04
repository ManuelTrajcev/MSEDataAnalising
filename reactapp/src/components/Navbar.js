import './navBar.css';
import { NavLink } from 'react-router-dom';
import logo from '../images/logo.png';

export default function Navbar() {
    return (
        <nav className="nav">
            <span id="title">МАКЕДОНСКА БЕРЗА</span>
            <ul>
                <li>
                    <NavLink
                        to="/"
                        className={({isActive}) => (isActive ? 'active' : '')}
                    >
                        Home
                    </NavLink>
                </li>
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
                        Тренд и сезоналност
                    </NavLink>
                </li>

            </ul>
        </nav>
    );
}
