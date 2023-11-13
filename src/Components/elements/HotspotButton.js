import React, {useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import "../../styles/Buttons_style.css";
import FloatingActionButton from "./FloatingActionButton";

const HotspotButton = ({
                           slot,
                           position,
                           normal,
                           blindOrLightOrCam: initialBlindOrLightOrCam,
                           initialIsOn
                       }) => {

    const [isOn, setIsOn] = useState(initialIsOn);

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

    useEffect(() => {
        updateConfig(slot, isOn)
    }, [isOn]);


    const toggleActive = () => {
        setIsOn(!isOn);
    };

    const updateConfig = async (slot, isOnValue) => {
        try {
            const response = await fetch('http://localhost:3001/api/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slot: slot, isOn: isOnValue }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
        } catch (error) {
            console.error('Error updating config:', error);
        }
    };


    const handleLightButtonClick = () => {
        console.log('toggle active called');
        if (initialBlindOrLightOrCam === 'light' || blindOrLightOrCam === 'light_off')
            toggleActive();
    };

    const handleCheckboxClick = async (e) => {
        e.stopPropagation();
        const checkboxes = document.querySelectorAll('.fab-checkbox');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        checkboxRef.current.checked = true;
        focusOnHotspot(e.currentTarget.parentElement);
        if (blindOrLightOrCam === "cam")
            navigate('/cam');
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
            // data-visibility-attribute="visible"
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
                            className="fab-action-3"
                        />
                        <FloatingActionButton
                            actionType="close"
                            slot={slot}
                            className="fab-action-4"
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
                        <a className="fab-action fab-action-5">
                            <i className={subButtonClass}></i>
                        </a>
                        <a className={`fab-action ${isOn ? 'fab-action-6' : 'fab-action-8'}`} onClick={toggleActive}>
                            <i className={subButtonClass}></i>
                        </a>
                        <a className="fab-action fab-action-7">
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