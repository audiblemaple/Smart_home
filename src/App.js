import './styles/App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import House_view from "./Components/House_view";
import "./styles/general_style.css"
import CameraFeed from "./Components/CameraFeed";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<House_view />} />
                <Route path="/camera_feed" element={<CameraFeed ip="192.168.1.222"/>} />
            </Routes>
        </Router>

    );
}

export default App;












