import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from "../Slider/Slider";
import "./toolbar_style.css";
import HotspotButton from "../HotspotButton/HotspotButton";

function Toolbar({openModal, closeModal, setChildren, setTempButton}) {
    const navigate = useNavigate();
    const [isClosed, setIsClosed] = useState(true);
    const toolbarRef = useRef(null); // Ref for the toolbar
    const [isSubmitted, setIsSubmited] = useState(false);

    const toolbarClass = isClosed ? 'toolbar_closed' : 'toolbar_open';

    const positionRef = useRef({ x: 0, y: 0, z: 1 });
    const [position, setPosition] = useState({ x: 0, y: 0, z: 1 });

    const defaultView = () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0m 0m 0m");
        modelViewer.setAttribute('camera-orbit', '0deg 0deg 30m');
    };

    const meshControlPanel = () => {
        navigate('/mesh');
    }

    const toggleToolbar = (button) => {
        setIsClosed(!isClosed);
    };

    const handleCloseModal = () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0 0 0");
        modelViewer.setAttribute('camera-orbit', '15deg 50deg 35m');

        closeModal();
    }

    function fetchNodeData() {
        fetch('http://192.168.1.115/getNodes')
            .then(response =>
                response.json()
            )
            .then(data => {
                console.log("Got node data", data);
            })
            .catch(error =>
                console.error('Error fetching nodes:', error)
            );
    }

    const handlePositionChange = (axis, value) => {
        setPosition(prev => {
            const updatedPosition = { ...prev, [axis]: parseFloat(value) };
            positionRef.current = updatedPosition;
            console.log("Updated Position: ", updatedPosition);

            // Create and set the new HotspotButton with updated position
            const newButton = (
                <HotspotButton
                    key={`hotspot-${Date.now()}`}
                    slot="hotspot-19"
                    position={`${updatedPosition.x}m ${updatedPosition.z}m ${updatedPosition.y}m`}
                    normal="0m 1m 0m"
                    blindOrLightOrCam="light"
                    initialIsOn={false}
                    nodeID="123456789"
                />
            );
            setTempButton(newButton); // Update the tempButton to reflect the new position

            return updatedPosition;
        });
    };

    const handleSubmitNewButton = () => {
        setIsSubmited(true);
        closeModal();
        setTimeout(() => {
            setChildren(
                <div className={isSubmitted ? "hidden" : "modal"} onClick={(e) => e.stopPropagation()}>
                    <h2>{isSubmitted ? "choose location" : "Edit Button"}</h2>
                    X-position ↔
                    <Slider onChange={(value) => handlePositionChange('x', value)} />
                    Y-position ↕
                    <Slider onChange={(value) => handlePositionChange('y', value)} />
                    Z-position ↗
                    <Slider onChange={(value) => handlePositionChange('z', value)} />
                    <div className="buttons-container">
                        <button onClick={handleCloseModal}> Cancel </button>
                        <button onClick={handleSavebutton}> Save </button>
                    </div>
                </div>
            );
        }, 1000);
        openModal();
    }

    const handleSavebutton = () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0 0 0");
        modelViewer.setAttribute('camera-orbit', '15deg 50deg 35m');
        setIsSubmited(false);
        closeModal();
    }

    const handleNewButton = () => {
        const modelViewer = document.getElementById('model');

        modelViewer.setAttribute('camera-target', "0 0 10m");
        modelViewer.setAttribute('camera-orbit', '0deg 10deg 35m');
        setChildren(
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Add new button</h2>
                {/*<a>nodeId</a>*/}
                <select className="select-node" >
                    <option value="Chnode" disabled selected>Chose a node ID</option>
                    <option value='787656539'>787656539</option>
                    <option value='787656312'>787656312</option>
                    <option value='731265612'>731265612</option>
                    <option value='123363321'>123363321</option>
                    <option value='120917479'>120917479</option>
                    <option value='214297209'>214297209</option>
                </select>
                {/*<a>Name</a>*/}
                <input className="node-name" type="text" placeholder="Choose a name"></input>
                {/*<a>Choose type</a>*/}
                <select className="select-type" >
                    <option value="Chnode" disabled selected>Choose button type</option>
                    <option value='light'>light          </option>
                    <option value='blind'>blind          </option>
                    <option value='cam'>  camera         </option>
                    <option value='ac'>   air conditioner</option>
                </select>
                <div className="buttons-container">
                    <button onClick={handleCloseModal}> Cancel </button>
                    <button onClick={handleSubmitNewButton}> submit </button>
                </div>
            </div>
        );
        openModal();
    }

    const handleEditButton = () => {
        closeModal();
        setChildren(
            <div className={isSubmitted ? "hidden" : "modal"} onClick={(e) => e.stopPropagation()}>
                <h2>{isSubmitted ? "choose location" : "Edit Button"}</h2>
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


    // TODO:
    //     1. button is not being saved.
    // 2. no error handling.
    // 3. canceling the process should remove the button.

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
                onClick={meshControlPanel}
            >
            </div>
            <div
                id="newButton"
                className="toolbar-button"
                onClick={handleNewButton}
            >

            </div>
            <div
                id="editButton"
                className="toolbar-button"
                onClick={handleEditButton}
            >
            </div>
        </div>
    );
}

export default Toolbar;
