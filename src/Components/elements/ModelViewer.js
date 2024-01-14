import HotspotButton from "./HotspotButton/HotspotButton";
import React, {useEffect, useState} from "react";
function ModelViewer( {tempButton}) {
    const [hotspotConfig, setHotspotConfig] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_API_URL}/config`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setHotspotConfig(data))
            .catch(error => console.error('Error fetching config:', error));
    }, []);

    return (
        <model-viewer
            id="model"
            src={`${process.env.REACT_APP_SERVER_PUBLIC_URL}/models/Home_model.glb`}
            camera-controls=""
            exposure="0.65"
            environment-image={`${process.env.REACT_APP_SERVER_PUBLIC_URL}/skyBoxes/Background_skybox.hdr`}
            skybox-image={`${process.env.REACT_APP_SERVER_PUBLIC_URL}/skyBoxes/Background_skybox.hdr`}
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
                    key         = {id}
                    slot        = {id}
                    position    = {hotspot['data-position']}
                    normal      = {hotspot['data-normal']}
                    buttonType  = {hotspot.type}
                    initialIsOn = {hotspot.isOn}
                    nodeID      = {hotspot.nodeID}
                />
            ))}
            {tempButton}
        </model-viewer>
    );
}

export default ModelViewer;
