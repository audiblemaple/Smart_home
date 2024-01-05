import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from "../Slider/Slider";
import "./toolbar_style.css";
import HotspotButton from "../HotspotButton/HotspotButton";
import "../Modal/modal_style.css"
import Dropdown from "../Dropdown/Dropdown";
import TextField from "../TextField/TextField";

function Toolbar({openModal, closeModal, setChildren, setTempButton, setErrorMessage}) {
    const navigate = useNavigate();
    const [isClosed, setIsClosed] = useState(true);
    const toolbarRef = useRef(null); // Ref for the toolbar
    const [isSubmitted, setIsSubmited] = useState(false);

    const toolbarClass = isClosed ? 'toolbar_closed' : 'toolbar_open';

    const positionRef = useRef({ x: 0, y: 0, z: 1 });
    const [position, setPosition] = useState({ x: 0, y: 0, z: 1 });

    const [isFirst, setIsFirst] = useState(true);

    const buttonTypeList = [
        "light",
        "blind",
        "cam",
        "ac"
    ];

    const [modalError, setmodalError] = useState("");

    useEffect(() => {
        fetchNodeIds()
            .then(r => {});
    }, []);

    useEffect(() => {
        if (isFirst){
            setIsFirst(false);
            return
        }
        const newButton = (
            <HotspotButton
                key={`hotspot-${Date.now()}`} // each time a different key for the new button to re-render
                slot="hotspot-19"
                position={`${position.x}m ${position.z}m ${position.y}m`}
                normal="0m 1m 0m"
                blindOrLightOrCam={type}
                initialIsOn={false}
                nodeID={nodeID}
            />
        );
        setTempButton(newButton);
    }, [position]);


    const [nodeIdList, setNodeIdList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [nodeID, setNodeID] = useState("Choose a node ID");
    const [nodeName, setNodeName] = useState("");
    const [type, setType] = useState("Choose button type");


    const fetchNodeIds = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://192.168.1.159:3001/api/getNodeIds');
            // console.log(response);
            if (!response.ok)
                throw new Error('Network response was not ok');

            const json = await response.json();
            if ( !json.success){
                setErrorMessage("Error fetching node IDs");
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
                return;
            }

            const nodeIdListFromJson = json.list.subs.map(sub => sub.nodeId);

            setNodeIdList(nodeIdListFromJson);

        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

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
        setTempButton(null);
        closeModal();
    }

    const handlePositionChange = (axis, value) => {
        setPosition(prev => {
            const updatedPosition = { ...prev, [axis]: parseFloat(value) };
            positionRef.current = updatedPosition;

            return updatedPosition;
        });
    };

    const showError = (error) => {
        setErrorMessage(error);
        setTimeout(() => {
            setErrorMessage("");
        }, 3000);
    }

    const handleSubmitNewButton = () => {
        setIsSubmited(true);

        console.log(nodeID);
        if (nodeID === "Choose a node ID"){
            console.log("Node ID must be chosen!");
            showError("Must choose node ID!");
            return;
        }

        console.log(nodeName);
        if (nodeName === ""){
            console.log("Name must not be empty!");
            showError("Name must not be empty!");
            return;
        }

        console.log(type);
        if (type === "Choose button type"){
            console.log("Must choose button Type!");
            showError("Must choose button Type!");
            return;
        }
        closeModal();
        setTimeout(() => {
            setChildren(
                <div className="modal" onClick={(e) => e.stopPropagation()}>
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
            openModal();
        }, 100);

        setPosition({ x: 0, y: 0, z: 1 });
    }

    const handleSavebutton = () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0 0 0");
        modelViewer.setAttribute('camera-orbit', '15deg 50deg 35m');
        setIsSubmited(false);
        modelViewer.enableInteraction();
        closeModal();
    }

    // useEffect(() => {
    //     console.log({ nodeID, nodeName, type });
    // }, [nodeID, nodeName, type, nodeIdList]);
    //
    // useEffect(() => {
    //     console.log(nodeName);
    // }, [nodeName]);

    function isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    }

    const handleNewButton =  () => {
        if (nodeIdList.length === 0){
            setErrorMessage("No nodes are found, please connect more nodes");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
            return;
        }

        const modelViewer = document.getElementById('model');

        if (isMobileDevice()) {
            modelViewer.setAttribute('camera-target', "0 0 8m");
        } else {
            modelViewer.setAttribute('camera-target', "0 0 4m");
        }
        modelViewer.setAttribute('camera-orbit', '0deg 10deg 35m');

        setChildren(
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Add new button</h2>
                <Dropdown  initialText={nodeID} list={nodeIdList} setSelectedElement={setNodeID}/>
                <TextField setText={setNodeName}></TextField>
                <Dropdown  initialText={type} list={buttonTypeList} setSelectedElement={setType}/>

                <div className="buttons-container">
                    <button onClick={handleCloseModal}>       Cancel </button>
                    <button onClick={handleSubmitNewButton} > Submit </button>
                </div>
                <a>{modalError}</a>
            </div>
        );
        openModal();
    }

    const handleEditButton = () => {
        closeModal();
        setChildren(
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{isSubmitted ? "choose location" : "Edit Button"}</h2>
            </div>
        );
        openModal();
    }

    // Handle click outside toolbar
    useEffect(() => {
        function handleClickOutside(event) {
            if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
                setIsClosed(true); // Close the toolbar if clicked outside and its open
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
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