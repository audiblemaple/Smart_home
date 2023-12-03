import React from 'react';
import ModelViewer from '../elements/ModelViewer';
import Banner from '../elements/banner/Banner';
import Toolbar from '../elements/toolbar/Toolbar';

const HouseView = () => {
    return (
        <div className="container">
            <div className="box">
                <ModelViewer />
            </div>
            <Banner text="Smart home" />
            <Toolbar />
        </div>
    );
}

export default HouseView;
