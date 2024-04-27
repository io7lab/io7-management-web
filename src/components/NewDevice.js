import React, { useEffect }  from 'react';
import Form from "react-bootstrap/Form";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Cookies } from 'react-cookie';

const svr = window.location;
let rootURL = window.runtime.API_URL_ROOT || svr.protocol+'//'+svr.hostname+':2009';

const NewDevice = (props) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const {setChosenDevice, setAdded, setNewDev} = props;
    const [deviceType, setDeviceType] = React.useState('device');

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

        fetch(rootURL + '/devices', {
            method: 'post',
            headers: { "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token },
            body: JSON.stringify({
                "devId": event.target.devId.value,
                "devDesc": event.target.devDesc.value,
                "createdBy": 'admin',
                "type": deviceType,
                "createdDate": new Date(),
                "password": pw,
                "devMaker": event.target.devMaker.value,
                "devModel": event.target.devModel.value,
                "devSerial": event.target.devSerial.value,
                "devHwVer": event.target.devHwVer.value,
                "devFwVer": event.target.devFwVer.value
            })
        }).then((response) => {
            if (response.status === 200) {
                alert(`
                    device "(${event.target.devId.value})" created,
                    the password is "${pw}".
                    please take the password,
                    since it's not possible to see later.`);
                setAdded(true);
                setNewDev(false);
                setChosenDevice(undefined);
                return response.json();
            } else if (response.status === 409){
                alert(`the Device or App Id "${event.target.devId.value}" exists.`);
                return [];
            } else if (response.status === 422){
                alert('please check the data');
                return [];
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    let handleTypeChange = (event) => {
        setDeviceType(event.target.value);
    };

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
        {setClick2List('side-Devices')}
        <h1>New Device</h1>
        <Box mt={10} display="flex" justifyContent="center">
            <Form onSubmit={handleSubmit}>
                <Box m={2}>
                    <TextField sx={{ boxShadow: 3 }} required id="devId" label="Device Id" variant="filled" />
                    <TextField sx={{ boxShadow: 3 }} id="password" label="Token" variant="filled" />
                </Box>
                <Box m={2}>
                    Device Type :
                    <Select
                        id="deviceType"
                        value={deviceType}
                        label="Type"
                        onChange={handleTypeChange}
                    >
                        <MenuItem value='device'>Device</MenuItem>
                        <MenuItem value='gateway'>Gateway</MenuItem>
                    </Select>
                </Box>
                <Box m={2}>
                    <TextField id="devDesc" label="Description" multiline rows={3}  style={{width:'100%'}}/>
                </Box>
                <Box m={2}>
                    <TextField sx={{ boxShadow: 3 }} id="devMaker" label="Manufacturer" variant="filled" />
                    <TextField sx={{ boxShadow: 3 }} id="devSerial" label="Serial Number" variant="filled" />
                </Box>
                <Box m={2}>
                    <TextField sx={{ boxShadow: 3 }} id="devModel" label="Model" variant="filled" />
                    <TextField sx={{ boxShadow: 3 }} id="devHwVer" label="Hardware Version" variant="filled" />
                </Box>
                <Box m={2}>
                    <TextField sx={{ boxShadow: 3 }} id="devFwVer" label="Firmware Version" variant="filled" />
                </Box>

                <Button variant='contained' type="submit">
                    Create
                </Button>
            </Form>
        </Box>
        </>
    )
}

export default NewDevice;