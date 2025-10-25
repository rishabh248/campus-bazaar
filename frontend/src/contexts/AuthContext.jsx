import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearAuthState = useCallback(() => {
        localStorage.removeItem('accessToken');
        setUser(null);
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp > currentTime) {
                        const { data } = await api.get('/auth/me');
                        setUser(data);
                    } else {
                        console.warn("Access token expired.");
                        clearAuthState();
                        // Refresh token logic could be added here
                    }
                } catch (error) {
                    console.error("Auth initialization error:", error.response?.data?.message || error.message);
                    clearAuthState();
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, [clearAuthState]);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('accessToken', data.accessToken);
        const { data: userData } = await api.get('/auth/me');
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
        return userData;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        localStorage.setItem('accessToken', data.accessToken);
        const { data: newUser } = await api.get('/auth/me');
        setUser(newUser);
        toast.success(`Welcome to Campus Bazaar, ${newUser.name}!`);
        return newUser;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout API call failed:", error.response?.data?.message || error.message);
        } finally {
            clearAuthState();
            toast.success("You have been logged out.");
        }
    };

    const contextValue = { user, setUser, loading, login, register, logout };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading ? children : null}
        </AuthContext.Provider>
    );
};
