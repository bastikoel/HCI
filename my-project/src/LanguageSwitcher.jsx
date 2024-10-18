// src/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

function LanguageSwitcher() {
  const { i18n } = useTranslation(); // Destructure the i18n object to manage language changes

  // Function to change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // This will change the language dynamically
  };

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('zh')}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
      >
        中文
      </button>
      <button
        onClick={() => changeLanguage('ms')}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
      >
        Malay
      </button>
      <button
        onClick={() => changeLanguage('hi')}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        Hindi
      </button>
    </div>
  );
}

export default LanguageSwitcher;
