import React, {useState} from 'react';
import ModelViewer from '../elements/ModelViewer';
import Banner from '../elements/banner/Banner';
import Toolbar from '../elements/toolbar/Toolbar';
import Modal from "../elements/Modal/Modal";

const HouseView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [children, setChildren] = useState(false);
    const [tempButton, setTempButton] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="container">
            <div className="box">
                <ModelViewer tempButton={tempButton} setTempButton={setTempButton}/>
            </div>
            <Banner text="Smart home" />
            <Toolbar openModal={openModal} closeModal={closeModal} setChildren={setChildren} setTempButton={setTempButton}/>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    {children}
                </Modal>
            )}

        </div>
    );
}

export default HouseView;
