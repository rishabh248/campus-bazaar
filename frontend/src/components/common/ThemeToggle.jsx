import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkTheme = theme === 'campusBazaarDark';

  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle" title={isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <input
        type="checkbox"
        onChange={toggleTheme}
        checked={isDarkTheme}
        aria-label="Toggle theme"
      />
      <FaSun className="swap-on fill-current w-5 h-5" />
      <FaMoon className="swap-off fill-current w-5 h-5" />
    </label>
  );
};

export default ThemeToggle;
