import React, {useState} from 'react';
import { Button, Box, TextField } from '@mui/material';
import * as BsIcons from 'react-icons/bs';
import { useAuth } from '../../context';

const Operation = (props) => {
    const { token, apiserver_url } = useAuth();
    const { devId } = props.chosenDevice;
    const [ fw_url, set_fw_url ] = useState('');

    const rebootDevice = (event) => {
        if(window.confirm('Do you really want to reboot the device?')) {
            fetch(`${apiserver_url}/devices/${devId}/reboot`, {
                method: 'GET',
                headers: { "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + token }
            }).then((response) => {
                if (response.status === 200) {
                    console.log('rebooting');
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    const factoryResetDevice = (event) => {
        if (window.confirm('Do you really want to factory reset the device?')) {
            if (window.confirm('The device will be factory resetted.\nAre you really sure to factory reset the device?')) {
                fetch(`${apiserver_url}/devices/${devId}/reset`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + token
                    }
                }).then((response) => {
                    if (response.status === 200) {
                        console.log('factory resetting the device');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    }

    const upgradeDevice = (event) => {
        if (window.confirm('Did you check the firmware binary\nis correct for the device?')) {
            if (window.confirm('Do you really want to upgrade the firmware?')) {
                let url = {fw_url:fw_url};
                fetch(`${apiserver_url}/devices/${devId}/upgrade`, {
                    method: 'PUT',
                    headers: { "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + token },
                    body: JSON.stringify(url)
                }).then((response) => {
                    if (response.status === 200) {
                        console.log('the device firmware will be upgraded');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    }

    return (
        <>
            <h1>Device Id : {devId}</h1>
            <Box m={2}>
                <Button startIcon={<BsIcons.BsBootstrapReboot/>} variant="contained" 
                    onClick={() => { rebootDevice() }}>Reboot</Button>
                <Button startIcon={<BsIcons.BsRecycle/>} variant="contained" 
                    onClick={() => { factoryResetDevice() }}>Factory Reset</Button>
            </Box>

            <hr />
            <Box m={2}>
                <Button startIcon={<BsIcons.BsFillCloudArrowDownFill/>} variant="contained" 
                    onClick={() => { upgradeDevice() }}>Firmware Upgrade</Button>
            </Box>
            <Box m={2}>
                <TextField label="Firmware URL" variant="filled" 
                    sx={{ boxShadow: 3, width: '250%' }}  
                    onChange={(event) => {set_fw_url(event.target.value)}} />
            </Box>
        </>
    )
}

export default Operation;