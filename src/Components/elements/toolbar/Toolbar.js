import React, {useState, useEffect, useRef, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import "./toolbar_style.css";
import HotspotButton from "../HotspotButton/HotspotButton";
import Dropdown from "../Dropdown/Dropdown";
import TextField from "../TextField/TextField";
import DraggableRectangle from "../DraggableRectangle/DraggableRectangle";
import {ModalContext} from "../../../Contexts/ModalContext";
import {ErrorContext} from "../../../Contexts/ErrorContext";
import {FilterContext} from "../../../Contexts/FilterContext";
import PropTypes from "prop-types";
import FileUploader from "../FileUploader/FileUploader";

function Toolbar({setChildren, setTempButton}) {
    const { openModal, closeModal } = useContext(ModalContext);
    const { showError } = useContext(ErrorContext);
    const { setButtonFilter } = useContext(FilterContext);

    const [isFirst, setIsFirst] = useState(true);

    const navigate = useNavigate();
    const [isClosed, setIsClosed] = useState(true);
    const toolbarClass = isClosed ? 'toolbar_closed' : 'toolbar_open';
    const toolbarRef = useRef(null); // Ref for the toolbar

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0, z: 1 });
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, z: 1 });

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
        if (isFirst) return setIsFirst(false);

        const newButton = (
            <HotspotButton
                key={`hotspot-${Date.now()}`} // each time a different key for the new button to re-render
                slot="hotspot-19"
                position={`${Point.x / 5}m ${type === "light" ? 1.1 : 0.2 }m ${Point.y / 5}m`}
                normal="0m 1m 0m"
                buttonType={type}
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
                <TextField placeholder="choose node name" setText={setNodeName}></TextField>
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
            if (!response.ok) throw new Error('Network response was not ok');

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
        navigate('/meshLogin');
        // navigate('/mesh');
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

    const handleSubmitNewButton = () => {
        setIsSubmitted(true);
        if (nodeID === "Choose a node ID"){
            console.log("Node ID must be chosen!");
            showError("Must choose node ID!");
            return;
        }
        if (nodeName === ""){
            console.log("Name must not be empty!");
            showError("Name must not be empty!");
            return;
        }
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
                        <button onClick={handleSaveButton}> Submit</button>
                    </div>
                </div>
            );
            openModal();
        }, 100);
        setPosition({x: 0, y: 0, z: 1}); // Show the button for the first time.
    }

    const handleSaveButton = async () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0 0 0");
        modelViewer.setAttribute('camera-orbit', '15deg 50deg 35m');

        const dataPosition = `${Point.x / 5}m ${type === "light" ? 1.1 : 0.2 }m ${Point.y / 5}m`
        const buttonDataPosition = `${buttonPosition.x }m ${buttonPosition.z}m ${buttonPosition.y}m`
        const newButton = {
            name: nodeName,
            nodeID: nodeID,
            "data-position": buttonDataPosition,
            "data-normal": "0m 1m 0m",
            type: type,
            isOn: false
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_API_URL}/configAddHotspot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newButton)
            });

            if (response.status === 400) {
                closeModal();
                setTempButton(null);
                return showError("Node already exists!");
            }

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            console.log('New node added successfully!', result);
            showError('New node added successfully!'); // TODO: add good messages functionality.
            await setTimeout(() => {
                window.location.reload();
            }, 700);
        } catch (error) {
            showError("Error adding new button", error);
            // console.error('Error:', error);
        }

        setIsSubmitted(false);
        closeModal();
    }

    function isMobileDevice() {
        const userAgent = navigator.userAgent || window.opera; // removed  || navigator.vendor due to deprecation, leaving comment to remember if I'll have problems
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    }

    const handleNewButton = async () => {
        setNewButtonJump(true);
        await setTimeout(() => {
            setNewButtonJump(false);
        }, 500);

        if (nodeIdList.length === 0) return showError("No nodes are found, please connect more nodes");

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
                <TextField placeholder="choose node name" setText={setNodeName}></TextField>
                <Dropdown initialText={type} list={buttonTypeList} setSelectedElement={setType}/>

                <div className="buttons-container">
                    <button onClick={handleNodeSettings}> Cancel</button>
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

    const handleButtonInfo = () => {
        console.log("not implemented");
    }

    const handleHomeClick = () => {
        closeModal();
        setChildren(
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Model settings</h2>
                <div className="buttons-container">
                    <button id="file-upload" className="icon" onClick={handleFileUpload}></button>
                    <button id="file-remove" className="icon" onClick={handleModelSelect}></button>
                    <button id="model-change" className="icon" onClick={handleModelSelect}></button>
                    <button id="sky-box-change" className="icon" onClick={handleCloseModal}></button>
                    <button onClick={handleCloseModal}> Cancel</button>
                </div>
            </div>
        );
        openModal();
    }

    const handleFileUpload = () => {
        closeModal();
        setChildren(
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Upload a house model or skybox picture</h2>
                <FileUploader handleCloseModal={handleHomeClick}/>
            </div>
        );
        openModal();
    }


    const handleModelSelect = () => {
        fetch(`${process.env.REACT_APP_SERVER_API_URL}/listDir`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({dir: "models"})
        }
        )
        .then(response => response.text())
        .catch((error) => console.error('Error:', error));

        closeModal();
        setChildren(
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Select Model</h2>
                <Dropdown initialText={type} list={buttonTypeList} setSelectedElement={setType}/>
                <div className="buttons-container">
                    <button onClick={handleHomeClick}> Cancel</button>
                    <button onClick={handleSubmitNewButton}> Submit</button>
                </div>
            </div>
        );
        openModal();
    }

    // const handleModelSelect = () => {
    //     closeModal();
    //     setChildren(
    //         <div className="modal" onClick={(e) => e.stopPropagation()}>
    //             <h2>Select Model</h2>
    //             <Dropdown initialText={type} list={buttonTypeList} setSelectedElement={setType}/>
    //             <div className="buttons-container">
    //                 <button onClick={handleHomeClick}> Cancel</button>
    //                 <button onClick={handleSubmitNewButton}> Submit</button>
    //             </div>
    //         </div>
    //     );
    //     openModal();
    // }

    const handleNodeSettings = () => {
        closeModal();
        setChildren(
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Node options</h2>
                <div className="buttons-container">
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
                        className={`toolbar-button ${isMobileDevice() && filterButtonJump ? "jumpy" : ""}`}
                        onClick={changeButtonFilter}
                    >
                    </div>
                    <div
                        id="button-info"
                        className={`toolbar-button ${isMobileDevice() && editButtonJump ? "jumpy" : ""}`}
                        onClick={handleButtonInfo}
                    >
                    </div>
                </div>
                <div className="buttons-container">
                    <button onClick={handleCloseModal}> Cancel</button>
                </div>
            </div>
        );
        openModal();
    }

    const changeButtonFilter = (event) => {
        event.stopPropagation();
        setFilterButtonJump(true);
        setTimeout(() => {
            setFilterButtonJump(false);
        }, 500);

        setButtonFilter((prevFilter) => (prevFilter + 1) % 5);
    };

    // Handle click outside toolbar
    useEffect(() => {
        function handleClickOutside(event) {
            if (toolbarRef.current && !toolbarRef.current.contains(event.target)) setIsClosed(true); // Close the toolbar if clicked outside and its open
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
                id="change-models"
                className={`toolbar-button ${isMobileDevice() && editButtonJump ? "jumpy" : ""}`}
                onClick={handleHomeClick}
            >
            </div>
            <div
                id="button-settings"
                className={`toolbar-button ${isMobileDevice() && filterButtonJump ? "jumpy" : ""}`}
                onClick={handleNodeSettings}
            >
            </div>
        </div>
    );
}

export default Toolbar;