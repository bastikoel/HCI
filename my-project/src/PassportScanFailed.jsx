import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const PassportScanFailed = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    // Add a keydown event listener for pressing the "1" key
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === '1') {
                navigate('/passportScanning'); // Navigate to another page when '1' is pressed
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown); // Cleanup on component unmount
        };
    }, [navigate]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Wrong page inserted</h2>
            <p>Please flip to your particular page to be inserted.</p>
        </div>
    );
};

export default PassportScanFailed;
