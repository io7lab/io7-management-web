import React, {useState, useEffect} from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MemoryIcon from '@mui/icons-material/Memory';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';

const Home = (props) => {
    const [doc, setDoc] = useState();

    useEffect(() => {
        let url = '/io7intro.html';

        fetch(url, {
            method: 'get'
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
            <iframe srcdoc={doc} title='io7doc' frameborder="0" style={{margin:'auto', display:'block'}} marginheight="0" marginwidth="0" width="80%" height="87%"></iframe>
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