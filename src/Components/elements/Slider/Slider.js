import React, { useState } from 'react';
import "./slider_style.css";

const Slider = ({ onChange }) => {
    const multiplier = 60; // Multiplier to convert float to int and vice versa
    const [value, setValue] = useState(0);
    const [maxVal, setmaxVal] = useState(50 * multiplier); // Adjusted for float values
    const [minVal, setminVal] = useState(-50 * multiplier); // Adjusted for float values

    const handleSliderChange = (e) => {
        const newValue = e.target.value / multiplier; // Convert back to float
        setValue(newValue);
        if (onChange) {
            onChange(newValue); // Call the passed onChange function with float value
        }
    };

    return (
        <div className="slider-container">
            <input
                type="range"
                id="Slider-body"
                min={minVal}
                max={maxVal}
                value={value * multiplier} // Adjusted for float values
                onChange={handleSliderChange}
            />
        </div>
    );
};

export default Slider;
