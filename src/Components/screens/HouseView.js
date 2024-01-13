import React, {useEffect, useState} from 'react';
import ModelViewer from '../elements/ModelViewer';
import Banner from '../elements/banner/Banner';
import Toolbar from '../elements/toolbar/Toolbar';
import Modal from "../elements/Modal/Modal";
import ErrorPopup from "../elements/Popup/ErrorPopup";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {ErrorContext} from '../../Contexts/ErrorContext'
import {ModalContext} from "../../Contexts/ModalContext";
import {FilterContext} from "../../Contexts/FilterContext";
import {WebSocketContext} from "../../Contexts/WebSocketContext";
import {LoaderContext} from "../../Contexts/LoaderContext";
const HouseView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);

    const [children, setChildren] = useState(<></>);
    const [tempButton, setTempButton] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const [buttonFilter, setButtonFilter] = useState(0);

    const [websocketMessage, setWebsocketMessage] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const { sendJsonMessage, lastMessage, readyState} = useWebSocket(process.env.REACT_APP_SERVER_WEBSOCKET, { share: false, shouldReconnect: () => true, formats: ['binary'], });

    // Run when the connection state (readyState) changes
    useEffect(() => {
        // console.log("Connection state changed");
        switch (readyState) {
            case ReadyState.CONNECTING:
                // console.log("connecting to websocket...");
                showLoader()
                break;
            case ReadyState.OPEN:
                console.log("WebSocket connection established.");
                setTimeout(() => {
                    setIsConnecting(false);
                    setIsFullScreen(false);
                    closeModal();
                }, 1000);
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

    const showLoader = () =>{
        if ( !isConnecting ) return;
        setIsFullScreen(true);

        setChildren( <div className="loader"></div> );
        openModal();
    }

    useEffect(() => { // Run when a new WebSocket message is received (lastJsonMessage)
        if (lastMessage) {
            try {
                const messageJson = JSON.parse(lastMessage.data);
                if (messageJson.type === "light") setWebsocketMessage(messageJson);
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
            <ErrorContext.Provider      value={{showError}}>
            <ModalContext.Provider      value={{isModalOpen, openModal, closeModal, isFullScreen, setIsFullScreen}}>
            <FilterContext.Provider     value={{buttonFilter, setButtonFilter}}>
            <WebSocketContext.Provider  value={{websocketMessage, sendJsonMessage}}>
            <LoaderContext.Provider     value={showLoader}>

                <div className="box">
                    <ModelViewer tempButton={tempButton}/>
                </div>
                <Banner text="Smart home"/>

                <Toolbar setChildren={setChildren} setTempButton={setTempButton}/>
                {isModalOpen && (
                    <Modal children={children}>
                    </Modal>
                )}
                {errorMessage &&  <ErrorPopup message={errorMessage} />}

            </LoaderContext.Provider>
            </WebSocketContext.Provider>
            </FilterContext.Provider>
            </ModalContext.Provider>
            </ErrorContext.Provider>
        </div>
    );
}

export default HouseView;