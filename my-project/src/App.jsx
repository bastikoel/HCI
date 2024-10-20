// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import LanguageSwitcher from './LanguageSwitcher';
import './i18n'; 
import FingerprintScanner from './FingerprintScanner';
import FaceScanner from './FaceScanner'; // Ensure this is the only import

function App() {
  return (
    <div>
      {/* Language switcher */}
      <LanguageSwitcher />

      {/* Routes */}
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/finger" element={<FingerprintScanner />} />
          <Route path="/face" element={<FaceScanner />} /> {/* Corrected here */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
