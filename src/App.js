import './styles/App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import House_view from "./Components/House_view";
import "./styles/general_style.css"
import CameraFeed from "./Components/CameraFeed";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<House_view />} />
                <Route path="/camera_feed" element={<CameraFeed ip="192.168.1.222"/>} />
            </Routes>
        </BrowserRouter>

    );
}

export default App;












