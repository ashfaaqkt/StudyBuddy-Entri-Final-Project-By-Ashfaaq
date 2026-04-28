import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('sb_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    const persistUser = (userData) => {
        localStorage.setItem('sb_token', userData.token);
        localStorage.setItem('sb_user', JSON.stringify(userData));
        setUser(userData);
    };

    const register = useCallback(async (name, email, password) => {
        setAuthLoading(true);
        setAuthError(null);
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            persistUser(data);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            setAuthError(msg);
            throw new Error(msg);
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const login = useCallback(async (email, password) => {
        setAuthLoading(true);
        setAuthError(null);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            persistUser(data);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            setAuthError(msg);
            throw new Error(msg);
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('sb_token');
        localStorage.removeItem('sb_user');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, authLoading, authError, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
