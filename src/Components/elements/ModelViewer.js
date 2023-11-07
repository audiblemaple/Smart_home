import HotspotButton from "./HotspotButton";
import React from "react";
import hotspotConfig from "../../configs/hotspotConfig.json";

function ModelViewer() {
    return (
        <model-viewer
            id="model"
            src="Home_model.glb"
            camera-controls=""
            exposure="0.4"
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
                    key={id}
                    slot={id}
                    position={hotspot['data-position']}
                    normal={hotspot['data-normal']}
                    blindOrLightOrCam={hotspot.type}
                />
            ))}
        </model-viewer>
    );
}

export default ModelViewer;
