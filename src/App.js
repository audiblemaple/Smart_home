import logo from './logo.svg';
import './App.css';
import "./styles/Buttons_style.css"
import HotspotButton from "./Components/Button";

function App() {

    fetch('https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js')
        .then(response => response.text())  // Get the text response first
        .then(text => {
            console.log(text);  // Log the response to see what you're getting
            return JSON.parse(text);
        })
        .catch(error => console.error(error));
  return (
    <model-viewer
        id="model"
        src="poly.glb"
        camera-controls
        shadow-intensity="1"
        exposure="0.29"
        shadow-softness="1"
        interaction-prompt="none"
        camera-orbit="0deg 60deg 30m"
        max-camera-orbit="30deg 60deg 40m"
        max-field-of-view="30deg"
        min-camera-orbit="0deg 0deg 10m"
        min-field-of-view="30deg"
    >

        <HotspotButton
            slot="hotspot-2"
            position="-4.4m -0.24m -4.2m"
            normal="0m 0m 1m"
            visibilityAttribute="visible"
            blindOrLight="blind"
        />
    </model-viewer>

  );
}

export default App;












