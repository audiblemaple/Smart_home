import React, { useState} from 'react';
import PropTypes from 'prop-types';
import "./TextField_style.css"
const TextField = ({ setText }) => {

    const [inputText, setInputText] = useState("");

    return (
        <input
            className="input-container"
            type="text"
            placeholder="Choose a name"
            value={inputText}
            onChange={(event) => {
                setInputText(event.target.value);
                setText(event.target.value);
            }}
        >
        </input>
    );
};

TextField.propTypes = {
    setText:PropTypes.func
};

export default TextField;