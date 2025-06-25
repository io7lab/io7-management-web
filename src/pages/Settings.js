import React, { useState, useEffect } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MemoryIcon from '@mui/icons-material/Memory';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
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
    const { influxdb_url, nodered_url, grafana_url, apiserver_url, logout,
        dashboard_url, gf_token, influxdb_token, token, get_config } = useAuth();
    
    const [ showGfToken, setShowGfToken ] = useState(false);
    const [ showInfluxToken, setShowInfluxToken ] = useState(false);
    const [ snackbarOpen, setSnackbarOpen ] = useState(false);
    const [ snackbarMessage, setSnackbarMessage ] = useState('');
    const [ monitored, setMonitored ] = useState();
    const [ fieldsets, setFieldsets ] = useState();
    const [ isEditingMonitored, setIsEditingMonitored ] = useState(false);
    const [ monitoredValue, setMonitoredValue ] = useState('');
    const [ isEditingFieldsets, setIsEditingFieldsets ] = useState(false);
    const [ fieldsetsValue, setFieldsetsValue ] = useState('');

    useEffect(() => {
        get_config('monitored_devices', (value) => {
            setMonitored(value);
            setMonitoredValue(value || '');
        }, token);
        get_config('monitored_fieldsets', (value) => {
            setFieldsets(value);
            setFieldsetsValue(value || '');
        }, token);
    }, []);

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

    const handleEditMonitored = () => {
        setIsEditingMonitored(true);
    };

    const handleSaveMonitored = () => {
        if (monitoredValue !== monitored) {

            fetch(apiserver_url + '/config/monitored_devices', {
                method: 'POST',
                headers: { "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + token },
                body: JSON.stringify({
                    "devices": monitoredValue
                })
            }).then((response) => {
                if (response.status === 200) {
                    setSnackbarMessage(`New monitored devices value: ${monitoredValue}`);
                    setSnackbarOpen(true);
                } else if (response.status === 422){
                    alert('please check the data');
                    return [];
                }
            }).catch((err) => {
                console.log(err);
            });
        }
        setMonitored(monitoredValue);
        setIsEditingMonitored(false);
    };

    const handleMonitoredChange = (event) => {
        setMonitoredValue(event.target.value);
    };

    const handleCancelMonitored = () => {
        setMonitoredValue(monitored || '');
        setIsEditingMonitored(false);
    };

    const handleEditFieldsets = () => {
        setIsEditingFieldsets(true);
    };

    const handleSaveFieldsets = () => {
        if (fieldsetsValue !== fieldsets) {
            fetch(apiserver_url + '/config/monitored_fieldsets', {
                method: 'POST',
                headers: { "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + token },
                body: JSON.stringify({
                    "fieldsets": fieldsetsValue
                })
            }).then((response) => {
                if (response.status === 200) {
                    setSnackbarMessage(`New monitored fieldsets value: ${fieldsetsValue}`);
                    setSnackbarOpen(true);
                } else if (response.status === 422){
                    alert('please check the data');
                    return [];
                }
            }).catch((err) => {
                console.log(err);
            });
        }
        setFieldsets(fieldsetsValue);
        setIsEditingFieldsets(false);
    };

    const handleFieldsetsChange = (event) => {
        setFieldsetsValue(event.target.value);
    };

    const handleCancelFieldsets = () => {
        setFieldsetsValue(fieldsets || '');
        setIsEditingFieldsets(false);
    };

    const handleKeyDown = (event, setting) => {
        if (event.key === 'Enter' && setting.isEditable && setting.isEditing) {
            event.preventDefault();
            setting.onSave();
        }
    };

    const settings = [
        { label: 'InfluxDB URL', value: influxdb_url, isToken: false },
        { label: 'Node-RED URL', value: nodered_url, isToken: false },
        { label: 'Grafana URL', value: grafana_url, isToken: false },
        { label: 'API Server URL', value: apiserver_url, isToken: false },
        { label: 'Dashboard URL', value: dashboard_url, isToken: false },
        { label: 'Grafana Token', value: gf_token, isToken: true, show: showGfToken, setShow: setShowGfToken },
        { label: 'InfluxDB Token', value: influxdb_token, isToken: true, show: showInfluxToken, setShow: setShowInfluxToken },
        { 
            label: 'Monitored Devices', 
            value: isEditingMonitored ? monitoredValue : monitored, 
            isToken: false, 
            isEditable: true,
            isEditing: isEditingMonitored,
            onChange: handleMonitoredChange,
            onEdit: handleEditMonitored,
            onSave: handleSaveMonitored,
            onCancel: handleCancelMonitored
        },
        { 
            label: 'Monitored Fieldsets', 
            value: isEditingFieldsets ? fieldsetsValue : fieldsets, 
            isToken: false, 
            isEditable: true,
            isEditing: isEditingFieldsets,
            onChange: handleFieldsetsChange,
            onEdit: handleEditFieldsets,
            onSave: handleSaveFieldsets,
            onCancel: handleCancelFieldsets
        },
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
                                    onChange={setting.isEditable ? setting.onChange : undefined}
                                    onKeyDown={(event) => handleKeyDown(event, setting)}
                                    InputProps={{
                                        readOnly: !setting.isEditable || !setting.isEditing,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {setting.isToken && (
                                                    <IconButton
                                                        onClick={() => setting.setShow(!setting.show)}
                                                        edge="end"
                                                        title={setting.show ? 'Hide' : 'Show'}
                                                    >
                                                        {setting.show ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                )}
                                                {setting.isEditable && (
                                                    <>
                                                        <IconButton
                                                            onClick={setting.isEditing ? setting.onSave : setting.onEdit}
                                                            edge="end"
                                                            title={setting.isEditing ? 'Save' : 'Edit'}
                                                        >
                                                            {setting.isEditing ? <SaveIcon /> : <EditIcon />}
                                                        </IconButton>
                                                        {setting.isEditing && (
                                                            <IconButton
                                                                onClick={setting.onCancel}
                                                                edge="end"
                                                                title="Cancel"
                                                            >
                                                                <CancelIcon />
                                                            </IconButton>
                                                        )}
                                                    </>
                                                )}
                                                <IconButton
                                                    onClick={() => handleCopy(setting.value, setting.label)}
                                                    edge="end"
                                                    title={`Copy ${setting.label}`}
                                                >
                                                    <ContentCopyIcon />
                                                </IconButton>
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