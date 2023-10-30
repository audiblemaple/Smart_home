import './styles/App.css';
import Banner from './Components/Banner';
import ModelViewer from './Components/ModelViewer'

import "./styles/general_style.css"
import PerspectiveButton from '../src/Components/PerspectiveButton';
function App() {
    return (
        <div className="container">
            <div className="box">
                <ModelViewer />
            </div>
            <Banner text="Smart home" />
            <PerspectiveButton />
        </div>
    );
}

export default App;












