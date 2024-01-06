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
            }, 3000);
        }
    }, [message]);

    return (
        <div className={`popup ${showPopup ? 'show' : 'hide'}`}>
            {message}
        </div>
    );
}

export default ErrorPopup;