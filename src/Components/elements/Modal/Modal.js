import React, {useContext} from 'react';
import './modal_style.css';
import {ModalContext} from "../../../Contexts/ModalContext"; // Import the CSS file

function Modal({ children }) {
    const { isModalOpen, closeModal, isFullScreen } = useContext(ModalContext);

    return (
        <>
            {isModalOpen && (
                <div className={`modal-overlay ${isFullScreen ? "fullscreen" : ""}`}>
                    {children}
                </div>
            )}
        </>

    );
}

export default Modal;