import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import "./Dropdown_style.css"
const Dropdown = ({ initialText, list, setSelectedElement}) => {

    const [selectedValue, setSelectedValue] = useState("choose an option");

    const [listState, setListState] = useState("hidden");
    const [changeFlag, setChangeFlag] = useState(true);

    useEffect(() => {
        // Function to be called on click
        const closeList = () => {
            setListState("hidden");
        };

        // Attach the event listener
        document.addEventListener('click', closeList);

        // Clean up the event listener
        return () => {
            document.removeEventListener('click', closeList);
        };
    }, []);

    useEffect(() => {
        setChangeFlag(false);
    }, [selectedValue]);


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
        // closeList handles the list closing when an element is clicked
    };

    const createList = () => {
        return list.map((element, index) => (
            <div key={index} className="list-item" onClick={selectElement}>{element}</div>
        ));
    };

    return (
        <div className="dropdown-container" onClick={toggleList}>
            <div className="main-box">
                {changeFlag ? initialText : selectedValue }
            </div>
            <div className={`list-box ${listState}`} onClick={toggleList} >
                {createList()}
            </div>
        </div>
    );
};

Dropdown.propTypes = {
    initialText: PropTypes.string,
    list: PropTypes.array,
    setSelectedElement:PropTypes.func
};

export default Dropdown;