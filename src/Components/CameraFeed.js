import React from 'react';
import '../styles/camera_style.css'
import {useNavigate} from "react-router-dom";


function CameraFeed(props) {
    const navigate = useNavigate();

    return (
        <div>
            <img className="camera-feed" src={`http://${props.ip}:5000/video_feed`} alt="Video Feed" />
            <div className="exit-button" onClick={() => navigate('/')}></div>

        </div>
    );
}

export default CameraFeed;
















// import React, { useRef, useEffect } from 'react';
// import '../styles/camera_style.css'
// import {useNavigate} from "react-router-dom";
//
// const CameraFeed = () => {
//     const videoRef = useRef(null);
//     const navigate = useNavigate();
//
//
//     useEffect(() => {
//         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//             navigator.mediaDevices.getUserMedia({
//                 video: {
//                     width: 1920,
//                     height: 1080,
//                     frameRate: 60
//                 }
//             })
//                 .then(stream => {
//                     videoRef.current.srcObject = stream;
//                 })
//                 .catch(error => {
//                     console.error("Error accessing the camera:", error);
//                 });
//         } else {
//             console.error("This browser does not support navigator.mediaDevices.getUserMedia");
//         }
//
//         return () => {
//             if (videoRef.current && videoRef.current.srcObject) {
//                 videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);
//
//     return (
//         <div className="camera-feed">
//             <video ref={videoRef} autoPlay playsInline />
//             <div className="exit-button" onClick={() => navigate('/')}></div>
//         </div>
//     );
// }
//
// export default CameraFeed;
