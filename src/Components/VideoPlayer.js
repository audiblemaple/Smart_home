import React, { useRef, useState, useEffect } from 'react';

function VideoPlayer() {
    const videoRef = useRef(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    useEffect(() => {
        // Function to handle fullscreen changes
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsVideoPlaying(false);
            }
        };

        // Add event listener
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Cleanup on component unmount
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setIsVideoPlaying(true);

            // Request fullscreen
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.mozRequestFullScreen) { /* Firefox */
                videoRef.current.mozRequestFullScreen();
            } else if (videoRef.current.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                videoRef.current.webkitRequestFullscreen();
            } else if (videoRef.current.msRequestFullscreen) { /* IE/Edge */
                videoRef.current.msRequestFullscreen();
            }
        } catch (error) {
            console.error("Error accessing the camera:", error);
        }
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }

        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    };

    return (
        <div>
            <button onClick={startVideo}>Start Video</button>
            {isVideoPlaying && <button onClick={stopVideo}>Stop Video</button>}
            <video
                ref={videoRef}
                style={{
                    display: isVideoPlaying ? 'block' : 'none',
                    width: '100vw',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 9999
                }}
                autoPlay
                playsInline
            ></video>
        </div>
    );
}

export default VideoPlayer;
