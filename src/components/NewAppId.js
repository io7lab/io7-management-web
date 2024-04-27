import React, { useEffect }  from 'react';
import Form from "react-bootstrap/Form";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Cookies } from 'react-cookie';

const svr = window.location;
let rootURL = window.runtime.API_URL_ROOT || svr.protocol+'//'+svr.hostname+':2009';

const NewAppId = (props) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const {setChosenApp, setAdded, setNewApp} = props;

    const getPassword = (pw) => {
        if (pw === '') {
            //generate the pw
            return Math.random().toString(36).slice(2, 10);
        } else {
            return pw;
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        let pw = getPassword(event.target.password.value);

        fetch(rootURL + '/app-ids', {
            method: 'post',
            headers: { "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token },
            body: JSON.stringify({
                "appId": event.target.appId.value,
                "appDesc": event.target.appDesc.value,
                "createdDate": new Date(),
                "password": pw
            })
        }).then((response) => {
            if (response.status === 200) {
                alert(`
                    App Id "(${event.target.appId.value})" created,
                    the password is "${pw}".
                    please take the password,
                    since it's not possible to see later.`);
                setAdded(true);
                setNewApp(false);
                setChosenApp(undefined);
                return response.json();
            } else if (response.status === 409){
                alert(`the App Id or Device "${event.target.appId.value}" exists.`);
                return [];
            } else if (response.status === 422){
                alert('please check the data');
                return [];
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        return () => {
            let side_tab = document.getElementById('side-Devices');
            side_tab.removeAttribute('onClick');
        };
    }, [])

    let setClick2List = (id) => {
        let side_tab = document.getElementById(id);
        side_tab.setAttribute('onClick', 'location.reload()')
    }

    return (
        <>
            {setClick2List('side-Apps')}
            <h1>New App Id</h1>
            <Box mt={10} display="flex" justifyContent="center">
                <Form onSubmit={handleSubmit}>
                    <Box m={2}>
                        <TextField sx={{ boxShadow: 3 }} required id="appId" label="App Id" variant="filled" />
                        <TextField sx={{ boxShadow: 3 }} id="password" label="Token" variant="filled" />
                    </Box>
                    <Box m={2}>
                        <TextField id="appDesc" label="Description" multiline rows={3}  style={{width:'100%'}} />
                    </Box>

                    <Button variant='contained' type="submit">
                        Create
                    </Button>
                </Form>
            </Box>
        </>
    )
}

export default NewAppId;