import React, { createContext, useState, useContext, useEffect } from 'react';
import { Cookies } from 'react-cookie';

// Create the authentication context
const AuthContext = createContext();

// Custom hook for using the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const cookies = new Cookies();

    // Initialize auth state from cookies on component mount
    useEffect(() => {
        const storedToken = cookies.get('token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
        }
    }, []);

    // Login function
    const login = (newToken) => {
        cookies.set('token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    };

    // Logout function
    const logout = () => {
        cookies.set('token', '');
        setToken('');
        setIsAuthenticated(false);
    };

    // Auth context value
    const value = {
        token,
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
