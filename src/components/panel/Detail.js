import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useAuth } from '../../context';
import '../../style/Devices.css';

const svr = window.location;
let rootURL = window.runtime.API_URL_ROOT || svr.protocol+'//'+svr.hostname+':2009';

const Detail = (props) => {
    const { token } = useAuth();
    const [showDialog, setShowDialog] = useState(false);
    const [devicePassword, setDevicePassword] = useState('');

    const { devId, devDesc, type, devMaker, 
            devModel, devSerial, devHwVer, devFwVer } = props.chosenDevice;
    const [ toFix, setToFix ] = useState(props.chosenDevice.toFix)

    const getPassword = (pw) => {
        if (pw === '') {
            //generate the pw
            return Math.random().toString(36).slice(2, 10);
        } else {
            return pw;
        }
    }

    const handleSubmit = () => {

        fetch(rootURL + `/devices/${devId}/update`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token },
            body: JSON.stringify({
                "password": devicePassword,
            })
        }).then((response) => {
            if (response.status === 200) {
                alert(`
                    device "(${devId})" fixed,
                    the password is "${devicePassword}".
                    please take the password,
                    since it's not possible to see later.`);
                setToFix(undefined);
                props.chosenDevice.toFix = undefined;
                return response.json();
            } else if (response.status === 422){
                alert('please check the data');
                return [];
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div>
            <h1>Device Information : </h1>
            <Box m={2} >
                <TextField InputProps={{readOnly: true,}} sx={{ boxShadow: 3 }} value={devId} label="Device Id" variant="filled" />
                <TextField InputProps={{readOnly: true,}} sx={{ boxShadow: 3 }} value={type} label="Device Type" variant="filled" />
            </Box> 
            
            <Box m={2}>
                <TextField InputProps={{readOnly: true,}} value={devDesc||''} label="Description" multiline rows={3}  style={{width:'100%'}}/>
            </Box>
            
            <Box m={2} >
                <TextField InputProps={{readOnly: true,}} sx={{ boxShadow: 3 }} value={devMaker||''} label="Manufacturer" variant="filled" />
                <TextField InputProps={{readOnly: true,}} sx={{ boxShadow: 3 }} value={devSerial||''} label="Hardware Version" variant="filled" />
            </Box> 
            <Box m={2}>
                <TextField InputProps={{readOnly: true,}} sx={{ boxShadow: 3 }} value={devModel||''} label="Model" variant="filled" />
                <TextField InputProps={{readOnly: true,}} sx={{ boxShadow: 3 }} value={devHwVer||''} label="Hardware Version" variant="filled" />
            </Box>
            <Box m={2}>
                <TextField InputProps={{readOnly: true,}} sx={{ boxShadow: 3 }} value={devFwVer||''} label="Firmware Version" variant="filled" />
            </Box>

            {/* Fix It button - positioned at bottom */}
            {toFix && (
                <Box m={2} display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                    <span style={{ color: 'red', fontWeight: 'bold' }}>
                        This device needs fixed
                    </span>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => setShowDialog(true)}
                    >
                        Fix It
                    </Button>
                </Box>
            )}

            {/* Dialog */}
            <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Enter New Token</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Token"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={devicePassword}
                        onChange={(e) => setDevicePassword(e.target.value)}
                        placeholder="Token"
                    />
                    <center>
                        <p style={{ color: 'red', fontWeight: 'bold' }}>
                            ⚠️ Important:<br/><br/>
                            Copy and save this token now.<br/>
                            It cannot be retrieved later.
                        </p>
                    </center>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => {
                            setShowDialog(false);
                            setDevicePassword('');
                        }}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => {
                            handleSubmit();
                            console.log(devicePassword);
                            setShowDialog(false);
                            setDevicePassword('');
                        }}
                        disabled={!devicePassword.trim()}
                        variant="contained"
                        color="primary"
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Detail;