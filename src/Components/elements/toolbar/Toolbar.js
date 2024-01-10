import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from "../Slider/Slider";
import "./toolbar_style.css";
import HotspotButton from "../HotspotButton/HotspotButton";
import "../Modal/modal_style.css"
import Dropdown from "../Dropdown/Dropdown";
import TextField from "../TextField/TextField";
import DraggableRectangle from "../DraggableRectangle/DraggableRectangle";

function Toolbar({openModal, closeModal, setChildren, setTempButton, showError, setButtonFilter}) {
    const navigate = useNavigate();
    const [isClosed, setIsClosed] = useState(true);
    const toolbarRef = useRef(null); // Ref for the toolbar
    const [isSubmitted, setIsSubmited] = useState(false);

    const toolbarClass = isClosed ? 'toolbar_closed' : 'toolbar_open';

    const positionRef = useRef({ x: 0, y: 0, z: 1 });
    const [position, setPosition] = useState({ x: 0, y: 0, z: 1 });

    const [isFirst, setIsFirst] = useState(true);
    const [newButtonJump, setNewButtonJump] = useState(false);
    const [editButtonJump, setEditButtonJump] = useState(false);
    const [filterButtonJump, setFilterButtonJump] = useState(false);

    const [Point, setPoint] = useState({ x: 0, y: 0 });

    const buttonTypeList = [
        "light",
        "blind",
        "cam",
        "ac"
    ];

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
                position={`${Point.x / 5}m ${type === "light" ? 1.1 : 0.2 }m ${Point.y / 5}m`}
                normal="0m 1m 0m"
                blindOrLightOrCam={type}
                initialIsOn={false}
                nodeID={nodeID}
            />
        );
        setTempButton(newButton);
    }, [position, Point]);


    const [nodeIdList, setNodeIdList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [nodeID, setNodeID] = useState("Choose a node ID");
    const [nodeName, setNodeName] = useState("");
    const [type, setType] = useState("Choose button type");

    useEffect(() => {
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
            </div>
        );
    }, [nodeID, nodeName, type]);

    const fetchNodeIds = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_API_URL}/getNodeIds`);
            // console.log(response);
            if (!response.ok)
                throw new Error('Network response was not ok');

            const json = await response.json();
            if ( !json.success){
                showError("Error fetching node IDs");
                return;
            }

            const nodeIdListFromJson = json.list.subs.map(sub => sub.nodeId);

            setNodeIdList(nodeIdListFromJson);

        } catch (error) {
            showError(error.message);

        } finally {
            setIsLoading(false);
        }
    };

    const defaultView = () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0m 0m 0m");
        modelViewer.setAttribute('camera-orbit', '0deg 0deg 30m');
    };

    const meshControlPanel = async () => {
        navigate('/mesh');
    }

    const toggleToolbar = (button) => {
        if (isClosed){
            setIsClosed(!isClosed);
            return;
        }
        setTimeout( () => {
            setIsClosed(!isClosed);
        }, 400);
    };

    const handleCloseModal = () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0 0 0");
        modelViewer.setAttribute('camera-orbit', '15deg 50deg 35m');
        setTempButton(null);
        closeModal();
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
                    <DraggableRectangle Point={Point} setPoint={setPoint}></DraggableRectangle>
                    <div className="buttons-container">
                        <button onClick={handleCloseModal}> Cancel</button>
                        <button onClick={handleSubmitNewButton}> Submit</button>
                    </div>
                </div>
            );
            openModal();
        }, 100);
        setPosition({x: 0, y: 0, z: 1});
    }

    const handleSavebutton = () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0 0 0");
        modelViewer.setAttribute('camera-orbit', '15deg 50deg 35m');
        setIsSubmited(false);
        closeModal();
    }

    function isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    }

    const handleNewButton = async () => {
        setNewButtonJump(true);
        await setTimeout(() => {
            setNewButtonJump(false);
        }, 500);

        if (nodeIdList.length === 0) {
            showError("No nodes are found, please connect more nodes");
            return;
        }

        const modelViewer = document.getElementById('model');
        if (isMobileDevice()) {
            console.log("mobile");
            modelViewer.setAttribute('camera-target', "0 0 6m");

        } else {
            console.log("desktop");
            modelViewer.setAttribute('camera-target', "0 0 4m");
        }
        modelViewer.setAttribute('camera-orbit', '0deg 10deg 28m');

        setChildren(
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Add new button</h2>
                <Dropdown initialText={nodeID} list={nodeIdList} setSelectedElement={setNodeID}/>
                <TextField setText={setNodeName}></TextField>
                <Dropdown initialText={type} list={buttonTypeList} setSelectedElement={setType}/>

                <div className="buttons-container">
                    <button onClick={handleCloseModal}> Cancel</button>
                    <button onClick={handleSubmitNewButton}> Submit</button>
                </div>
            </div>
        );
        openModal();

        setNewButtonJump(!newButtonJump);
    }

    const handleEditButton = () => {
        setEditButtonJump(true);
        setTimeout( () => {
            setEditButtonJump(false);
        }, 500);

        closeModal();
        setChildren(
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{isSubmitted ? "choose location" : "Edit Button"}</h2>
                <div className="buttons-container">
                    <button onClick={handleCloseModal}> Cancel</button>
                    <button onClick={handleSubmitNewButton}> Submit</button>
                </div>
            </div>
        );
        openModal();
    }

    const changeButtonFilter = (event) => {
        event.stopPropagation();
        setFilterButtonJump(true);
        setTimeout( () => {
            setFilterButtonJump(false);
        }, 500);


        setButtonFilter((prevFilter) => (prevFilter + 1) % 5);

    };

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
                className={`toolbar-button `}
                onClick={meshControlPanel}
            >
            </div>
            <div
                id="newButton"
                className={`toolbar-button ${isMobileDevice() && newButtonJump ? "jumpy" : ""}`}
                onClick={handleNewButton}
            >

            </div>
            <div
                id="editButton"
                className={`toolbar-button ${isMobileDevice() && editButtonJump ? "jumpy" : ""}`}
                onClick={handleEditButton}
            >
            </div>
            <div
                id="buttonFilter"
                className={`toolbar-button ${isMobileDevice() && editButtonJump ? "jumpy" : ""}`}
                onClick={changeButtonFilter}
            >
            </div>
            <div
                id="newButton"
                className={`toolbar-button ${isMobileDevice() && editButtonJump ? "jumpy" : ""}`}
                onClick={handleEditButton}
            >
            </div>
        </div>
    );
}

export default Toolbar;