import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleAuthError = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
    };
    
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp > currentTime) {
                        const { data } = await api.get('/auth/me');
                        setUser(data);
                    } else {
                        // Token expired, try to refresh
                        const { data } = await api.post('/auth/refresh-token');
                        localStorage.setItem('accessToken', data.accessToken);
                        const { data: userData } = await api.get('/auth/me');
                        setUser(userData);
                    }
                } catch (error) {
                    console.error("Auth initialization error:", error);
                    handleAuthError();
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);
    
    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('accessToken', data.accessToken);
        // **THIS IS THE CRUCIAL CHANGE**
        // Immediately fetch the full user object after login to ensure the role is included.
        const { data: userData } = await api.get('/auth/me');
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
        return userData;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        localStorage.setItem('accessToken', data.accessToken);
        // Also fetch full user details after registration
        const { data: newUser } = await api.get('/auth/me');
        setUser(newUser);
        toast.success(`Welcome to Campus Bazaar, ${newUser.name}!`);
        return newUser;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            handleAuthError();
            toast.success("You have been logged out.");
        }
    };

    const value = { user, setUser, loading, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};