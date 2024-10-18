import React, { useState, useEffect } from 'react';
import fingerprintImage from './assets/fingerprint.png'; // Replace with your fingerprint image path
import loadingSpinner from './assets/loading-spinner.gif'; // Replace with your loading spinner path
import { useTranslation } from 'react-i18next';

const FingerprintScanner = () => {
    const { t, i18n } = useTranslation(); // Get translation and current language
    const [status, setStatus] = useState(t('readyToScan')); // Initial status message
    const [loading, setLoading] = useState(false);

    // Function to speak the status message
    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = i18n.language; // Set to current language
            utterance.pitch = 1;
            utterance.rate = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Update status when language changes
    useEffect(() => {
        setStatus(t('readyToScan')); // Reset status to the initial message in the new language
        speak(status); // Speak the updated status message
    }, [i18n.language]); // Run this effect whenever the language changes

    // Speak the current status when it changes
    useEffect(() => {
        speak(status); // Speak the updated status when it changes
    }, [status]); // Run this effect whenever the status changes

    const handleScan = async () => {
        setStatus(t('scanning')); // Update status for scanning
        setLoading(true);
        try {
            // Simulate a delay to mimic the scanning process
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Randomly determine success or failure (50/50 chance)
            const isSuccess = Math.random() > 0.5;
            if (isSuccess) {
                setStatus(t('scanSuccessful')); // Update status for success
                speak(t('scanSuccessful')); // Voice feedback for success
            } else {
                throw new Error('Fingerprint scan failed.'); // Simulate a scan failure
            }
        } catch (error) {
            console.error('Fingerprint scan failed:', error);
            setStatus(t('scanFailed')); // Update status for failure
            speak(t('scanFailed')); // Voice feedback for failure
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>{t('fingerprintScanner')}</h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <img
                    src={loading ? loadingSpinner : fingerprintImage}
                    alt="Fingerprint"
                    style={{ width: '200px', height: 'auto', cursor: 'pointer' }}
                    onClick={!loading ? handleScan : undefined} // Call handleScan on image click
                />
            </div>
            <p>{status}</p>
        </div>
    );
};

export default FingerprintScanner;
