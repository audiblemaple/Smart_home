import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MeshControlPanel from "./Components/screens/MeshControlPanel/MeshLogin";
import ExternalPage     from "./Components/elements/ExternalPage/ExternalPage";
import MeshLogin        from "./Components/screens/MeshControlPanel/MeshLogin";
import HouseView        from "./Components/screens/HouseView";
import "./styles/general_style.css"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HouseView />} />
                <Route path="/meshLogin" element={<MeshLogin />} />
                <Route path="/meshControlPanel" element={<MeshControlPanel/>}/>
                <Route path="/cam" element={<ExternalPage src="http://192.168.1.159:8081/" width="1920" height="1080"/>} />
                <Route path="/mesh" element={<ExternalPage src="http://192.168.1.115/" width="1920" height="1080"/>} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;