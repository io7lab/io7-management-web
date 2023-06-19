import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const Detail = (props) => {
    const { devId, devDesc, type, devMaker, devModel, devSerial, devHwVer, devFwVer, 
            createdBy, createdDate } = props.chosenDevice;

    return (
        <>
            <h1>Device Information : {devId}</h1>
            <Box>
                <Box m={2}>
                    <TextField InputProps={{ readOnly: true, }} variant="filled"
                        label='Description' defaultValue={devDesc} multiline maxRows={4} />
                </Box>
                <Box m={3}>
                    <TextField InputProps={{ readOnly: true, }} sx={{ boxShadow: 3 }} variant="filled"
                        label='Model' defaultValue={devModel} />
                    <TextField InputProps={{ readOnly: true, }} sx={{ boxShadow: 3 }} variant="filled"
                        label='Serial' defaultValue={devSerial} />
                    <TextField InputProps={{ readOnly: true, }} sx={{ boxShadow: 3 }} variant="filled"
                        label='Device Type' defaultValue={type} />
                </Box>
                <Box m={3}>
                    <TextField InputProps={{ readOnly: true, }} sx={{ boxShadow: 3 }} variant="filled"
                        label='Hardware Version' defaultValue={devHwVer} />
                    <TextField InputProps={{ readOnly: true, }} sx={{ boxShadow: 3 }} variant="filled"
                        label='Firmware Version' defaultValue={devFwVer} />
                    <TextField InputProps={{ readOnly: true, }} sx={{ boxShadow: 3 }} variant="filled"
                        label='Manufacturer' defaultValue={devMaker} />
                </Box>
            </Box>
        </>
    )
}

export default Detail;

