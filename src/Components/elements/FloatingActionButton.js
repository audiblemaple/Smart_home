import React from 'react';
import PropTypes from 'prop-types';

const FloatingActionButton = ({ actionType, slot, className }) => {
    const sendControlRequest = async (action, slot) => {
        try {
            const response = await fetch('http://localhost:3001/api/blinds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action, slot }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // You can process the response if needed
            const data = await response.json();
            console.log('Server response:', data);
        } catch (error) {
            console.error('Error sending control request:', error);
        }
    };

    const handleMouseDown = () => {
        if (actionType === 'open' || actionType === 'close') {
            sendControlRequest(actionType, slot);
        }
    };

    const handleMouseUp = () => {
        if (actionType === 'open' || actionType === 'close') {
            sendControlRequest('stop', slot);
        }
    };

    return (
        <a
            className={`fab-action ${className}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown} // For touch devices
            onTouchEnd={handleMouseUp}
        >
            <i className="fas"></i>
        </a>
    );
};

FloatingActionButton.propTypes = {
    actionType: PropTypes.oneOf(['open', 'close']).isRequired,
    slot: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default FloatingActionButton;


