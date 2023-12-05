import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./toolbar_style.css";

function Toolbar() {
    const navigate = useNavigate();

    const defaultView = () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0m 0m 0m");
        modelViewer.setAttribute('camera-orbit', '0deg 0deg 28m');
    }

    const meshControlPanel = () => {
        navigate('/mesh');
    }

    return (
        <div className="toolbar">
            <button
                id="defaultViewButton"
                className="toolbar-button"
                onClick={defaultView}>
            </button>
            <button
                id="meshControlPanelButton"
                className="toolbar-button"
                onClick={meshControlPanel}>
            </button>
        </div>
    );
}

export default Toolbar;
