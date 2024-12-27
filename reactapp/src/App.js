import {
    BrowserRouter as Router,
    Switch,
    Link,
    Redirect,
    Routes,
    Route
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Visualise from "./pages/Visualise";
import Navbar from "./components/Navbar";

import ShowData from "./pages/ShowData";
import Nlp_predictions from "./pages/nlp_predictions";

function App() {

    return (
        <Router>
            <Navbar/>
            <Routes>
                {/*<Route exact path="/" element={<Home/>}/>*/}
                <Route path="/" element={<Home/>}/>
                <Route path="/test" element={<Nlp_predictions/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/show-data" element={<ShowData/>}/>
                <Route path="/visulisation" element={<Visualise/>}/>
            </Routes>
        </Router>
    );
}

export default App;
