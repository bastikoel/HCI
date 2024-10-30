import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

const Layout = ({ children }) => {
  return (
    <div className="h-screen bg-gray-150 flex flex-col">
      {/* Place the LanguageSwitcher in a fixed header */}
      <header className="p-4 flex justify-start">
        <LanguageSwitcher />
      </header>
      
      {/* Main content area fills the rest of the screen */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default Layout;
