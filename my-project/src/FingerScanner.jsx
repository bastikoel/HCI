import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import fingerImage from './assets/Fingerprint scan.png'; // Assuming you have a finger image in your assets folder

const FingerScanner = () => {
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Handle key presses for switching pages
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '1') {
        navigate('/fingerScanning'); // Redirect to another page when '1' is pressed
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Image of finger to scan */}
      <img src={fingerImage} alt="Finger to Scan" className="w-64 h-auto" />

      {/* Instruction text */}
      <p className="mt-4 text-lg font-bold">Press 1 to proceed</p>
    </div>
  );
};

export default FingerScanner;
