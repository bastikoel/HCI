import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import passportGif from './assets/passport-insert.gif'; // Adjust the path if needed
import assistanceIcon from './assets/help-desk.png'; // Import your icon here

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

      // Cancel any ongoing speech
      synth.cancel();
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
      const utterance = new SpeechSynthesisUtterance(welcomeMessage);
      utterance.lang = i18n.language;
      utterance.pitch = 1;
      utterance.rate = 1;

      // Cancel any ongoing speech
      synth.cancel();
      synth.speak(utterance);
    }
  }, [t, i18n.language]);

  return (
    <div className="relative text-center bg-blue-100 h-screen">
      <h1 className="text-4xl font-bold text-red-500 mt-8">{t('checkIn')}</h1>
      <p className="text-lg text-blue-700 mt-2">{t('welcome')}</p>
      
      <div className="flex justify-center mt-8">
        <img 
          src={passportGif} 
          alt="Insert Passport" 
          className="w-3/4 h-auto" 
        />
      </div>

      {/* Call for Assistance Button with Icon */}
      <button
        onClick={handleCallForAssistance}
        className="fixed bottom-8 right-8 w-auto  text-white  p-4" // Removed rounded-full, added padding
        aria-label={t('callForAssistance')}
      >
        <img 
          src={assistanceIcon} 
          alt={t('callForAssistance')} 
          className="w-20 h-20" // Adjust size as needed
        />
      </button>

      {/* Overlay for "Officer coming over to help" */}
      {overlayVisible && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          role="dialog" 
          aria-labelledby="overlayTitle" 
          aria-describedby="overlayDescription"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 id="overlayTitle" className="text-2xl font-bold text-blue-600">
              {t('officerComingToHelp')}
            </h2>
            <p id="overlayDescription" className="mt-4 text-lg">
              {t('pressToClose')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WelcomePage;
