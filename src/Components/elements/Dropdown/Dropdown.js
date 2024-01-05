import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import "./Dropdown_style.css"
const Dropdown = ({initialText, list, setSelectedElement}) => {

    const [selectedValue, setSelectedValue] = useState(initialText);
    const [listState, setListState] = useState("hidden");

    useEffect(() => {
        const closeList = () => {
            setListState("hidden");
        };

        document.addEventListener('click', closeList);

        return () => {
            document.removeEventListener('click', closeList);
        };
    }, []);

    const toggleList = () => {
        if (listState === "show"){
            setListState("hidden");
            return;
        }
        setListState("show");
    };

    const selectElement = (event) => {
        setSelectedValue(event.target.innerText);
        setSelectedElement(event.target.innerText);
        // closeList will handle the list closing when an element is chosen
    };

    const createList = () => {
        return list.map((element, index) => (
            <div key={index} className="list-item" onClick={selectElement}>{element}</div>
        ));
    };

    return (
        <div className="dropdown-container" onClick={toggleList}>
            <div className="main-box">
                { selectedValue }
            </div>

            {list.length > 0 && (
                <div className={`list-box ${listState}`} onClick={toggleList}>
                    {createList()}
                </div>
            )}
        </div>
    );
};

Dropdown.propTypes = {
    initialText: PropTypes.string,
    list: PropTypes.array,
    setSelectedElement:PropTypes.func
};

export default Dropdown;