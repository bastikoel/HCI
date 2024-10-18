import React, { useState } from 'react';

// Import a fingerprint image and a loading spinner image
import fingerprintImage from './assets/fingerprint.png'; // Replace with your fingerprint image path
import loadingSpinner from './assets/loading-spinner.gif'; // Replace with your loading spinner path

const FingerprintScanner = () => {
    const [status, setStatus] = useState('Ready to scan');
    const [loading, setLoading] = useState(false);

    const handleScan = async () => {
        setStatus('Scanning...');
        setLoading(true);
        try {
            // Simulate a delay to mimic the scanning process
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Randomly determine success or failure (50/50 chance)
            const isSuccess = Math.random() > 0.5;
            if (isSuccess) {
                const fakeCredential = {
                    id: "fake-credential-id", // Fake credential ID
                    type: "public-key", // Type of credential
                    rawId: new Uint8Array(16), // Fake raw ID data
                    response: {
                        clientDataJSON: new Uint8Array([1, 2, 3]), // Fake client data
                        attestationObject: new Uint8Array([4, 5, 6]), // Fake attestation object
                    },
                };
                console.log('Fingerprint scanned successfully:', fakeCredential);
                setStatus('Scan successful!');
            } else {
                throw new Error('Fingerprint scan failed.'); // Simulate a scan failure
            }
        } catch (error) {
            console.error('Fingerprint scan failed:', error);
            setStatus('Scan failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Fingerprint Scanner</h2>
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
