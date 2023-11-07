import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/camera_style.css"
function WebPageEmbed({ src, width, height }) {
    const navigate = useNavigate();
    const handleReturnHome = () => {
        navigate('/');
    };
    return (
        <>
            <button className="return-home-button" onClick={handleReturnHome} />
            <iframe src={src} width={width} height={height} title="WebPageEmbed"/>
        </>
    );
}

export default WebPageEmbed;
