import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import { useTranslation } from 'react-i18next'; // For translations

const FaceScanner = () => {
  const videoRef = useRef(null);
  const { t, i18n } = useTranslation(); // Initialize translation and current language
  const [glowColor, setGlowColor] = useState('0px 0px 20px 10px rgba(0, 255, 0, 0.6)'); // Default to green glow
  const [errorText, setErrorText] = useState(t('defaultErrorText')); // Default error text
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

  // Function to handle speech synthesis for messages
  const speak = (message) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = i18n.language; // Use the current language from i18n
      utterance.pitch = 1;
      utterance.rate = 1;
      synth.speak(utterance);
    }
  };

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
          setErrorText(t('centerYourFace'));
          speak(t('centerYourFace'));
          break;
        case '4':
          setErrorText(t('removeYourGlasses'));
          speak(t('removeYourGlasses'));
          break;
        case '5':
          setErrorText(t('removeYourCap'));
          speak(t('removeYourCap'));
          break;
        case '6':
          setErrorText(t('success'));
          speak(t('success'));
          setTimeout(() => {
            navigate('/done'); // Redirect to success page after 1 second
          }, 1000);
          break;
        case '7':
          setErrorText(t('failed'));
          speak(t('failed'));
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
  }, [navigate, t, i18n.language]); // Added t and i18n.language to dependencies

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
