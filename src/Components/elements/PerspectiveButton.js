import React from 'react';
import "../../styles/default_view_button.css"

class PerspectiveButton extends React.Component {
    defaultView = () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0m 0m 0m");
        modelViewer.setAttribute('camera-orbit', '0deg 0deg 28m');
    }

    render() {
        return (
            <button
                id="holdButton"
                className="perspective-button"
                onClick={this.defaultView}>
            </button>
        );
    }
}

export default PerspectiveButton;
