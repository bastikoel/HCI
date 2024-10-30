import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useTranslation } from 'react-i18next'; // Import useTranslation for language support
import passportGif from './assets/passport-insert.gif'; // Adjust the path if needed
import assistanceIcon from './assets/help-desk.png'; // Import your icon here

const PassportScanFailed = () => {
    const { t, i18n } = useTranslation(); // Initialize translation function
    const navigate = useNavigate(); // Initialize useNavigate

    const [overlayVisible, setOverlayVisible] = useState(false); // State for overlay visibility

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

    // Handle "Call for Assistance" button click
    const handleCallForAssistance = () => {
        setOverlayVisible(true); // Show the overlay
    };

    // Handle keydown event
    const handleKeyDown = (event) => {
        if (event.key === '1') {
            navigate('/passportScanning'); // Navigate to passport scanning page when '1' is pressed
        }
    };

    useEffect(() => {
        // Speak the failure message when the component loads
        speak(t('wrongPageInserted'));
        speak(t('flipToCorrectPage'));

        window.addEventListener('keydown', handleKeyDown); // Add keydown event listener

        return () => {
            window.removeEventListener('keydown', handleKeyDown); // Cleanup on component unmount
        };
    }, [navigate, t, i18n.language]);

    return (
        <div className="relative h-screen w-full bg-gray-150 flex flex-col justify-center items-center">
            {/* Main Heading */}
            <h1 className="text-4xl font-bold text-red-600 mb-4">
                Wrong Page Passport Page Inserted.
            </h1>

            {/* Subtitle */}
            <p className="text-lg font-medium text-blue-700 mb-6">
                Please flip to the correct page and try again.
            </p>

            {/* Display Passport GIF */}
            <div className="flex justify-center">
                <img 
                    src={passportGif} 
                    alt="Insert Passport" 
                    className="w-3/4 h-auto mb-8" 
                />
            </div>

            {/* Call for Assistance Button with Icon */}
            <button
                onClick={handleCallForAssistance}
                className="fixed bottom-8 right-8 bg-blue-600 rounded-full text-white p-4 flex items-center justify-center"
                aria-label={t('callForAssistance')}
            >
                <img 
                    src={assistanceIcon} 
                    alt={t('callForAssistance')} 
                    className="w-12 h-12"
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
};

export default PassportScanFailed;
