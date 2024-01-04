import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import "./TextField_style.css"
const TextField = ({ setText }) => {

    const [inputText, setInputText] = useState("");

    // useEffect(() => {
    //     console.log(inputText);
    // }, [inputText]);
    const handleNameChange = (event) => {
        setInputText(event.target.value);
        setText(event.target.value);
    }

    return (
        <input className="input-container"
               type="text"
               placeholder="Choose a name"
               value={inputText}
               onChange={handleNameChange}>
        </input>
    );
};

TextField.propTypes = {
    setText:PropTypes.func
};

export default TextField;