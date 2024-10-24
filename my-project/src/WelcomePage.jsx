import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import passportGif from './assets/passport-insert.gif';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

function WelcomePage() {
  const { t, i18n } = useTranslation();
  const videoRef = useRef(null);
  const [specificDeviceID, setSpecificDeviceID] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate


  // Use getUserMedia to start the camera and show on videoRef
  const startCameraStream = () => {
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: specificDeviceID ? { exact: specificDeviceID } : undefined,
        facingMode: "environment", 
        width: { min: 640 },
        height: { min: 480 }
      }
    })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(err => {
        console.error("Failed to access the camera:", err);
      });
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      devices.forEach(device => {
        if (device.kind === 'videoinput') {
          console.log(`${device.label}: ${device.deviceId}`);
          if (device.label.toLowerCase().includes("obs")) {
            setSpecificDeviceID(device.deviceId);
            console.log(`Using OBS Device: ${device.deviceId}`);
          }
        }
      });
    });
  }, []);

   // Add a keydown event listener for pressing the "1" key
   useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '1') {
        console.log("press key 1 ")
        navigate('/PassportScanning'); // Redirect to /PassportScanning when '1' is pressed
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const welcomeMessage = t('welcome');
      const utterance = new SpeechSynthesisUtterance(`${welcomeMessage}`);
      utterance.lang = i18n.language;
      utterance.pitch = 1;
      utterance.rate = 1;
      synth.speak(utterance);
    }
  }, [t, i18n.language]);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-blue-900 mt-4">{t('welcome')}</h1>
      <p className="text-lg text-blue-700 mt-2">{t('checkIn')}</p>
      
      <div className="flex justify-center mt-8">
        <img 
          src={passportGif} 
          alt="Insert Passport" 
          className="w-3/4 h-auto" 
        />
      </div>

      {/* Larger Circular Button at Bottom Right */}
      <button
        className="fixed bottom-8 right-8 w-40 h-40 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      >
        {t('callForAssistance')}
      </button>
    </div>
  );
}

export default WelcomePage;
