import React, { useEffect, useState, useRef } from 'react';
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

const Home = (props) => {

    const { token, logout, influxdb_url, nodered_url, grafana_url, apiserver_url, dashboard_url,
        setGrafana_url, setNodered_url, setInfluxdb_url, get_config, svr } = useAuth();

    const [ appIds, setAppIds ] = useState([]);
    const [ devices, setDevices] = useState([]);
    const [ mdashboard, setMDashboard ] = useState();
    const windowRefs = useRef({});
    const nodered_name = 'NodeRed';
    const grafana_name = 'Grafana';
    const influxdb_name = 'InfluxDB';
    const apiserver_name = 'API Server';
    
    useEffect(() => {
        fetch(apiserver_url + '/devices/', {
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

        setNodered_url(nodered_url || `${svr.protocol}//${svr.hostname}:1880`);
        setInfluxdb_url(influxdb_url || `${svr.protocol}//${svr.hostname}:8086`);
        setGrafana_url(grafana_url || `${svr.protocol}//${svr.hostname}:3003`);
    }, []);

    useEffect(() => {
        if (dashboard_url && grafana_url) {
            setMDashboard(grafana_url + (new URL(dashboard_url)).pathname);
        }
    }, [dashboard_url]);

    const deviceRows = devices.map((d) => (
        {
            id: d.devId,
            devDesc: d.devDesc,
            type: d.type,
            createdDate: d.createdDate
        }
    ));

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
                <hr/>
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
                    src={mdashboard}
                    width="85%" height="450" frameBorder="0" />
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