import React from 'react';
import ModelViewer from './ModelViewer';
import Banner from './Banner';
import PerspectiveButton from './PerspectiveButton';
import { Link } from 'react-router-dom';


const MyComponent = () => {
    return (
        <div className="container">
            <div className="box">
                <ModelViewer />
            </div>
            <Banner text="Smart home" />
            <PerspectiveButton />
        </div>
    );
}

export default MyComponent;
