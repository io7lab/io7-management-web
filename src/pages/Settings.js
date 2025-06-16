import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MemoryIcon from '@mui/icons-material/Memory';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box } from '@mui/material';


const Settings = (props) => {
    return(
        <div>
            <center>
                <h1>io7 IOT Device Platform</h1>
                <hr/>
            </center>
                <h2>Settings</h2>
                <hr />
            <center>
                <p>This is the settings page of io7 IOT Device Platform management.</p>
                <hr />
                <Box sx={{ mt: 10 }}>
                    <HomeIcon fontSize='large' />
                    <MemoryIcon fontSize='large' />
                    <AppRegistrationIcon fontSize='large' />
                    <SettingsIcon fontSize='large' />
                </Box>
            </center>
        </div>
    )
}

export default Settings;