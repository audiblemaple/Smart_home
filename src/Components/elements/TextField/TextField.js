import React, { useState} from 'react';
import PropTypes from 'prop-types';
import "./TextField_style.css"
const TextField = ({ placeholder, type, setText }) => {

    const [inputText, setInputText] = useState("");

    return (
        <input
            className="input-container"
            type={type ? type : "text"}
            placeholder={placeholder}
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