import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import "../../styles/Buttons_style.css"

// TODO: Add functionality to get the button state from the config file,
//       also change the state of the button in the file when clicked,
//       maybe later when i use electron.

const HotspotButton = ({
                           slot,
                           position,
                           normal,
                           blindOrLightOrCam,
                           is_active,
                       }) => {
    const wrapperClass = `fab-wrapper Hotspot`;
    const subButtonClass = "fas"
    const labelClass = blindOrLightOrCam === 'blind'
        ? 'fab-blind'
        : blindOrLightOrCam === 'light'
            ? 'fab-light'
            : blindOrLightOrCam === 'cam'
                ? 'fab-cam'
                : 'fab-ac';

    const [isActive, setIsActive] = useState(false);
    const checkboxRef = useRef(null);
    const navigate = useNavigate();

    const toggleActive = () => {
        setIsActive(!isActive);
    };

    const focusOnHotspot = (button) => {
        const position = button.getAttribute('data-position');
        const modelViewer = document.getElementById('model');

        modelViewer.setAttribute('camera-target', position);
        modelViewer.setAttribute('camera-orbit', '30deg 60deg 10m');
    };

    const handleCheckboxClick = async (e) => {
        e.stopPropagation();
        const checkboxes = document.querySelectorAll('.fab-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        checkboxRef.current.checked = true;
        focusOnHotspot(e.currentTarget.parentElement);
        if (blindOrLightOrCam === "cam")
            navigate('/cam');
    };

    return (
        <div
            className={wrapperClass}
            slot={slot}
            data-position={position}
            data-normal={normal}
            data-visibility-attribute="visible"
        >
            <input
                ref={checkboxRef}
                id={slot}
                type="checkbox"
                className="fab-checkbox"
                onClick={handleCheckboxClick}
            />
            <label className={labelClass} htmlFor={slot}></label>
            <div className="fab-wheel" >
                {blindOrLightOrCam === 'blind' && (
                    <>
                        <a  className="fab-action fab-action-3">
                            <i className={subButtonClass}></i>
                        </a>
                        <a className="fab-action fab-action-4">
                            <i className={subButtonClass}></i>
                        </a>
                    </>
                )}
                {blindOrLightOrCam === 'light' && (
                    <>
                        <a className="fab-action fab-action-1">
                            <i className={subButtonClass}></i>
                        </a>
                        <a className="fab-action fab-action-2">
                            <i className={subButtonClass}></i>
                        </a>
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
                        <a className={`fab-action ${isActive ? 'fab-action-8' : 'fab-action-6'}`} onClick={toggleActive}>
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
    blindOrLightOrCam: PropTypes.oneOf(['blind', 'light', 'cam', 'ac']).isRequired,
    is_active: PropTypes.bool,
};

export default HotspotButton;