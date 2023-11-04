import React from 'react';
import ModelViewer from '../elements/ModelViewer';
import Banner from '../elements/Banner';
import PerspectiveButton from '../elements/PerspectiveButton';

const HouseView = () => {
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

export default HouseView;
