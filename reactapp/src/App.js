import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Visualise from "./pages/Visualise";
import Navbar from "./components/Navbar";
import GetData from "./pages/GetData";
import ShowData from "./pages/ShowData";

function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/get-data" element={<GetData/>}/>
                <Route path="/show-data" element={<ShowData/>}/>
                <Route path="/visulisation" element={<Visualise/>}/>
            </Routes>
        </Router>
    );
}

export default App;
