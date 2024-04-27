import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Cookies } from 'react-cookie';

const svr = window.location;
let rootURL = window.runtime.API_URL_ROOT || svr.protocol+'//'+svr.hostname+':2009';

const Meta = (props) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const { devId } = props.chosenDevice;
    const { mqttClient } = props;
    const [ metaData, setMetaData ] = useState();
    const [ errMessage, setErrMessage ] = useState('');

    const handleSubmit = (event) => {
        try {
            let meta = {metadata: JSON.parse(metaData)}
            fetch(`${rootURL}/devices/update/${devId}`, {
                method: 'post',
                headers: { "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + token },
                body: JSON.stringify(meta)
            }).then((response) => {
                if (response.status === 200) {
                    setErrMessage('metadata updated.');
                }
            });
        } catch (e) {
            setErrMessage('Invalid JSON. Correct the data');
        }
    }
    
    useEffect(() => {
        mqttClient.subscribe(`iot3/${devId}/mgmt/device/meta`, {qos:0});
        function msgHandler (topic, message) {
            console.log(topic + ' : ' + message.toString());
            let meta = JSON.parse(message);
            if (meta.d && meta.d.metadata) {
                setMetaData(JSON.stringify(meta.d.metadata, null, 4));
            }
        };
        mqttClient.on('message', msgHandler);

        return () => {
            mqttClient.unsubscribe(`iot3/${devId}/mgmt/device/meta`);
            mqttClient.removeListener('message', msgHandler);
        };
    }, [])

    return (
        <>
            <h1>Device Id : {devId}</h1>
            <Box m={2}>
                <TextField variant="filled" label='Meta Data' rows='10'
                    defaultValue={metaData} multiline sx={{ width: "250%" }}
                    onChange={(event) => { setMetaData(event.target.value) }} />
            </Box>

            <Button variant='contained' onClick={(event) => handleSubmit(event)}>
                Update
            </Button>
            <h5>{errMessage}</h5>
        </>
    )
}

export default Meta;