import React from 'react';
import './modal_style.css'; // Import the CSS file

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            {children}
        </div>
    );
}

export default Modal;