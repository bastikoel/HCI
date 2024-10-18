import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function WelcomePage() {
  const { t, i18n } = useTranslation(); // Get translation and current language

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const welcomeMessage = t('welcome');
      const checkInMessage = t('checkIn');

      const utterance = new SpeechSynthesisUtterance(`${welcomeMessage}. ${checkInMessage}`);
      utterance.lang = i18n.language; // Set the language dynamically
      utterance.pitch = 1;
      utterance.rate = 1;

      synth.speak(utterance);
    }
  }, [t, i18n.language]); // Re-run effect if the language changes

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-900">{t('welcome')}</h1>
      <p className="text-lg text-blue-700 mt-4">{t('checkIn')}</p>
    </div>
  );
}

export default WelcomePage;
