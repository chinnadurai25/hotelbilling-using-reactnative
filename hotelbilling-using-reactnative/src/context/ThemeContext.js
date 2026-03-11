import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const lightTheme = {
  background: '#F4F7FE',
  cardBg: '#FFFFFF',
  text: '#1B2559',
  subText: '#A3AED0',
  primary: '#4318FF',
  secondary: '#39B8FF',
  success: '#01B574',
  danger: '#EE5D50',
  warning: '#FFCE20',
  border: '#E0E5F2',
  cardOverlay: 'rgba(255, 255, 255, 0.7)',
};

export const darkTheme = {
  background: '#0B1437',
  cardBg: '#111C44',
  text: '#FFFFFF',
  subText: '#A3AED0',
  primary: '#7551FF',
  secondary: '#39B8FF',
  success: '#01B574',
  danger: '#EE5D50',
  warning: '#FFCE20',
  border: '#111C44',
  cardOverlay: 'rgba(17, 28, 68, 0.7)',
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
