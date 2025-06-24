import React, { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MemoryIcon from '@mui/icons-material/Memory';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { 
    Box, 
    Typography, 
    TextField, 
    IconButton, 
    InputAdornment, 
    Grid, 
    Paper,
    Snackbar,
    Alert
} from '@mui/material';
import { useAuth } from '../context';

const Settings = (props) => {
    const { influxdb_url, nodered_url, grafana_url, apiserver_url, dashboard_url, gf_token, influxdb_token} = useAuth();
    
    const [showGfToken, setShowGfToken] = useState(false);
    const [showInfluxToken, setShowInfluxToken] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text || '').then(() => {
            setSnackbarMessage(`${label} copied to clipboard`);
            setSnackbarOpen(true);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            setSnackbarMessage('Failed to copy to clipboard');
            setSnackbarOpen(true);
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const settings = [
        { label: 'InfluxDB URL', value: influxdb_url, isToken: false },
        { label: 'Node-RED URL', value: nodered_url, isToken: false },
        { label: 'Grafana URL', value: grafana_url, isToken: false },
        { label: 'API Server URL', value: apiserver_url, isToken: false },
        { label: 'Dashboard URL', value: dashboard_url, isToken: false },
        { label: 'Grafana Token', value: gf_token, isToken: true, show: showGfToken, setShow: setShowGfToken },
        { label: 'InfluxDB Token', value: influxdb_token, isToken: true, show: showInfluxToken, setShow: setShowInfluxToken },
    ];

    return(
        <div>
                <h1>Settings</h1>
                <hr />
            
            <Box sx={{ mt: 4, mb: 4 }}         onMouseUp={(e) => e.stopPropagation()}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ mb: 3 }}>
                        Configuration Settings
                    </Typography>
                    <Grid container spacing={3}>
                        {settings.map((setting, index) => (
                            <Grid item xs={12} key={index}>
                                <TextField
                                    fullWidth
                                    label={setting.label}
                                    value={setting.value || ''}
                                    type={setting.isToken && !setting.show ? 'password' : 'text'}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => handleCopy(setting.value, setting.label)}
                                                    edge="end"
                                                    title={`Copy ${setting.label}`}
                                                >
                                                    <ContentCopyIcon />
                                                </IconButton>
                                                {setting.isToken && (
                                                    <IconButton
                                                        onClick={() => setting.setShow(!setting.show)}
                                                        edge="end"
                                                        title={setting.show ? 'Hide' : 'Show'}
                                                    >
                                                        {setting.show ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                )}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Box>

            <center>
                <Box sx={{ mt: 10 }}>
                    <HomeIcon fontSize='large' />
                    <MemoryIcon fontSize='large' />
                    <AppRegistrationIcon fontSize='large' />
                    <SettingsIcon fontSize='large' />
                </Box>
            </center>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Settings;