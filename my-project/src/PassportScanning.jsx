import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

const PassportScanning = () => {
    const { t, i18n } = useTranslation(); // Get translation
    const [loading, setLoading] = useState(true); // State to track if loading is complete
    const [progress, setProgress] = useState(0); // State to track the loading bar progress
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    // Function to handle speech synthesis for success or failure or scanning passport
    const speak = (message) => {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = i18n.language; // Use current language set in i18n
            utterance.pitch = 1;
            utterance.rate = 1;
            synth.speak(utterance);
        }
    };

    // Function to handle key press once loading is complete
    const handleKeyPress = (event) => {
        if (!loading) {
            if (event.key === '1') {
                const successMessage = t('scanSuccess'); // Get translated success message
                console.log(successMessage); // Log success message
                speak(successMessage); // Speak the success message
                navigate('/passportScanSuccess'); // Navigate to PassportScanSuccess page
            } else if (event.key === '2') {
                const failureMessage = t('scanFailed'); // Get translated failure message
                console.log(failureMessage); // Log failure message
                speak(failureMessage); // Speak the failure message
                navigate('/passportScanFailed'); // Navigate to PassportScanFailed page
            }
        }
    };

    // Simulate loading bar progress and speak scanning passport
    useEffect(() => {
        const scanningMessage = t('scanningPassport'); // Get translated scanning message
        speak(scanningMessage); // Speak the scanning passport message

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 10; // Increment progress by 10 every 200ms
                } else {
                    setLoading(false); // Stop loading once progress reaches 100
                    clearInterval(interval); // Clear the interval
                    return prev;
                }
            });
        }, 200);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [t, i18n.language]); // Ensure this effect runs when language or translations are updated

    // Add event listener for keypress once loading is complete
    useEffect(() => {
        if (!loading) {
            window.addEventListener('keydown', handleKeyPress);
        }
        return () => window.removeEventListener('keydown', handleKeyPress); // Cleanup on unmount
    }, [loading]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>{t('scanningPassport')}</h2>

            {/* Loading bar */}
            <div
                style={{
                    width: '100%',
                    backgroundColor: '#ccc',
                    height: '30px',
                    marginTop: '20px',
                    borderRadius: '5px',
                }}
            >
                <div
                    style={{
                        width: `${progress}%`,
                        backgroundColor: '#4caf50',
                        height: '100%',
                        borderRadius: '5px',
                    }}
                ></div>
            </div>

            {/* Instruction to press keys once loading is done */}
            {!loading && (
                <p style={{ marginTop: '20px', color: 'blue' }}>
                    {t('pressSuccessOrFailure')}
                </p>
            )}
        </div>
    );
};

export default PassportScanning;
