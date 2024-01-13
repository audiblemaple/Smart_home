import React, { useState } from 'react';
import "./DraggableRectangle_style.css"
const DraggableRectangle = ({Point, setPoint}) => {
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const multiplier = 0.2; // Adjust this value as needed


    const [isTouched, setIsTouched] = useState(false);

    const constrainValue = (value, min, max) => {
        return Math.max(min, Math.min(max, value));
    };

    const handleStart = (event) => {
        setIsTouched(true);
        const point = event.touches ? event.touches[0] : event;
        setStartPoint({ x: point.clientX, y: point.clientY });
    };

    const handleMove = (event) => {
        if (!isTouched) return;
        const point = event.touches ? event.touches[0] : event;
        let offsetX = (point.clientX - startPoint.x) * multiplier;
        let offsetY = (point.clientY - startPoint.y) * multiplier;

        // Constrain values
        offsetX = constrainValue(offsetX, -35, 35);
        offsetY = constrainValue(offsetY, -35, 35);

        setPoint({ x: offsetX, y: offsetY });
    };

    const handleEnd = () => {
        setIsTouched(false);
    };

    return (
        <div
            className   ="draggable-rect"
            onMouseDown ={handleStart}
            onTouchStart={handleStart}
            onMouseMove ={handleMove}
            onTouchMove ={handleMove}
            onMouseUp   ={handleEnd}
            onTouchEnd  ={handleEnd}
            onMouseLeave={handleEnd}
        >
        <div className={`prompt ${isTouched ? "hidden" : ""}`}></div>
        </div>
    );
};

export default DraggableRectangle;