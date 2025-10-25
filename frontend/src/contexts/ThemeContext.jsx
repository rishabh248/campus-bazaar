import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        const validThemes = ['campusBazaarLight', 'campusBazaarDark'];
        return validThemes.includes(storedTheme) ? storedTheme : 'campusBazaarLight';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme =>
            prevTheme === 'campusBazaarLight' ? 'campusBazaarDark' : 'campusBazaarLight'
        );
    };

    const contextValue = { theme, toggleTheme };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};
