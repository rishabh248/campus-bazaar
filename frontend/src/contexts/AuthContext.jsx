import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import Spinner from '../components/ui/Spinner'; 

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    const clearAuthState = useCallback(() => {
        localStorage.removeItem('accessToken');
        setUser(null);
    }, []);

   
    const refreshUserToken = useCallback(async () => {
        try {
            const { data } = await api.post('/auth/refresh-token'); 
            localStorage.setItem('accessToken', data.accessToken);
            const { data: userData } = await api.get('/auth/me');
            setUser(userData);
        } catch (error) {
            clearAuthState();
            throw new Error("Session expired. Please log in again.");
        }
    }, [clearAuthState]);

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
                        await refreshUserToken();
                    }
                } catch (error) {
                    clearAuthState();
                }
            } else {
                try {
                    await refreshUserToken();
                } catch (error) {
                  
                }
            }
            setLoading(false); 
        };
        initializeAuth();
    }, []); 

    const login = async (email, password) => {
        await api.post('/auth/login', { email, password });
        await refreshUserToken(); 
        const { data: userData } = await api.get('/auth/me');
        toast.success(`Welcome back, ${userData.name}!`);
        return userData;
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

    const contextValue = { user, setUser, loading, login, logout };

    return (
        <AuthContext.Provider value={contextValue}>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <Spinner size="lg" />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};