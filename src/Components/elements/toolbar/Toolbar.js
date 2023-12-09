import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import "./toolbar_style.css";

function Toolbar() {
    const navigate = useNavigate();

    const [isClosed, setIsClosed] = useState(false);
    const toolbarClass = isClosed ? 'toolbar_open' : 'toolbar_closed';

    const defaultView = () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0m 0m 0m");
        modelViewer.setAttribute('camera-orbit', '0deg 0deg 28m');
    };

    const meshControlPanel = () => {
        navigate('/mesh');
    }

    const toggleToolbar = () => {
        setIsClosed(!isClosed);
    };

    return (
        <div className={toolbarClass} onClick={toggleToolbar}>
            <div
                id="defaultViewButton"
                className="toolbar-button"
                onClick={defaultView}>
            </div>
            <div
                id="meshControlPanelButton"
                className="toolbar-button"
                onClick={meshControlPanel}>
            </div>
        </div>
    );
}

export default Toolbar;
