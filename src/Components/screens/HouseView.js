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

    const [buttonFilter, setButtonFilter] = useState(0);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const showError = (error) => {
        console.log(error)
        setErrorMessage(error);
        setTimeout(() => {
            setErrorMessage("");
        }, ((Number(process.env.REACT_APP_ERROR_DISPLAY_DURATION) || 2) * 1000) + 500); // regular error time + 0.5 seconds for the message to reset.
    }

    return (
        <div className="container">
            <div className="box">
                <ModelViewer tempButton={tempButton} setTempButton={setTempButton} setErrorMessage={setErrorMessage} errorMessage={errorMessage} buttonFilter={buttonFilter}/>
            </div>
            <Banner text="Smart home" />
            <Toolbar openModal={openModal} closeModal={closeModal} setChildren={setChildren} setTempButton={setTempButton} showError={showError} setButtonFilter={setButtonFilter}/>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal} children={children}>
                </Modal>
            )}
            {errorMessage &&  <ErrorPopup message={errorMessage} />}
        </div>
    );
}

export default HouseView;
