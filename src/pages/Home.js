import React, {useState, useEffect} from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MemoryIcon from '@mui/icons-material/Memory';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';

const Home = (props) => {
    const [doc, setDoc] = useState();

    useEffect(() => {
        let url = 'https://raw.githubusercontent.com/io7lab/io7-platform-cloud/main/doc/io7intro.html';

        fetch(url, {
            method: 'GET'
        }).then((response) => {
            return response.text();
        }).then((txt) => {
            setDoc(txt);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <div style={{height:'100%',marginLeft:'5%', overflowY:'hidden'}}>
            <center>
                <h1>io7 IOT Device Platform</h1><hr/>
            </center>
            <iframe srcDoc={doc} title='io7doc' style={{ margin: 'auto', display: 'block' }} width="80%" height="87%">
            </iframe>
            <center>
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