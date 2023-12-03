import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HouseView from "./Components/screens/HouseView";
import CameraFeed from "./Components/elements/cameraFeed/CameraFeed";
import "./styles/general_style.css"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HouseView />} />
                <Route path="/cam" element={<CameraFeed src="http://192.168.1.159:8081/" width="1920" height="1080"/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;












