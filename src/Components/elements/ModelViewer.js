import HotspotButton from "./HotspotButton/HotspotButton";
import React, {useEffect, useState} from "react";
import ErrorPopup from "./Popup/ErrorPopup";

function ModelViewer( {tempButton, setTempButton, setErrorMessage, errorMessage}) {
    const [hotspotConfig, setHotspotConfig] = useState({});


    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_API_URL}/config`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // console.log('Fetched hotspot config:', data); // Log the fetched data
                setHotspotConfig(data);
            })
            .catch(error => console.error('Error fetching config:', error));
    }, []);

    return (
        <model-viewer
            id="model"
            src="Home_model.glb"
            camera-controls=""
            exposure="0.65"
            environment-image="Background_skybox.hdr"
            skybox-image="Background_skybox.hdr"
            shadow-intensity="2"
            shadow-softness="1"
            disable-tap=""
            interaction-prompt="none"
            camera-orbit="30deg 60deg 35m"
            max-camera-orbit="40deg 85deg 35m"
            max-field-of-view="30deg"
            min-camera-orbit="-40deg 0deg 10m"
            min-field-of-view="30deg"
        >
            {Object.entries(hotspotConfig).map(([id, hotspot]) => (
                <HotspotButton
                    key               = {id}
                    slot              = {id}
                    position          = {hotspot['data-position']}
                    normal            = {hotspot['data-normal']}
                    blindOrLightOrCam = {hotspot.type}
                    initialIsOn       = {hotspot.isOn}
                    nodeID            = {hotspot.nodeID}
                    setErrorMessage   = {setErrorMessage}
                />
            ))}
            {tempButton}
        </model-viewer>
    );
}

export default ModelViewer;
