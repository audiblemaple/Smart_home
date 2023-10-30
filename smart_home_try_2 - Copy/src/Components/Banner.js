import React from 'react';
import PropTypes from 'prop-types';
import '../styles/banner_style.css';

const Banner = ({ text }) => {
    return (
        <div className="banner">
            {text}
        </div>
    );
};

Banner.propTypes = {
    text: PropTypes.string.isRequired
};

export default Banner;
