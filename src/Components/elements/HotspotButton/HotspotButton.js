import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import "./Buttons_style.css";
import FloatingActionButton from "../FloatingActionButton";


// TODO: fix bug where any click on the checkbox will turn on the light, i need to check if its a light.
const HotspotButton = ({
                           slot,
                           position,
                           normal,
                           blindOrLightOrCam: initialBlindOrLightOrCam,
                           initialIsOn,
                           nodeID
                       }) => {
    const [isOn, setIsOn] = useState(initialIsOn);
    const [isSetup, setIsSetUp] = useState(true);
    const [isClickable, setIsClickable] = useState(true);  // State to manage click timeout

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

    useEffect(() => {
        if (isSetup){
            setIsSetUp(false);
            return;
        }
        updateConfig(slot, isOn).then(r => console.log(`updated config for node: ${nodeID}`));
        sendCommand(isOn ? "turn_on" : "turn_off");
    }, [isOn]);

    const toggleActive = () => {
        setIsOn(!isOn);
    };

    function sendCommand(action) {
        if(nodeID === "????"){
            console.log("Node ID still unknown... add it to the config!");
            return;
        }
        console.log(`sending: ${action} to: ${nodeID}`)
        const url = `http://192.168.1.115/comm?id=${nodeID}&act=${action}`;

        fetch(url, {mode: 'no-cors'}).then(r => console.log("command sent"));
    }

    const updateConfig = async (slot, isOnValue) => {
        try {
            const response = await fetch('http://192.168.1.159:3001/api/config', {
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
            console.error('Error updating config:', error);
        }
    };

    const handleLightButtonClick = () => {
        if (isClickable && ['light', 'light_off', 'ac', 'blind', 'fab-action-4', 'fab-action-6'].includes(blindOrLightOrCam)) {
            setIsClickable(false);
            setTimeout(() => setIsClickable(true), 0.4 * SECOND);

            // Call toggleActive after setting timeout
            toggleActive();
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
                            actionType="open"
                            slot={slot}
                            className="fab-action-1"
                        />
                        <FloatingActionButton
                            actionType="close"
                            slot={slot}
                            className="fab-action-2"
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
    );
};

HotspotButton.propTypes = {
    slot: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    normal: PropTypes.string.isRequired,
    blindOrLightOrCam: PropTypes.oneOf(['blind', 'light', 'light_off', 'cam', 'ac']).isRequired,
};

export default HotspotButton;