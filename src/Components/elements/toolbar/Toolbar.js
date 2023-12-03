import React from 'react';
import "./toolbar_style.css"

// Make it float in from the side...
class Toolbar extends React.Component {
    defaultView = () => {
        const modelViewer = document.getElementById('model');
        modelViewer.setAttribute('camera-target', "0m 0m 0m");
        modelViewer.setAttribute('camera-orbit', '0deg 0deg 28m');
    }


    render() {
        return (
            <div className="toolbar">
                <button
                    id="defaultViewButton"
                    className="toolbar-button"
                    onClick={this.defaultView}>
                </button>
                <button
                    id="devPortalButton"
                    className="toolbar-button"
                    onClick={this.defaultView}>
                </button>
            </div>
        );
    }
}

export default Toolbar;
