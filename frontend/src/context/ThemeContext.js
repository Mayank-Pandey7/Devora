import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Read from localStorage, default to dark
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // Apply theme classes to body and documentElement on mount and change
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark', 'dark-mode');
      document.body.classList.remove('light', 'light-mode');
      document.documentElement.classList.add('dark', 'dark-mode');
      document.documentElement.classList.remove('light', 'light-mode');
    } else {
      document.body.classList.add('light', 'light-mode');
      document.body.classList.remove('dark', 'dark-mode');
      document.documentElement.classList.add('light', 'light-mode');
      document.documentElement.classList.remove('dark', 'dark-mode');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Allow external code to sync theme
  const setTheme = (dark) => setIsDark(dark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);