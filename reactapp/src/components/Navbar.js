import './styles.css'
export default function Navbar() {
    return <nav className="nav">
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