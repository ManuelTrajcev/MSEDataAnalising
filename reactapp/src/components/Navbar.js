import './navBar.css'
import logo from '../images/logo.png';

export default function Navbar() {
    return <nav className="nav">
        <img src={logo} alt="logo" width="70px" height="37px"/>
        <a href="/" className="site-title"/>
        <ul>
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <a href="/get-data">Get data</a>
            </li>
            <li>
                <a href="/show-data">Show data</a>
            </li>
            <li>
                <a href="/visulisation">Visualisation</a>
            </li>
            <li>
                <a href="/about">About</a>
            </li>
        </ul>
    </nav>

}