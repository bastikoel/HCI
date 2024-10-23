import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import passportGif from './assets/passport-insert.gif';
import Quagga from 'quagga'; // Import QuaggaJS

function WelcomePage() {
  const { t, i18n } = useTranslation();
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanFeedback, setScanFeedback] = useState('');
  const [specificDeviceID, setSpecificDeviceID] = useState(null);
  //const specificDeviceID = 'e319b8585cb1a3beb6c1485591ff728ab7cf7bf929d50a3fc4339033e67c4813';

 
  // Use getUserMedia to start the camera and show on videoRef
  const startCameraStream = () => {
    //const specificDeviceID = 'e319b8585cb1a3beb6c1485591ff728ab7cf7bf929d50a3fc4339033e67c4813';
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: specificDeviceID ? { exact: specificDeviceID } : undefined,
        facingMode: "environment", // Use rear camera if possible
        width: { min: 640 },
        height: { min: 480 }
      }
    })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(err => {
        console.error("Failed to access the camera:", err);
      });
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      devices.forEach(device => {
        if (device.kind === 'videoinput') {
          console.log(`${device.label}: ${device.deviceId}`);
          // Automatically set the deviceId if the label matches 'OBS'
          if (device.label.toLowerCase().includes("obs")) {
            setSpecificDeviceID(device.deviceId);
            console.log(`Using OBS Device: ${device.deviceId}`);
          }
        }
      });
    });
  }, []);
  
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const welcomeMessage = t('welcome');
      const utterance = new SpeechSynthesisUtterance(`${welcomeMessage}`);
      utterance.lang = i18n.language;
      utterance.pitch = 1;
      utterance.rate = 1;
      synth.speak(utterance);
    }
  }, [t, i18n.language]);

  const startScan = () => {
    if (isScanning) {
      console.log("Already scanning...");
      return; 
    }

    console.log("Starting scan...");
    setIsScanning(true);
    setScanFeedback('');

    // Make sure the camera stream is running
    startCameraStream();

    // Configure QuaggaJS to read barcodes from the video feed
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: videoRef.current, // Use the video element (your custom ref)
        constraints: {
          width: { min: 640 },
          height: { min: 480 },
          facingMode: "environment",
          //deviceId: specificDeviceID
          deviceId : specificDeviceID? { exact: specificDeviceID } : undefined 
        }
      },
      decoder: {
        readers: ["code_128_reader", "ean_reader", "upc_reader", "ean_8_reader", "code_39_reader"],
        multiple: false,
        locate: true
      },
      debug: true
    }, (err) => {
      if (err) {
        console.error("Quagga initialization error:", err);
        setScanFeedback(t('scanFailed'));
        setIsScanning(false);
        return;
      }
      console.log("Initialization finished. Ready to start");

      Quagga.start();
    });

    // Listen for detected barcodes
    Quagga.onDetected((data) => {
      console.log("Barcode detected:", data.codeResult.code);
      setScanFeedback(`${t('scanSuccess')}: ${data.codeResult.code}`);
      stopScan();
    });

    // Log when frames are processed
    Quagga.onProcessed((result) => {
      if (result) {
        console.log("Processing frame...");
        if (result.boxes) {
          result.boxes
            .filter(box => box !== result.box)
            .forEach((box, index) => {
              console.log(`Potential barcode area ${index + 1}:`, box);
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, Quagga.canvas.ctx.overlay, {
                color: "red",
                lineWidth: 2,
              });
            });
        }
        if (result.box) {
          console.log("Main barcode area detected:", result.box);
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, Quagga.canvas.ctx.overlay, {
            color: "green",
            lineWidth: 4,
          });
        }
      } else {
        console.log("No result from Quagga processing.");
      }
    });
  };

  const stopScan = () => {
    Quagga.stop();
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    console.log("Scan stopped.");
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-blue-900 mt-4">{t('welcome')}</h1>
      <p className="text-lg text-blue-700 mt-2">{t('checkIn')}</p>
      
      <div className="flex justify-center mt-8">
        <img 
          src={passportGif} 
          alt="Insert Passport" 
          className="w-3/4 h-auto" 
        />
      </div>

      {/* Start Scan Button */}
      <button 
        onClick={startScan} 
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={isScanning}
      >
        {t('startScan')}
      </button>

      {/* Stop Scan Button */}
      {isScanning && (
        <button 
          onClick={stopScan} 
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          {t('stopScan')}
        </button>
      )}

      {/* Video feed for barcode scanning */}
      <div className="flex justify-center mt-4">
        <video ref={videoRef} className="relative w-80 h-60 border border-gray-500" autoPlay muted />
        {isScanning && <p className="absolute text-white bg-black opacity-75 p-2">Scanning...</p>}
      </div>

      {/* Feedback after scan */}
      {scanFeedback && (
        <p className={`mt-4 ${scanFeedback.includes('Success') ? 'text-green-500' : 'text-red-500'} font-bold`}>
          {scanFeedback}
        </p>
      )}
    </div>
  );
}

export default WelcomePage;
