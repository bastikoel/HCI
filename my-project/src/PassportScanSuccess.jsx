import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useTranslation } from 'react-i18next'; // Import useTranslation for language support

const PassportScanSuccess = () => {
    const { t, i18n } = useTranslation(); // Initialize translation function
    const navigate = useNavigate(); // Initialize useNavigate for redirection
    const [countdown, setCountdown] = useState(5); // Set initial countdown time

    // Function to handle speech synthesis for messages
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
        // Speak the initial messages once when the component mounts
        speak(t('removePassport'));
        speak(t('proceedToNextStation'));

        // Start countdown and redirect logic
        const timer = setInterval(() => {
            setCountdown(prevCountdown => {
                // Redirect when countdown reaches zero or below
                if (prevCountdown <= 1) {
                    navigate('/FaceScanner');
                    clearInterval(timer); // Clear the timer once redirected
                    return 0; // Prevent countdown from going negative
                } else {
                    return prevCountdown - 1;
                }
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer on component unmount
    }, [navigate, t, i18n.language]); // Empty dependency array to ensure the effect runs only once when the component mounts

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-grey-100 text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('removePassport')}</h2>
            <p className="text-lg text-blue-700 mb-2">{t('proceedToNextStation')}</p>
            <p className="text-lg text-red-500">{t('redirectingInSeconds', { countdown })}</p>
        </div>
    );
};

export default PassportScanSuccess;
