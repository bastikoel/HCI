import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import passportGif from './assets/passport-insert.gif'; // Adjust the path if needed

function WelcomePage() {
  const { t, i18n } = useTranslation();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to show the overlay and announce "An officer is coming to help you"
  const handleCallForAssistance = () => {
    setOverlayVisible(true);

    // Use speech synthesis to announce the message
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const assistanceMessage = t('officerComingToHelp'); // Use translation
      const utterance = new SpeechSynthesisUtterance(assistanceMessage);
      utterance.lang = i18n.language; // Use current language set in i18n
      utterance.pitch = 1;
      utterance.rate = 1;
      synth.speak(utterance);
    }
  };

  // Keydown event for '1' key (navigates to another page) and '2' (closes the overlay)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '1') {
        navigate('/PassportScanning'); // Redirect to /PassportScanning when '1' is pressed
      } else if (event.key === '2' && overlayVisible) {
        setOverlayVisible(false); // Close the overlay when '2' is pressed
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, overlayVisible]);

  // Text-to-speech effect for the welcome message
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
    <div className="relative text-center bg-blue-100 h-screen">
      <h1 className="text-4xl font-bold text-blue-900 mt-8">{t('welcome')}</h1>
      <p className="text-lg text-blue-700 mt-2">{t('checkIn')}</p>
      
      <div className="flex justify-center mt-8">
        <img 
          src={passportGif} 
          alt="Insert Passport" 
          className="w-3/4 h-auto" 
        />
      </div>

      {/* Call for Assistance Button */}
      <button
        onClick={handleCallForAssistance}
        className="fixed bottom-8 right-8 w-40 h-40 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      >
        {t('callForAssistance')}
      </button>

      {/* Overlay for "Officer coming over to help" */}
      {overlayVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-blue-600">
              {t('officerComingToHelp')}
            </h2>
            <p className="mt-4 text-lg">
              {t('pressToClose')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WelcomePage;
