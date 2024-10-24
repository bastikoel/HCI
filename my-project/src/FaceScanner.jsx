import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection

const FaceScanner = () => {
  const videoRef = useRef(null);
  const [glowColor, setGlowColor] = useState('0px 0px 20px 10px rgba(0, 255, 0, 0.6)'); // Default to green glow
  const [errorText, setErrorText] = useState('This is error text');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Start video stream with error handling
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }, // Front-facing camera
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();
  }, []);

  // Handle key presses for different actions
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case '1':
          setGlowColor('0px 0px 20px 10px rgba(0, 255, 0, 0.6)'); // Green glow
          break;
        case '2':
          setGlowColor('0px 0px 20px 10px rgba(255, 0, 0, 0.6)'); // Red glow
          break;
        case '3':
          setErrorText('Center your face');
          break;
        case '4':
          setErrorText('Remove your glasses');
          break;
        case '5':
          setErrorText('Remove your cap');
          break;
        case '6':
          setErrorText('Success');
          setTimeout(() => {
            navigate('/done'); // Redirect to success page after 1 second
          }, 1000);
          break;
        case '7':
          setErrorText('Failed');
          setTimeout(() => {
            navigate('/fingerScanner'); // Redirect to failed page after 1 second
          }, 1000);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">

      {/* Video feed with dynamic glow */}
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        className="border border-blue-500 mt-4 shadow-lg"
        style={{
          boxShadow: glowColor, // Dynamic glow color based on key press
        }}
      />

      {/* Dynamic Error text */}
      <p className="mt-4 text-red-500 font-bold">{errorText}</p>
    </div>
  );
};

export default FaceScanner;
