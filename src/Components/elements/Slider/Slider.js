import React, { useState } from 'react';
import "./slider_style.css";

const Slider = ({ onChange }) => {
    const multiplier = 1500; // Multiplier to make the controls easier by converting the location values to float numbers
    const [value, setValue] = useState(0);
    const [maxVal, setmaxVal] = useState(9 * multiplier);
    const [minVal, setminVal] = useState(-9 * multiplier);

    const handleSliderChange = (e) => {
        const newValue = e.target.value / multiplier; // Convert to float
        setValue(newValue);
        if (onChange)
            onChange(newValue);
    };

    return (
        <div className="slider-container">
            <input
                type="range"
                id="Slider-body"
                min={minVal}
                max={maxVal}
                value={value * multiplier}
                onChange={handleSliderChange}
            />
        </div>
    );
};

export default Slider;
