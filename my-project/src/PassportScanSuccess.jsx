import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const PassportScanSuccess = () => {
    const navigate = useNavigate(); // Initialize useNavigate for redirection
    const [countdown, setCountdown] = useState(5); // Set initial countdown time

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1); // Decrease countdown by 1 every second
        }, 1000);

        if (countdown === 0) {
            navigate('/FaceScanner'); // Redirect to the next station when countdown reaches 0
        }

        return () => clearInterval(timer); // Cleanup timer on component unmount
    }, [countdown, navigate]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Please remove passport</h2>
            <p>Please proceed to the next station.</p>
            <p>Redirecting in {countdown} seconds...</p>
        </div>
    );
};

export default PassportScanSuccess;
