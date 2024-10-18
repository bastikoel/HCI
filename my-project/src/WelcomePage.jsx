// src/HomePage.jsx
import React from 'react';

function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-900">Welcome to the Airport Check-In System</h1>
      <p className="text-lg text-blue-700 mt-4">Check-in faster and easier with our system.</p>
    </div>
  );
}

export default WelcomePage;
