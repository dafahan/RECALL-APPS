import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from './db';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  primary: '#FFE500',
  background: '#f8f8f5',
  surface: '#ffffff',
  card: '#ffffff',
  text: '#1c1c0d',
  textSecondary: '#666666',
  border: '#e0e0e0',
  surfaceDark: '#f0f0f0',
  navBg: '#ffffff',
  navBorder: '#e0e0e0',
};

const darkColors = {
  primary: '#FFE500',
  background: '#23220f',
  surface: '#2d2c15',
  card: 'rgba(255,255,255,0.05)',
  text: '#f2f2f2',
  textSecondary: '#888888',
  border: '#333',
  surfaceDark: 'rgba(255,255,255,0.05)',
  navBg: '#1c1c0d',
  navBorder: '#333',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const settings = await db.getSettings();
    setTheme(settings.darkMode ? 'dark' : 'light');
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    const settings = await db.getSettings();
    await db.saveSettings({
      ...settings,
      darkMode: newTheme === 'dark'
    });
  };

  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Export colors for backward compatibility
export const COLORS = {
  primary: '#FFE500',
  bgLight: '#f8f8f5',
  bgDark: '#23220f',
  surfaceLight: '#ffffff',
  surfaceDark: '#2d2c15',
  textLight: '#1c1c0d',
  textDark: '#f2f2f2',
  textGray: '#888888',
};
