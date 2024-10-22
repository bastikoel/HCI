import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation(); // Destructure the i18n object to manage language changes

  // Function to change language
  const changeLanguage = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage); // This will change the language dynamically
  };

  return (
    <div className="flex justify-center mt-4">
      <select
        onChange={changeLanguage}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        style={{ position: 'relative', zIndex: 10 }} // Ensures dropdown appears correctly
      >
        <option value="en">English</option>
        <option value="zh">中文</option>
        <option value="ms">Malay</option>
        <option value="hi">Hindi</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;
