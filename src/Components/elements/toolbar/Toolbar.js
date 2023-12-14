import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./toolbar_style.css";

function Toolbar({openModal, closeModal, setChildren}) {
    const navigate = useNavigate();
    const [isClosed, setIsClosed] = useState(true);
    const toolbarRef = useRef(null); // Ref for the toolbar

    const toolbarClass = isClosed ? 'toolbar_closed' : 'toolbar_open';

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

    const handleNewButton = () => {
        setChildren(
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="exit" onClick={closeModal}></div>
                <h2>Add new button</h2>
                <a>nodeId</a>
                <select className="select-node">
                    <option value='turn_on'>Turn On</option>
                    <option value='turn_off'>Turn Off</option>
                    <option value='get_name'>Get Name</option>
                    <option value='set_name'>Set Name</option>
                    <option value='toggle_light'>Toggle light</option>
                    <option value='blink'>blink</option>
                </select>
                <a>nodeId</a>
                <select className="select-node">
                    <option value='turn_on'>Turn On</option>
                    <option value='turn_off'>Turn Off</option>
                    <option value='get_name'>Get Name</option>
                    <option value='set_name'>Set Name</option>
                    <option value='toggle_light'>Toggle light</option>
                    <option value='blink'>blink</option>
                </select>
                <button>
                    submit
                </button>
            </div>
        );
        openModal();
    }
    const handleEditButton = () => {
        setChildren(
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Edit buttons</h2>
                <select >
                    <option value='turn_on'>Turn On</option>
                    <option value='turn_off'>Turn Off</option>
                    <option value='get_name'>Get Name</option>
                    <option value='set_name'>Set Name</option>
                    <option value='toggle_light'>Toggle light</option>
                    <option value='blink'>blink</option>
                </select>
            </div>
        );
        openModal();
    }

    // Handle click outside toolbar
    useEffect(() => {
        function handleClickOutside(event) {
            if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
                setIsClosed(true); // Close the toolbar if click is outside
            }
        }

        // Bind the event listener
        document.addEventListener("click", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("click", handleClickOutside);
        };
    }, [toolbarRef]);

    return (
        <div ref={toolbarRef} className={toolbarClass} onClick={toggleToolbar}>
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
            <div
                id="newButton"
                className="toolbar-button"
                onClick={handleNewButton}>

            </div>
            <div
                id="editButton"
                className="toolbar-button"
                onClick={handleEditButton}>
            </div>
        </div>
    );
}

export default Toolbar;
