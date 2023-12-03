import HotspotButton from "./HotspotButton/HotspotButton";
import React, {useEffect, useState} from "react";

function ModelViewer() {
    const [hotspotConfig, setHotspotConfig] = useState({});


    useEffect(() => {
        fetch('http://localhost:3001/api/config')
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
            exposure="0.6"
            environment-image="Background_skybox.hdr"
            skybox-image="Background_skybox.hdr"
            shadow-intensity="2"
            shadow-softness="1"
            disable-tap=""
            interaction-prompt="none"
            camera-orbit="30deg 60deg 30m"
            max-camera-orbit="40deg 45deg 40m"
            max-field-of-view="30deg"
            min-camera-orbit="0deg 0deg 10m"
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
                />
            ))}
        </model-viewer>
    );
}

export default ModelViewer;
