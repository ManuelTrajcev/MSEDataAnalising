import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Visualise from "./pages/Visualise";
import ShowData from "./pages/ShowData";
import TechnicalAnalysis from "./pages/TechnicalAnalysis"
import Test from "./pages/test";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/show-data" element={<ShowData />} />
                    <Route path="/visualisation" element={<Visualise />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="/techical-analysis" element={<TechnicalAnalysis />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
