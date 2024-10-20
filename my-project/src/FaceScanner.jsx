import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [faceInFrame, setFaceInFrame] = useState(false);
  const [accessoriesMessage, setAccessoriesMessage] = useState('');

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load Tiny Face Detector and Landmark detection models
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        setInitialized(true);
      } catch (error) {
        console.error('Error loading face-api.js models:', error);
      }
    };

    loadModels();
  }, []);

  // Start video stream with error handling
  useEffect(() => {
    if (initialized) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });

      videoRef.current.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(videoRef.current);
        canvasRef.current.innerHTML = ''; // Clear any previous canvas
        canvasRef.current.append(canvas);

        const displaySize = {
          width: videoRef.current.width,
          height: videoRef.current.height,
        };
        faceapi.matchDimensions(canvas, displaySize);

        const detectFace = () => {
          setInterval(async () => {
            const detections = await faceapi.detectAllFaces(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            // Clear the canvas before drawing new detections
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw face detection boxes and landmarks
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

            // Check if the face is in the center of the frame
            if (detections.length > 0) {
              const faceBox = detections[0].detection.box;
              const faceFitsFrame = isFaceInFrame(faceBox, displaySize);
              setFaceInFrame(faceFitsFrame);

              // Check for accessories (glasses/cap)
              checkForAccessories(resizedDetections[0]);
            } else {
              setFaceInFrame(false); // No face detected
              setAccessoriesMessage('');
            }
          }, 100);
        };

        detectFace();
      });
    }
  }, [initialized]);

  // Function to check if the face fits within the defined frame
  const isFaceInFrame = (faceBox, displaySize) => {
    const centerX = displaySize.width / 2;
    const centerY = displaySize.height / 2;
    const tolerance = 100; // Tolerance in pixels for how much the face can deviate from the center

    const faceCenterX = faceBox.x + faceBox.width / 2;
    const faceCenterY = faceBox.y + faceBox.height / 2;

    const withinXBounds = Math.abs(faceCenterX - centerX) < tolerance;
    const withinYBounds = Math.abs(faceCenterY - centerY) < tolerance;

    return withinXBounds && withinYBounds;
  };

  // Function to check for accessories like glasses or caps
  const checkForAccessories = (detection) => {
    const landmarks = detection.landmarks;

    // Example checks (these can be adjusted based on landmark indices)
    const eyeLeft = landmarks.getLeftEye();
    const eyeRight = landmarks.getRightEye();
    const eyebrowLeft = landmarks.getLeftEyebrow();
    const eyebrowRight = landmarks.getRightEyebrow();
    const nose = landmarks.getNose();

    // Simple heuristic checks (you may want to refine these)
    if (eyeLeft[1] < eyebrowLeft[1] && eyeRight[1] < eyebrowRight[1]) {
      setAccessoriesMessage('Please remove your glasses for better detection.');
    } else if (nose[1] < eyebrowLeft[1] && nose[1] < eyebrowRight[1]) {
      setAccessoriesMessage('Please remove your cap for better detection.');
    } else {
      setAccessoriesMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Face Scanning Page</h1>
      <p className="text-lg mt-4">Position your face in the center of the frame</p>

      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        className="border border-blue-500"
      />

      {/* Canvas for drawing face landmarks */}
      <div ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />

      {/* Feedback message for user */}
      <div className="mt-4">
        {faceInFrame ? (
          <p className="text-green-500 font-bold">Face is in the frame!</p>
        ) : (
          <p className="text-red-500 font-bold">Please center your face in the frame.</p>
        )}
      </div>

      {/* Accessories warning message */}
      {accessoriesMessage && (
        <p className="text-yellow-500 font-bold mt-2">{accessoriesMessage}</p>
      )}
    </div>
  );
};

export default FaceScanner;
