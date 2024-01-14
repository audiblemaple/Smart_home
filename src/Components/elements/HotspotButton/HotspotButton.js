import React, {useContext, useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import "./Buttons_style.css";
import FloatingActionButton from "./FloatingActionButton";
import {ErrorContext} from "../../../Contexts/ErrorContext";
import {FilterContext} from "../../../Contexts/FilterContext";
import {WebSocketContext} from "../../../Contexts/WebSocketContext";

const HotspotButton = ({
                           slot,
                           position,
                           normal,
                           buttonType: initialButtonTypeState,
                           initialIsOn,
                           nodeID,
                       }) => {
    const { showError } = useContext(ErrorContext);
    const { buttonFilter } = useContext(FilterContext);
    const { websocketMessage } = useContext(WebSocketContext);

    const [isOn, setIsOn] = useState(initialIsOn);
    const [isSetup, setIsSetUp] = useState(true);
    const [isClickable, setIsClickable] = useState(true);  // State to manage click timeout

    const [shouldBeDisplayed, setShouldBeDisplayed] = useState(true);

    const wrapperClass = `fab-wrapper Hotspot`;
    const subButtonClass = "fas";

    const buttonType = initialButtonTypeState === 'light' || initialButtonTypeState === 'light_off'
        ? (isOn ? 'light' : 'light_off')
        : initialButtonTypeState;
    const labelClass = buttonType === 'blind'
        ? 'fab-blind'
        : buttonType === 'light'
            ? 'fab-light'
            : buttonType === 'light_off'
                ? 'fab-light-off'
                : buttonType === 'cam'
                    ? 'fab-cam'
                    : 'fab-ac';

    const checkboxRef = useRef(null);
    const navigate = useNavigate();

    const SECOND = 1000;

    useEffect(() => {
        // No node id is set and thus this node should not be accessed at all...
        if (nodeID === "????")
            return;
        // Properties not set or no websocket
        if ( !websocketMessage || !websocketMessage.hasOwnProperty('type') || !websocketMessage.hasOwnProperty('id') || !websocketMessage.hasOwnProperty('argument'))
            return;
        // Not a light message, ignore
        if (websocketMessage.type !== "light" || websocketMessage.id !== nodeID)
            return;
        setIsOn(websocketMessage.argument);
    }, [websocketMessage]);

    const toggleActive = () => {
        setIsOn(!isOn);
    };

    useEffect(() => {
        switch (buttonFilter){
            case 0:
                setShouldBeDisplayed(true);
                break;
            case 1:
                buttonType !== "light" && buttonType !== "light_off" ? setShouldBeDisplayed(false) : setShouldBeDisplayed(true);
                break;
            case 2:
                buttonType !== "blind" ? setShouldBeDisplayed(false) : setShouldBeDisplayed(true);
                break;
            case 3:
                buttonType !== "cam"   ? setShouldBeDisplayed(false) : setShouldBeDisplayed(true);
                break;
            case 4:
                buttonType !== "ac"    ? setShouldBeDisplayed(false) : setShouldBeDisplayed(true);
                break;
            default:
                setShouldBeDisplayed(true); // If we got here then a new type was added and not updated so the button should definitely be displayed
                console.warn("New unknown button type.");
                break;
        }
    }, [buttonFilter]);

    async function sendCommand(action) {
        if (nodeID === "????") {
            console.log("Node ID still unknown... add it to the config!");
            return false;
        }
        // console.log(`sending: ${action} to: ${nodeID}`);

        const data = {
            nodeID: nodeID,
            action: action,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_API_URL}/command`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("HTTP error");

            return true;
        } catch (error) {
            console.error(`Error sending command to node: ${nodeID}`, error);
            showError(`Error sending command to node: ${nodeID}`, error);
            return false;
        }
    }

    const updateConfig = async (slot, isOnValue) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_API_URL}/config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slot: slot, isOn: isOnValue }),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            await response.json();
        } catch (error) {
            showError('Error updating config:', error);
            console.error('Error updating config:', error);
        }
    };

    const handleLightButtonClick = async () => {
        if (isClickable && ['light', 'light_off'].includes(buttonType)) {
            setIsClickable(false);
            setTimeout(() => setIsClickable(true), 0.4 * SECOND);

            // Attempt to send the command and update the configuration
            const commandSentSuccessfully = await sendCommand(isOn ? "turn_off" : "turn_on");
            if (commandSentSuccessfully) {
                try {
                    await updateConfig(slot, !isOn);
                    setIsOn(!isOn); // Toggle the light state only if the command and config update are successful
                } catch (error) {
                    console.error("Failed to update config: ", error);
                }
            }
        }
    };

    const handleCheckboxClick = async (e) => {
        if (buttonType === "ac")
            focusOnHotspot(e.currentTarget.parentElement);
        if (isClickable) {
            setIsClickable(false);
            setTimeout(() => setIsClickable(true), 1.7 * SECOND);

            e.stopPropagation();
            const checkboxes = document.querySelectorAll('.fab-checkbox');
            checkboxes.forEach(checkbox => checkbox.checked = false);
            checkboxRef.current.checked = true;
            if (buttonType === "cam") navigate('/cam');
        }
    };

    const focusOnHotspot = (button) => {
        const position = button.getAttribute('data-position');
        const modelViewer = document.getElementById('model');

        modelViewer.setAttribute('camera-target', position);
        modelViewer.setAttribute('camera-orbit', '30deg 60deg 10m');
    };

    return (
        <>
            {shouldBeDisplayed && (
                <div
                    className={wrapperClass}
                    slot={slot}
                    data-position={position}
                    data-normal={normal}
                >
                    <input
                        ref={checkboxRef}
                        id={slot}
                        type="checkbox"
                        className="fab-checkbox"
                        onClick={handleCheckboxClick}
                    />
                    <label
                        className={labelClass}
                        htmlFor={slot}
                        onClick={handleLightButtonClick}
                    ></label>
                    <div className="fab-wheel">
                        {buttonType === 'blind' && (
                            <>
                                <FloatingActionButton
                                    actionType="blind_up"
                                    className="fab-action-1"
                                    sendCommand={sendCommand}
                                />
                                <FloatingActionButton
                                    actionType="blind_down"
                                    className="fab-action-2"
                                    sendCommand={sendCommand}
                                />
                            </>
                        )}
                        {buttonType === 'light' && (
                            <></>
                        )}
                        {buttonType === 'light_off' && (
                            <></>
                        )}
                        {buttonType === 'cam' && (
                            <></>
                        )}
                        {buttonType === 'ac' && (
                            <>
                                <a className="fab-action fab-action-3">
                                    <i className={subButtonClass}></i>
                                </a>
                                <a className={`fab-action ${isOn ? 'fab-action-4' : 'fab-action-6'}`} onClick={toggleActive}>
                                    <i className={subButtonClass}></i>
                                </a>
                                <a className="fab-action fab-action-5">
                                    <i className={subButtonClass}></i>
                                </a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

HotspotButton.propTypes = {
    slot: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    normal: PropTypes.string.isRequired,
    buttonType: PropTypes.oneOf(['blind', 'light', 'light_off', 'cam', 'ac']).isRequired,
};

export default HotspotButton;