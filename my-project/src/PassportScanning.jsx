import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

const PassportScanning = () => {
    const { t } = useTranslation(); // Get translation
    const [loading, setLoading] = useState(true); // State to track if loading is complete
    const [progress, setProgress] = useState(0); // State to track the loading bar progress
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    // Function to handle key press once loading is complete
    const handleKeyPress = (event) => {
        if (!loading) {
            if (event.key === '1') {
                console.log('Scan succeeded');
                navigate('/passportScanSuccess'); // Navigate to PassportScanSuccess page
            } else if (event.key === '2') {
                console.log('Scan failed');
                navigate('/passportScanFailed'); // Navigate to PassportScanFailed page
            }
        }
    };

    // Simulate loading bar progress
    useEffect(() => {
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
    }, []);

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
                    Press '1' for success or '2' for failure
                </p>
            )}
        </div>
    );
};

export default PassportScanning;
