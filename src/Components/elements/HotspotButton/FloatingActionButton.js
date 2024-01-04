import React, {useState} from 'react';
import PropTypes from 'prop-types';

const FloatingActionButton = ({ actionType, className, sendCommand}) => {
    const [isClickable, setIsClickable] = useState(true);  // State to manage click timeout

    const handleMouseDown = () => {
        if ( !isClickable )
            return;
        if (actionType === 'blind_up' || actionType === 'blind_down')
            sendCommand(actionType);
    };

    const handleMouseUp = () => {
        console.log("mouse up")
        setIsClickable(false);
        if ( !isClickable )
            return

        if (actionType === 'blind_up' || actionType === 'blind_down') {
            sendCommand("blind_stop");
            setTimeout(() => {
                setIsClickable(true);
                console.log("reset")
            }, 300);
        }
    };

    return (
        <button
            className={`fab-action ${className}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
        >
            <i className="fas"></i>
        </button>
    );
};

FloatingActionButton.propTypes = {
    actionType: PropTypes.oneOf(['blind_up', 'blind_down']).isRequired,
    className: PropTypes.string,
    sendCommand:PropTypes.func
};

export default FloatingActionButton;