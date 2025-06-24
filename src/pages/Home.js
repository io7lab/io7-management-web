import React, { useEffect, useState, useRef } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MemoryIcon from '@mui/icons-material/Memory';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../context';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SchemaIcon from '@mui/icons-material/Schema';
import StorageIcon from '@mui/icons-material/Storage';
import ApiIcon from '@mui/icons-material/Api';
import { Box, Tooltip } from '@mui/material';

const svr = window.location;
let rootURL = window.runtime.API_URL_ROOT || svr.protocol+'//'+svr.hostname+':2009';

const Home = (props) => {

    const { token, logout } = useAuth();
    const [ dashboard, setDashboard ] = useState([]);
    const [ appIds, setAppIds ] = useState([]);
    const [ devices, setDevices] = useState([]);
    const windowRefs = useRef({});
    const nodered_name = 'NodeRed';
    const nodered_url = window.runtime.NODERED_URL || 'http://localhost:1880';
    const grafana_name = 'Grafana';
    const grafana_url = window.runtime.GRAFANA_URL || 'http://localhost:3003';
    const influxdb_name = 'InfluxDB';
    const influxdb_url = window.runtime.INFLUXDB_URL || 'http://localhost:8086';
    const apiserver_name = 'API Server';
    const apiserver_url = rootURL;

    useEffect(() => {
        fetch(rootURL + '/config/dashboard', {
            method: 'GET',
            headers: { "Authorization": 'Bearer ' + token },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((data) => {
            setDashboard(data.value);
        }).catch((err) => {
            console.log(err);
        });

    }, []);
    
    useEffect(() => {
        fetch(rootURL + '/devices/', {
            method: 'GET',
            headers: { "Authorization": 'Bearer ' + token },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                logout();
            }
        }).then((data) => {
            setDevices(data);
        }).catch((err) => {
            console.log(err);
        });

    }, []);

    const deviceRows = devices.map((d) => (
        {
            id: d.devId,
            devDesc: d.devDesc,
            type: d.type,
            createdDate: d.createdDate
        }
    ));

    useEffect(() => {
        fetch(rootURL + '/app-ids/', {
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

    }, []);
    
    const appRows = appIds.map((app) => (
        {
            id: app.appId,
            createdDate: app.createdDate,
            appDesc: app.appDesc
        }
    ));

    const launchConsole = (name, url) => {
        const windowName = name;

        let winRef = windowRefs.current[windowName];

        if (winRef && !winRef.closed) {
            winRef.focus();
            return;
        }

        winRef = window.open(url, windowName);
        if (winRef) {
            windowRefs.current[windowName] = winRef;
            winRef.focus();
        }
    };

    return (
        <div style={{ height: '100%', marginLeft: '5%', overflowY: 'hidden' }}>
            <center>
                <h1>io7 IOT Device Platform</h1>
                <Box sx={{ color: '#1a237e', display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <Tooltip title={nodered_name}><SchemaIcon fontSize='large'
                        onClick={() => launchConsole(nodered_name, nodered_url)} 
                        sx={{ cursor: 'pointer' }} onMouseUp={(e) => e.stopPropagation()}
                    /></Tooltip> 
                    <Tooltip title={grafana_name}><AutoGraphIcon fontSize='large' 
                        onClick={() => launchConsole(grafana_name, grafana_url)} 
                        sx={{ cursor: 'pointer' }} onMouseUp={(e) => e.stopPropagation()}
                    /></Tooltip>
                    <Tooltip title={influxdb_name}><StorageIcon fontSize='large'
                        onClick={() => launchConsole(influxdb_name, influxdb_url)} 
                        sx={{ cursor: 'pointer' }} onMouseUp={(e) => e.stopPropagation()}
                    /></Tooltip>
                    <Tooltip title={apiserver_name}><ApiIcon fontSize='large'
                        onClick={() => launchConsole(apiserver_name, apiserver_url)} 
                        sx={{ cursor: 'pointer' }} onMouseUp={(e) => e.stopPropagation()}
                    /></Tooltip>
                </Box>
                <hr/>
                <iframe
                    src={dashboard}
                    width="80%" height="450" frameBorder="0" />
                <hr />

                <div>
                    <h1>App Id List</h1>
                    <TableContainer sx={{ width: '85%' }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>App Id</b></TableCell>
                                    <TableCell><b>Description</b></TableCell>
                                    <TableCell><b>Created Date</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appRows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.appDesc}</TableCell>
                                        <TableCell>{row.createdDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div>
                    <h1>Device List</h1>
                    <TableContainer sx={{ width: '85%' }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Device Id</b></TableCell>
                                    <TableCell><b>Description</b></TableCell>
                                    <TableCell><b>Device Type</b></TableCell>
                                    <TableCell><b>Created Date</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deviceRows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.devDesc}</TableCell>
                                        <TableCell>{row.type}</TableCell>
                                        <TableCell>{row.createdDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </center>

        </div>
    )
}

export default Home;