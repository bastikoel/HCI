import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [faceInFrame, setFaceInFrame] = useState(false);
  const [accessoriesMessage, setAccessoriesMessage] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.tf.setBackend('cpu');
        await faceapi.tf.ready();

        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

        setInitialized(true);
      } catch (error) {
        console.error('Error loading face-api.js models:', error);
      }
    };

    loadModels();
  }, []);

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
        canvasRef.current.innerHTML = '';
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
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

            if (detections.length > 0) {
              const faceBox = detections[0].detection.box;
              const faceFitsFrame = isFaceInFrame(faceBox, displaySize);
              setFaceInFrame(faceFitsFrame);
              checkForAccessories(resizedDetections[0]);
            } else {
              setFaceInFrame(false);
              setAccessoriesMessage('');
            }
          }, 100);
        };

        detectFace();
      });
    }
  }, [initialized]);

  const isFaceInFrame = (faceBox, displaySize) => {
    const centerX = displaySize.width / 2;
    const centerY = displaySize.height / 2;
    const tolerance = 100;
    const faceCenterX = faceBox.x + faceBox.width / 2;
    const faceCenterY = faceBox.y + faceBox.height / 2;
    const withinXBounds = Math.abs(faceCenterX - centerX) < tolerance;
    const withinYBounds = Math.abs(faceCenterY - centerY) < tolerance;

    return withinXBounds && withinYBounds;
  };

  const checkForAccessories = (detection) => {
    const landmarks = detection.landmarks;
    const eyeLeft = landmarks.getLeftEye();
    const eyeRight = landmarks.getRightEye();
    const eyebrowLeft = landmarks.getLeftEyebrow();
    const eyebrowRight = landmarks.getRightEyebrow();
    const nose = landmarks.getNose();

    if (eyeLeft[1] < eyebrowLeft[1] && eyeRight[1] < eyebrowRight[1]) {
      setAccessoriesMessage('Please remove your glasses for better detection.');
    } else if (nose[1] < eyebrowLeft[1] && nose[1] < eyebrowRight[1]) {
      setAccessoriesMessage('Please remove your cap for better detection.');
    } else {
      setAccessoriesMessage('');
    }
  };

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-purple-200">
    <div className="flex flex-col items-center justify-center h-auto overflow-hidden bg-indigo-300">
      <h1 className="text-3xl font-bold">Face Scanning Page</h1>
      <p className="text-lg mt-4">Position your face in the center of the frame</p>

      {/* Container for video and canvas */}
      <div className="relative max-w-full max-h-full ">
        <video
          ref={videoRef}
          autoPlay
          muted
          width="640"
          height="480"
          className="border border-blue-500 bg-transparent"
        />
        <div ref={canvasRef} className="absolute top-0 left-0" />
      </div>

      <div className="mt-4">
        {faceInFrame ? (
          <p className="text-green-500 font-bold">Face is in the frame!</p>
        ) : (
          <p className="text-red-500 font-bold">Please center your face in the frame.</p>
        )}
      </div>

      {accessoriesMessage && (
        <p className="text-yellow-500 font-bold mt-2">{accessoriesMessage}</p>
      )}

    </div>
  );
};

export default FaceScanner;
