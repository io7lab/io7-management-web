import React  from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MemoryIcon from '@mui/icons-material/Memory';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';

const Home = (props) => {

    return (
        <div>
            <center>
                <h1>io7 IOT Device Platform</h1>
                <hr />
                <p>This is the device management portal of the io7 IOT Device Platform.</p>
                <hr />
                <HomeIcon fontSize='large' />
                <MemoryIcon fontSize='large' />
                <AppRegistrationIcon fontSize='large' />
                <SettingsIcon fontSize='large' />
            </center>
        </div>
    )
}

export default Home;