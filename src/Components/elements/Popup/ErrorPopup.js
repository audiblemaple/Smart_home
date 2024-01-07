import React, { useState, useEffect } from 'react';
import '../Popup/popup_style.css';

function ErrorPopup({ message }) {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (message) {
            setShowPopup(true);
            setTimeout(() => {
                console.log(showPopup);
                setShowPopup(false);
            }, (Number(process.env.REACT_APP_ERROR_DISPLAY_DURATION) || 2) * 1000);
        }
    }, [message]);

    return (
        <div className={`popup ${showPopup ? 'show' : 'hide'}`}>
            {message}
        </div>
    );
}

export default ErrorPopup;