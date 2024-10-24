// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import LanguageSwitcher from "./LanguageSwitcher";
import "./i18n";
import FaceScanner from "./FaceScanner"; // Ensure this is the only import
import Layout from "./Layout";
import PassportScanning from "./PassportScanning";
import PassportScanSuccess from "./PassportScanSuccess";
import PassportScanFailed from "./PassportScanFailed";
import Done from "./Done";
import FingerScanner from "./FingerScanner";
import FingerScanning from "./FingerScanning";

function App() {
  return (
    <div>
      {/* Language switcher */}
      {/* <LanguageSwitcher /> */}

      {/* Routes */}
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/faceScanner" element={<FaceScanner />} />
            <Route path="/passportScanning" element={<PassportScanning />} />
            <Route
              path="/passportScanSuccess"
              element={<PassportScanSuccess />}
            />
            <Route
              path="/passportScanFailed"
              element={<PassportScanFailed />}
            />
            <Route path="/done" element={<Done />} />
            <Route path="/fingerScanner" element={<FingerScanner />} />
            <Route path="/fingerScanning" element={<FingerScanning />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
