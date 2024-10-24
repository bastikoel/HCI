import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useTranslation } from 'react-i18next'; // Import useTranslation for language support

const PassportScanFailed = () => {
    const { t, i18n } = useTranslation(); // Initialize translation function
    const navigate = useNavigate(); // Initialize useNavigate

    // Function to handle speech synthesis for failure message
    const speak = (message) => {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = i18n.language; // Set to the current language
            utterance.pitch = 1;
            utterance.rate = 1;
            synth.speak(utterance);
        }
    };

    useEffect(() => {
        // Speak the failure message when the component loads
        speak(t('wrongPageInserted'));
        speak(t('flipToCorrectPage'));

        // Add a keydown event listener for pressing the "1" key
        const handleKeyDown = (event) => {
            if (event.key === '1') {
                navigate('/passportScanning'); // Navigate to passport scanning page when '1' is pressed
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown); // Cleanup on component unmount
        };
    }, [navigate, t, i18n.language]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>{t('wrongPageInserted')}</h2>
            <p>{t('flipToCorrectPage')}</p>
        </div>
    );
};

export default PassportScanFailed;
