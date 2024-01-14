import React, { useState } from 'react';
import './FileUploaderStyle.css'
function FileUpload({handleCloseModal}) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file);

        fetch(`${process.env.REACT_APP_SERVER_API_URL}/uploadFile`, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.text())
            .then(data => {})
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <form className="uploadForm" onSubmit={handleSubmit}>
            <input className="fileUploader" type="file" onChange={handleFileChange}/>
            <div className="buttons-container">
                <button className="uploadButton" type="submit">Upload File</button>
                <button onClick={handleCloseModal}> Cancel</button>
            </div>
        </form>
    );
}

export default FileUpload;