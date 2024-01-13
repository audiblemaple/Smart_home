import React, {useContext} from 'react';
import {WebSocketContext} from "../../../Contexts/WebSocketContext"; // Import the CSS file

function MeshControlPanel() {
    const { sendJsonMessage } = useContext(WebSocketContext);

    return (
        <>
            not implemented
        </>

    );
}

export default MeshControlPanel;