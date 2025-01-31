import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import { useTranslation } from 'react-i18next'; // For translations

const FaceScanner = () => {
  const videoRef = useRef(null);
  const { t, i18n } = useTranslation(); // Initialize translation and current language
  const [glowColor, setGlowColor] = useState('0px 0px 20px 10px rgba(0, 255, 0, 0.6)'); // Default to green glow
  const [errorText, setErrorText] = useState(''); // Default error text
  const [instructionText, setInstructionText] = useState(t('positionYourFace')); // Default instruction text
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
          setInstructionText(t('lookLower')); // Change instruction text
          break;
        case '5':
          setInstructionText(t('lookHigher')); // Change instruction text
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

  // Check if the current message is success to apply the green color
  const isSuccessMessage = errorText === t('success');
  const isErrorMessage = errorText !== '' && !isSuccessMessage;

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      {/* Video feed with dynamic glow */}
      <div className="relative">
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
        
        {/* Face overlay/guide */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <div className="w-64 h-80 border-4 border-blue-500 rounded-full opacity-50"></div> 
        </div>
      </div>

      {/* Dynamic Error or Success text */}
      {isErrorMessage && (
        <p className={`mt-4 font-bold text-red-500`}>{errorText}</p>
      )}
      {isSuccessMessage && (
        <p className={`mt-4 font-bold text-green-500`}>{errorText}</p>
      )}

      {/* Instruction text (neutral color like blue) */}
      <p className="mt-4 text-blue-500 font-bold">{instructionText}</p>

      {/* Option to press buttons for more instructions */}
      <div className="mt-4">
        <p className="text-yellow-500">Press '4' to look a bit lower</p>
        <p className="text-yellow-500">Press '5' to look a bit higher</p>
        <p className="text-yellow-500">Press '1' for Success (green glow)</p>
        <p className="text-yellow-500">Press '2' for Failure (red glow)</p>
        <p className="text-yellow-500">Press '6' for Success and Redirect</p>
        <p className="text-yellow-500">Press '7' for Failure and Redirect</p>
      </div>
    </div>
  );
};

export default FaceScanner;
