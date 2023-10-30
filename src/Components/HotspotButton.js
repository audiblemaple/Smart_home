import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import "../styles/Buttons_style.css"

const HotspotButton = ({
                           slot,
                           position,
                           normal,
                           visibilityAttribute,
                           blindOrLightOrCam
                       }) => {
    const wrapperClass = `fab-wrapper Hotspot`;
    const labelClass = blindOrLightOrCam === 'blind'
        ? 'fab-blind'
        : blindOrLightOrCam === 'light'
            ? 'fab-light'
            : 'fab-cam';
    const checkboxRef = useRef(null); // reference to the checkbox
    const videoRef = useRef(null); // reference to the video element
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const focusOnHotspot = (button) => {
        const position = button.getAttribute('data-position');
        const modelViewer = document.getElementById('model');

        modelViewer.setAttribute('camera-target', position);
        modelViewer.setAttribute('camera-orbit', '30deg 60deg 10m');
    };

    useEffect(() => {
        const handleDocumentClick = () => {
            if (checkboxRef.current) {
                checkboxRef.current.checked = false;
            }
        };

        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
        const checkboxes = document.querySelectorAll('.fab-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        checkboxRef.current.checked = true;
        focusOnHotspot(e.currentTarget.parentElement);
    };

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setIsVideoPlaying(true);
        } catch (error) {
            console.error("Error accessing the camera:", error);
        }
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsVideoPlaying(false);
    };

    return (
        <div
            className={wrapperClass}
            slot={slot}
            data-position={position}
            data-normal={normal}
            data-visibility-attribute={visibilityAttribute}
        >
            <input
                ref={checkboxRef}
                id={slot}
                type="checkbox"
                className="fab-checkbox"
                onClick={handleCheckboxClick}
            />
            <label className={labelClass} htmlFor={slot}></label>
            <div className="fab-wheel">
                {blindOrLightOrCam === 'blind' && (
                    <>
                        <a className="fab-action fab-action-4">
                            <i className="fas fa-question"></i>
                        </a>
                        <a className="fab-action fab-action-5">
                            <i className="fas fa-address-book"></i>
                        </a>
                    </>
                )}
                {blindOrLightOrCam === 'light' && (
                    <>
                        <a className="fab-action fab-action-1">
                            <i className="fas fa-question"></i>
                        </a>
                        <a className="fab-action fab-action-2">
                            <i className="fas fa-book"></i>
                        </a>
                        <a className="fab-action fab-action-3">
                            <i className="fas fa-address-book"></i>
                        </a>
                    </>
                )}
                {blindOrLightOrCam === 'cam' && (
                    <>

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
    visibilityAttribute: PropTypes.string.isRequired,
    blindOrLightOrCam: PropTypes.oneOf(['blind', 'light', 'cam']).isRequired
};

export default HotspotButton;






// import React, { useRef, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import "../styles/Buttons_style.css"
//
// const HotspotButton = ({
//                            slot,
//                            position,
//                            normal,
//                            visibilityAttribute,
//                            blindOrLightOrCam
//                        }) => {
//     const wrapperClass = `fab-wrapper Hotspot`;
//     const labelClass = blindOrLightOrCam === 'blind'
//         ? 'fab-blind'
//         : blindOrLightOrCam === 'light'
//             ? 'fab-light'
//             : 'fab-cam';    const checkboxRef = useRef(null); // reference to the checkbox
//
//     const focusOnHotspot = (button) => {
//         const position = button.getAttribute('data-position');
//         const modelViewer = document.getElementById('model');
//
//         modelViewer.setAttribute('camera-target', position);
//         modelViewer.setAttribute('camera-orbit', '30deg 60deg 10m');
//     };
//
//     useEffect(() => {
//         const handleDocumentClick = () => {
//             if (checkboxRef.current) {
//                 checkboxRef.current.checked = false;
//             }
//         };
//
//         document.addEventListener('click', handleDocumentClick);
//
//         return () => {
//             document.removeEventListener('click', handleDocumentClick);
//         };
//     }, []);
//
//     const handleCheckboxClick = (e) => {
//         e.stopPropagation();
//         const checkboxes = document.querySelectorAll('.fab-checkbox');
//         checkboxes.forEach(checkbox => {
//             checkbox.checked = false;
//         });
//         checkboxRef.current.checked = true;
//         focusOnHotspot(e.currentTarget.parentElement);
//     };
//
//     return (
//         <div
//             className={wrapperClass}
//             slot={slot}
//             data-position={position}
//             data-normal={normal}
//             data-visibility-attribute={visibilityAttribute}
//         >
//             <input
//                 ref={checkboxRef}
//                 id={slot}
//                 type="checkbox"
//                 className="fab-checkbox"
//                 onClick={handleCheckboxClick}
//             />
//             <label className={labelClass} htmlFor={slot}></label>
//             <div className="fab-wheel">
//                 {blindOrLightOrCam === 'blind' && (
//                     <>
//                         <a className="fab-action fab-action-4">
//                             <i className="fas fa-question"></i>
//                         </a>
//                         <a className="fab-action fab-action-5">
//                             <i className="fas fa-address-book"></i>
//                         </a>
//                     </>
//                 )}
//                 {blindOrLightOrCam === 'light' && (
//                     <>
//                         <a className="fab-action fab-action-1">
//                             <i className="fas fa-question"></i>
//                         </a>
//                         <a className="fab-action fab-action-2">
//                             <i className="fas fa-book"></i>
//                         </a>
//                         <a className="fab-action fab-action-3">
//                             <i className="fas fa-address-book"></i>
//                         </a>
//                     </>
//                 )}
//                 {blindOrLightOrCam === 'cam' && (
//                     <>
//
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// HotspotButton.propTypes = {
//     slot: PropTypes.string.isRequired,
//     position: PropTypes.string.isRequired,
//     normal: PropTypes.string.isRequired,
//     visibilityAttribute: PropTypes.string.isRequired,
//     blindOrLightOrCam: PropTypes.oneOf(['blind', 'light', 'cam']).isRequired
// };
//
// export default HotspotButton;






