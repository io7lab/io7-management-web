import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAuth } from '../context';

import AppId from '../components/AppId'
import NewAppId from '../components/NewAppId'
import "../style/AppId.css";

const AppIds = () => {
    const { token, logout, apiserver_url } = useAuth();
    const [appIds, setAppIds] = useState([]);
    const [deleted, setDeleted] = useState(false);
    const [added, setAdded] = useState(false);
    const [newApp, setNewApp] = useState(false);
    const [chosenApp, setChosenApp] = useState(undefined);

    useEffect(() => {
        fetch(apiserver_url + '/app-ids/', {
            method: 'GET',
            headers: { "Authorization": 'Bearer ' + token },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                logout();
            }
        }).then((data) => {
            setAppIds(data);
        }).catch((err) => {
            console.log(err);
        });

        setAdded(false);
        setDeleted(false);
    }, [deleted, added]);
    
    const rows = appIds.map((app) => (
        {
            id: app.appId,
            createdDate: app.createdDate,
            appDesc: app.appDesc,
            navigate: <IconButton onClick={()=>setChosenApp(app)} onMouseUp={(e) => e.stopPropagation()}>
                <AppRegistrationIcon className={app.toFix ? 'blink-red-icon' : 'blue-icon'} />
            </IconButton>
        }
    ));

    return (
        <div>
            {chosenApp ?
                (
                    <AppId chosenApp={chosenApp} setDeleted={setDeleted} setChosenApp={setChosenApp} />
                ) : (
                    <div>
                        {newApp && <NewAppId setNewApp={setNewApp} setAdded={setAdded} setChosenApp={setChosenApp} />}
                        {!newApp && <>
                            <div className='newAppTitle'>
                                <h1>App Id List</h1>
                                <Button startIcon={<AppRegistrationIcon/>} sx={{ height: '36.5px' }} size="medium" variant="contained" onClick={()=>{setNewApp(true)}}>New App Id</Button>
                            </div>
                            <TableContainer sx={{ height: 700, width: '100%' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>App Id</b></TableCell>
                                            <TableCell><b>Description</b></TableCell>
                                            <TableCell><b>Created Date</b></TableCell>
                                            <TableCell><b>Detail</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.appDesc}</TableCell>
                                                <TableCell>{row.createdDate}</TableCell>
                                                <TableCell>{row.navigate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>}
                    </div>
                )}
        </div>
    )
}

export default AppIds;