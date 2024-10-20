import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import passportGif from './assets/passport-insert.gif'; 

function WelcomePage() {
  const { t, i18n } = useTranslation(); // Get translation and current language

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const welcomeMessage = t('welcome');

      const utterance = new SpeechSynthesisUtterance(`${welcomeMessage}`);
      utterance.lang = i18n.language; // Set the language dynamically
      utterance.pitch = 1;
      utterance.rate = 1;
      synth.speak(utterance);
    }
  }, [t, i18n.language]); // Re-run effect if the language changes

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-blue-900 mt-4">{t('welcome')}</h1>
      <p className="text-lg text-blue-700 mt-2">{t('checkIn')}</p>
      
      {/* Wrap the image in a flex container to center it */}
      <div className="flex justify-center mt-8">
        <img 
          src={passportGif} 
          alt="Insert Passport" 
          className="w-3/4 h-auto" 
        />
      </div>

    </div>
  );
}

export default WelcomePage;
