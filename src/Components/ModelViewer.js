import HotspotButton from "./HotspotButton";
import React from "react";

function ModelViewer({ startVideo, stopVideo }) {
    return (
        <model-viewer
            id="model"
            src="fixed_12.glb"
            camera-controls=""
            exposure="0.4"
            environment-image="industrial_sunset_puresky_2k.hdr"
            skybox-image="industrial_sunset_puresky_2k.hdr"
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

            <HotspotButton
                slot="hotspot-1"
                position="-4.8m 1.1m 3.8m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
                startVideo={startVideo}
                stopVideo={stopVideo}
            />
            <HotspotButton
                slot="hotspot-2"
                position="-4.4m 0.2m -3.3m"
                normal="0m 0m 1m"
                visibilityAttribute="visible"
                blindOrLightOrCam="blind"
            />
            <HotspotButton
                slot="hotspot-3"
                position="3m 0.2m -3.3m"
                normal="0m 0m 1m"
                visibilityAttribute="visible"
                blindOrLightOrCam="blind"
            />
            <HotspotButton
                slot="hotspot-4"
                position="-6.5m 0.2m 3.6m"
                normal="1m 0m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="blind"
            />
            <HotspotButton
                slot="hotspot-5"
                position="-4.2m 1.1m -1.1m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
            />
            <HotspotButton
                slot="hotspot-6"
                position="-3m 1.1m 3.2m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
            />
            <HotspotButton
                slot="hotspot-7"
                position="-0.5m 1.1m 3.2m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
            />
            <HotspotButton
                slot="hotspot-8"
                position="-0.5m 1.1m -1.1m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
            />
            <HotspotButton
                slot="hotspot-9"
                position="-5.6m 1.1m 1.5m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
            />
            <HotspotButton
                slot="hotspot-10"
                position="5.6m 1.1m -1.7m"
                normal="0m 0m 1m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
            />
            <HotspotButton
                slot="hotspot-11"
                position="2.8m 1.1m -1.1m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
            />
            <HotspotButton
                slot="hotspot-12"
                position="5.5m 1.1m 0.9m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
            />
            <HotspotButton
                slot="hotspot-13"
                position="5.6m 1.1m 2.8m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
            />
            <HotspotButton
                slot="hotspot-14"
                position="1m 1.1m 1.2m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
            />
            <HotspotButton
                slot="hotspot-15"
                position="-0.5m 0.2m -3.3m"
                normal="0m 0m 1m"
                visibilityAttribute="visible"
                blindOrLightOrCam="blind"
            />
            <HotspotButton
                slot="hotspot-16"
                position="-4.2m 1.1m -4.4m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="light"
            />
            <HotspotButton
                slot="hotspot-17"
                position="-3m 1.1m 5m"
                normal="0m 1m 0m"
                visibilityAttribute="visible"
                blindOrLightOrCam="cam"
            />

        </model-viewer>
    );
}

export default ModelViewer;
