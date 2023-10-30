import React from 'react';
import PropTypes from 'prop-types';

const HotspotButton = ({
                           slot,
                           position,
                           normal,
                           visibilityAttribute,
                           blindOrLight
                       }) => {
    const wrapperClass = `fab-wrapper ${blindOrLight === 'blind' ? 'HotspotCurtain' : 'HotspotLight'} Hotspot`;

    const focusOnHotspot = (element) => {
        // Implement the focusOnHotspot logic here
    };

    return (
        <div
            className={wrapperClass}
            slot={slot}
            onClick={() => focusOnHotspot(this)}
            data-position={position}
            data-normal={normal}
            data-visibility-attribute={visibilityAttribute}
        >
            <input id={slot} type="checkbox" className="fab-checkbox" />
            <label className="fab-blind" htmlFor={slot}></label>
            <div className="fab-wheel">
                <a className="fab-action fab-action-4">
                    <i className="fas fa-question"></i>
                </a>
                <a className="fab-action fab-action-5">
                    <i className="fas fa-address-book"></i>
                </a>
            </div>
        </div>
    );
};

HotspotButton.propTypes = {
    slot: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    normal: PropTypes.string.isRequired,
    visibilityAttribute: PropTypes.string.isRequired,
    blindOrLight: PropTypes.oneOf(['blind', 'light']).isRequired
};

export default HotspotButton;
