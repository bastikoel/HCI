// src/WelcomePage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function WelcomePage() {
  const { t } = useTranslation(); // use the hook

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-900">{t('welcome')}</h1>
      <p className="text-lg text-blue-700 mt-4">{t('checkIn')}</p>
    </div>
  );
}

export default WelcomePage;
