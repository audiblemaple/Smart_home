import React, {useEffect, useState} from 'react';
import ModelViewer from '../elements/ModelViewer';
import Banner from '../elements/banner/Banner';
import Toolbar from '../elements/toolbar/Toolbar';
import Modal from "../elements/Modal/Modal";
import ErrorPopup from "../elements/Popup/ErrorPopup";
import useWebSocket, {ReadyState} from "react-use-websocket";

const HouseView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [children, setChildren] = useState(false);
    const [tempButton, setTempButton] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const [buttonFilter, setButtonFilter] = useState(0);

    const [websocketMessage, setWebsocketMessage] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const { sendJsonMessage, lastMessage, readyState
    } = useWebSocket(process.env.REACT_APP_SERVER_WEBSOCKET, {
            share: false,
            shouldReconnect: () => true,
            formats: ['binary'],
    });

    // Run when the connection state (readyState) changes
    useEffect(() => {
        // console.log("Connection state changed");
        switch (readyState) {
            case ReadyState.CONNECTING:
                console.log("connecting to websocket...");
                break;
            case ReadyState.OPEN:
                console.log("WebSocket connection established.");
                break;
            case ReadyState.CLOSING:
                console.log("WebSocket connection closing...");
                break;
            case ReadyState.CLOSED:
                console.log("WebSocket connection closed.");
                break;
            case ReadyState.UNINSTANTIATED:
                console.log("undefined websocket uninstantiated...");
                break;
            default:
                console.log("undefined websocket state...");
        }

    }, [readyState]);

    // Run when a new WebSocket message is received (lastJsonMessage)
    useEffect(() => {
        if (lastMessage) {
            try {
                const messageJson = JSON.parse(lastMessage.data);
                // console.log("Parsed message object:", messageJson);
                if (messageJson.type === "light"){
                    setWebsocketMessage(messageJson);
                    console.log("Parsed message object:", messageJson);
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
            }
        }
    }, [lastMessage]);

    const showError = (error) => {
        console.log(error)
        setErrorMessage(error);
        setTimeout(() => {
            setErrorMessage("");
        }, ((Number(process.env.REACT_APP_ERROR_DISPLAY_DURATION) || 2) * 1000) + 500); // regular error time + 0.5 seconds for the message to reset.
    }

    return (
        <div className="container">
            <div className="box">
                <ModelViewer tempButton={tempButton} setTempButton={setTempButton} setErrorMessage={setErrorMessage} errorMessage={errorMessage} buttonFilter={buttonFilter} websocketMessage={websocketMessage}/>
            </div>
            <Banner text="Smart home" />
            <Toolbar openModal={openModal} closeModal={closeModal} setChildren={setChildren} setTempButton={setTempButton} showError={showError} setButtonFilter={setButtonFilter}/>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal} children={children}>
                </Modal>
            )}
            {errorMessage &&  <ErrorPopup message={errorMessage} />}
        </div>
    );
}

export default HouseView;
