import React, { createContext, useState, useContext, useEffect } from 'react';
import { Cookies } from 'react-cookie';

const tokenId = 'io7_token';
const noderedId = 'NODERED_URL';
const influxdbId = 'INFLUXDB_URL';
const grafanaId = 'GRAFANA_URL';
const dashboardId = 'dashboard';
const influxdb_tokenId = 'influxdb_token';
const gf_tokenId = 'gf_token';
// Create the authentication context
const AuthContext = createContext();

const svr = window.location;
let apiserver_url = window.runtime.API_URL_ROOT || svr.protocol+'//'+svr.hostname+':2009';

// Custom hook for using the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [nodered_url, setNodered_url] = useState();
    const [influxdb_url, setInfluxdb_url] = useState();
    const [grafana_url, setGrafana_url] = useState();
    const [dashboard_url, setDashboard_url] = useState('');
    const [influxdb_token, setInfluxDB_token] = useState('');
    const [gf_token, setGf_token] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const cookies = new Cookies();

    const get_config = (varName, setter, token) => {
        fetch(apiserver_url + `/config/${varName}`, {
            method: 'GET',
            headers: { "Authorization": 'Bearer ' + token },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 400) {
                logout(); // the token might have been changed so it needs relogin
            }
        }).then((data) => {
            setter(data.value);
            cookies.set(varName, data.value);
        }).catch((err) => {
            console.log(err);
        });
    };

    const set_window_runtime = (token) => {
        get_config(noderedId, setNodered_url, token);
        get_config(influxdbId, setInfluxdb_url, token);
        get_config(grafanaId, setGrafana_url, token);
        get_config(dashboardId, setDashboard_url, token);
        get_config(influxdb_tokenId, setInfluxDB_token, token);
        get_config(gf_tokenId, setGf_token, token);
    }

    // Initialize auth state from cookies on component mount
    useEffect(() => {
        const storedToken = cookies.get(tokenId);
        if (storedToken) {
            setToken(storedToken);
            setNodered_url(cookies.get(noderedId) || `${svr.protocol}//${svr.hostname}:1880`);
            setInfluxdb_url(cookies.get(influxdbId) || `${svr.protocol}//${svr.hostname}:8086`);
            setGrafana_url(cookies.get(grafanaId) || `${svr.protocol}//${svr.hostname}:3003`);
            setDashboard_url(cookies.get(dashboardId));
            setInfluxDB_token(cookies.get(influxdb_tokenId));
            setGf_token(cookies.get(gf_tokenId));
            setIsAuthenticated(true);
        }
    }, []);

    // Login function
    const login = (newToken) => {
        cookies.set(tokenId, newToken);
        setToken(newToken);
        setIsAuthenticated(true);
        set_window_runtime(newToken);
    };

    // Logout function
    const logout = () => {
        cookies.set(tokenId, '');
        setToken('');
        setIsAuthenticated(false);
    };

    // Auth context value
    const value = {
        token,
        isAuthenticated,
        login,
        logout,
        nodered_url,
        influxdb_url,
        apiserver_url,
        grafana_url,
        dashboard_url,
        influxdb_token,
        gf_token,
        get_config
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
