import './styles/App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import "./styles/general_style.css"
import CameraFeed from "./Components/elements/CameraFeed";
import HouseView from "./Components/screens/HouseView";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HouseView />} />
                <Route path="/camera_feed" element={<CameraFeed ip="192.168.1.222"/>} />
            </Routes>
        </BrowserRouter>

    );
}

export default App;












