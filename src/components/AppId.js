import React, { useEffect } from 'react';
import { Button, Box , TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { Cookies } from 'react-cookie';

const svr = window.location;
let rootURL = window.runtime.API_URL_ROOT || svr.protocol+'//'+svr.hostname+':2009';

const AppId = (props) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const {appId, appDesc, createdDate} = props.chosenApp;
    const {setChosenApp, setDeleted} = props;

    const deleteAppId = (event) => {

        if(window.confirm('Do you really want to delete this App Id?')) {
            fetch(rootURL + '/app-ids/' + appId, {
                method: 'delete',
                headers: { "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + token },
            }).then((response) => {
                if (response.ok) {
                    alert(`App Id "(${appId})" deleted`);
                    setChosenApp(undefined) 
                    setDeleted(true) 
                }
                return;
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    useEffect(() => {
        return () => {
            let side_tab = document.getElementById('side-Apps');
            side_tab.removeAttribute('onClick');
        };
    }, [])

    let setClick2List = (id) => {
        let side_tab = document.getElementById(id);
        side_tab.setAttribute('onClick', 'location.reload()')
    }

    return (
        <div>
            {setClick2List('side-Apps')}
            <Box sx={{display: 'flex', justifyContent: 'space-between' }}>
                <Button startIcon={<ArrowBackIcon />}  variant="contained" onClick={() => { setChosenApp(undefined) }}>Back to List</Button>
                <Button startIcon={<DeleteIcon />} variant="contained" onClick={() => { deleteAppId() }}>Delete</Button>
            </Box>
            <hr/>
            <>
        <h1>App Id Information : {appId}</h1>
        <Box>
                <Box m={2}>
                    <TextField InputProps={{readOnly: true,}} variant="filled"
                        label='Description' defaultValue={appDesc} multiline maxRows={4} />
                </Box>
        </Box>
        </>
        </div>
    )
}

export default AppId;
