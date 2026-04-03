import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * ThemeContext - Global theme state management
 * Provides dark/light mode functionality across entire app
 * Theme preference is persisted in localStorage
 */
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // State: Stores current theme ('light' or 'dark')
  const [theme, setTheme] = useState('light');
  // State: Tracks if component mounted (prevents hydration mismatch)
  const [isMounted, setIsMounted] = useState(false);

  // Effect: Load theme from localStorage on initial mount
  useEffect(() => {
    // Get saved theme from browser storage
    const savedTheme = localStorage.getItem('theme') || 'light'; // Changed back to 'light'
    setTheme(savedTheme);

    // Apply theme to document root by adding/removing 'dark' class
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Mark component as mounted (ready to render)
    setIsMounted(true);
  }, []);

  /**
   * Toggle between light and dark modes
   * Updates localStorage and document class
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Save preference to browser localStorage
    localStorage.setItem('theme', newTheme);

    // Update document class for Tailwind dark mode selector
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Prevent flash of wrong theme during load
  if (!isMounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Hook - Use theme context in any component
 * Returns: { theme: 'light'|'dark', toggleTheme: function }
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
