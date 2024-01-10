import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import "./Buttons_style.css";
import FloatingActionButton from "./FloatingActionButton";

const HotspotButton = ({
                           slot,
                           position,
                           normal,
                           blindOrLightOrCam: initialBlindOrLightOrCam,
                           initialIsOn,
                           nodeID,
                           setErrorMessage,
                           buttonFilter
                       }) => {
    const [isOn, setIsOn] = useState(initialIsOn);
    const [isSetup, setIsSetUp] = useState(true);
    const [isClickable, setIsClickable] = useState(true);  // State to manage click timeout

    const [shouldBeDisplayed, setShouldBeDisplayed] = useState(true);

    const wrapperClass = `fab-wrapper Hotspot`;
    const subButtonClass = "fas";

    const blindOrLightOrCam = initialBlindOrLightOrCam === 'light' || initialBlindOrLightOrCam === 'light_off'
        ? (isOn ? 'light' : 'light_off')
        : initialBlindOrLightOrCam;
    const labelClass = blindOrLightOrCam === 'blind'
        ? 'fab-blind'
        : blindOrLightOrCam === 'light'
            ? 'fab-light'
            : blindOrLightOrCam === 'light_off'
                ? 'fab-light-off'
                : blindOrLightOrCam === 'cam'
                    ? 'fab-cam'
                    : 'fab-ac';

    const checkboxRef = useRef(null);
    const navigate = useNavigate();

    const SECOND = 1000;

    // useEffect(() => {
    //     if (isSetup){
    //         setIsSetUp(false);
    //         return;
    //     }
    //     sendCommand(isOn ? "turn_on" : "turn_off");
    //
    //     updateConfig(slot, isOn)
    //         .then(r => console.log(`updated config for node: ${nodeID}`))
    //         .catch(error => {
    //             console.error(`Error updating config for node: ${nodeID}`, error);
    //         });
    // }, [isOn]);
    //
    const toggleActive = () => {
        setIsOn(!isOn);
    };

    useEffect(() => {
        switch (buttonFilter){
            case 0:
                setShouldBeDisplayed(true);
                break;
            case 1:
                blindOrLightOrCam !== "light" && blindOrLightOrCam !== "light_off" ? setShouldBeDisplayed(false) : setShouldBeDisplayed(true);

                break;
            case 2:
                blindOrLightOrCam !== "blind" ? setShouldBeDisplayed(false) : setShouldBeDisplayed(true);
                break;
            case 3:
                blindOrLightOrCam !== "cam" ? setShouldBeDisplayed(false) : setShouldBeDisplayed(true);
                break;

            case 4:
                blindOrLightOrCam !== "ac" ? setShouldBeDisplayed(false) : setShouldBeDisplayed(true);
                break;

            default:
                setShouldBeDisplayed(true); // if we got here then the button should definitely be displayed
        }
    }, [buttonFilter]);

    async function sendCommand(action) {
        if (nodeID === "????") {
            console.log("Node ID still unknown... add it to the config!");
            return false;
        }
        console.log(`sending: ${action} to: ${nodeID}`);

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

            if (!response.ok) {
                throw new Error("HTTP error");
            }

            return true;
        } catch (error) {
            console.error(`Error sending command to node: ${nodeID}`, error);
            setErrorMessage("An error occurred");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
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

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await response.json();
        } catch (error) {
            setErrorMessage("An error occurred ");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
            console.error('Error updating config:', error);
        }
    };

    const handleLightButtonClick = async () => {
        if (isClickable && ['light', 'light_off'].includes(blindOrLightOrCam)) {
            setIsClickable(false);
            setTimeout(() => setIsClickable(true), 0.4 * SECOND);

            // Attempt to send the command and update the configuration
            const commandSentSuccessfully = await sendCommand(isOn ? "turn_off" : "turn_on");
            if (commandSentSuccessfully) {
                try {
                    await updateConfig(slot, !isOn);
                    // Toggle the light state only if the command and config update are successful
                    setIsOn(!isOn);
                } catch (error) {
                    console.error("Failed to update config: ", error);
                }
            }
        }
    };

    const handleCheckboxClick = async (e) => {
        if (blindOrLightOrCam === "ac")
            focusOnHotspot(e.currentTarget.parentElement);
        if (isClickable) {
            setIsClickable(false);
            setTimeout(() => setIsClickable(true), 1.5 * SECOND);

            e.stopPropagation();
            const checkboxes = document.querySelectorAll('.fab-checkbox');
            checkboxes.forEach(checkbox => checkbox.checked = false);
            checkboxRef.current.checked = true;
            if (blindOrLightOrCam === "cam")
                navigate('/cam');
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
                        {blindOrLightOrCam === 'blind' && (
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
                        {blindOrLightOrCam === 'light' && (
                            <>
                            </>
                        )}
                        {blindOrLightOrCam === 'light_off' && (
                            <>
                            </>
                        )}
                        {blindOrLightOrCam === 'cam' && (
                            <>
                            </>
                        )}
                        {blindOrLightOrCam === 'ac' && (
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
    blindOrLightOrCam: PropTypes.oneOf(['blind', 'light', 'light_off', 'cam', 'ac']).isRequired,
};

export default HotspotButton;