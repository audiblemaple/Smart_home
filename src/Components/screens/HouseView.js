import React, {useState} from 'react';
import ModelViewer from '../elements/ModelViewer';
import Banner from '../elements/banner/Banner';
import Toolbar from '../elements/toolbar/Toolbar';
import Modal from "../elements/Modal/Modal";
import ErrorPopup from "../elements/Popup/ErrorPopup";

const HouseView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [children, setChildren] = useState(false);
    const [tempButton, setTempButton] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const showError = (error) => {
        console.log(error)
        setErrorMessage(error);
        setTimeout(() => {
            setErrorMessage("");
        }, 3500);
    }

    return (
        <div className="container">
            <div className="box">
                <ModelViewer tempButton={tempButton} setTempButton={setTempButton} setErrorMessage={setErrorMessage} errorMessage={errorMessage}/>
            </div>
            <Banner text="Smart home" />
            <Toolbar openModal={openModal} closeModal={closeModal} setChildren={setChildren} setTempButton={setTempButton} showError={showError}/>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal} children={children}>
                </Modal>
            )}
            {errorMessage &&  <ErrorPopup message={errorMessage} />}
        </div>
    );
}

export default HouseView;
