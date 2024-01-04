import React, { useState, useEffect } from 'react';
import '../Popup/popup_style.css';


// TODO: make it animated
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
        <div className={`popup ${showPopup ? 'show' : ''}`}>
            {message}
        </div>
    );
}

export default ErrorPopup;






// import React, { useState, useEffect } from 'react';
// import '../Popup/popup_style.css';
//
//
// // TODO: fix the error where it only displays once...
// function ErrorPopup({ message }) {
//     const [showPopup, setShowPopup] = useState(false);
//
//     useEffect(() => {
//         if (message) {
//             setShowPopup(true);
//             setTimeout(() => {
//                 console.log(showPopup);
//                 setShowPopup(false);
//             }, 3000);
//         }
//     }, [message]);
//
//     return (
//         <div className={`popup ${showPopup ? 'show' : ''}`}>
//             {message}
//         </div>
//     );
// }
//
// export default ErrorPopup;