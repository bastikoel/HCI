// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import LanguageSwitcher from './LanguageSwitcher'; // Import the new component
import './i18n'; 
import FingerprintScanner from './FingerprintScanner';

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

        </Routes>
      </Router>
    </div>
  );
}

export default App;
