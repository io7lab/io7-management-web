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
        <iframe srcdoc={doc} frameborder="0" marginheight="0" marginwidth="0" width="1000px" height="100%"></iframe>
    )
}

export default Home;