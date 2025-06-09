import React, { useEffect, useState } from 'react';
import { Button, Box, TextField, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Typography, Checkbox, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../context';

const svr = window.location;
let rootURL = window.runtime.API_URL_ROOT || svr.protocol+'//'+svr.hostname+':2009';

const AppId = (props) => {
    const { token } = useAuth();
    const { appId, appDesc, restricted } = props.chosenApp;
    const { setChosenApp, setDeleted } = props;
    // State for members list
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // State for edit functionality
    const [isEditing, setIsEditing] = useState(false);
    const [allDevices, setAllDevices] = useState([]);
    const [editableMembers, setEditableMembers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [saving, setSaving] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [reviewMembers, setReviewMembers] = useState([]);

    const deleteAppId = (event) => {

        if(window.confirm('Do you really want to delete this App Id?')) {
            fetch(rootURL + '/app-ids/' + appId, {
                method: 'DELETE',
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

    // Function to fetch members for restricted app IDs
    const fetchMembers = async () => {
        if (!restricted) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${rootURL}/app-ids/${appId}/members`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch members: ${response.status}`);
            }
            
            const data = await response.json();
            const membersList = data.members || data;
            setMembers(membersList);
        } catch (err) {
            console.error('Error fetching members:', err);
            setError('Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch all devices
    const fetchAllDevices = async () => {
        try {
            const response = await fetch(`${rootURL}/devices`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch devices: ${response.status}`);
            }
            
            const data = await response.json();
            const allDevices = data.devices || data;
            const filteredDevices = allDevices.filter(device => 
                device.type === 'device' || device.type === 'edge'
            );
            
            return filteredDevices;
        } catch (err) {
            console.error('Error fetching all devices:', err);
            throw err;
        }
    };

    // Function to handle edit mode
    const handleEdit = async () => {
        try {
            setLoading(true);
            const devices = await fetchAllDevices();
            setAllDevices(devices);
            
            // Create editable members list by merging all devices with current members
            const editableList = devices.map(device => {
                const existingMember = members.find(member => member.devId === device.devId);
                
                return {
                    devId: device.devId,
                    description: device.devDesc || device.description || '',
                    manufacturer: device.devMaker || device.manufacturer || '',
                    model: device.devModel,
                    evt: existingMember ? existingMember.evt : false,
                    cmd: existingMember ? existingMember.cmd : false
                };
            });
            
            setEditableMembers(editableList);
            setIsEditing(true);
            setSearchText('');
        } catch (err) {
            console.error("Error in handleEdit:", err);
            setError('Failed to load devices for editing');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle save
    const handleSave = async () => {
        try {
            setSaving(true);
            
            // Filter only devices that have either evt or cmd enabled
            const activeMembers = editableMembers.filter(member => member.evt || member.cmd);
            
            const response = await fetch(`${rootURL}/app-ids/${appId}/updateMembers`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token
                },
                body: JSON.stringify( activeMembers )
            });
            
            if (!response.ok) {
                throw new Error(`Failed to save members: ${response.status}`);
            }
            
            // Refresh the members list
            await fetchMembers();
            setIsEditing(false);
            setSearchText('');
            alert('Members saved successfully');
        } catch (err) {
            console.error('Error saving members:', err);
            setError('Failed to save members');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveClick = () => {
        const activeMembers = editableMembers.filter(member => member.evt || member.cmd);
        setReviewMembers(activeMembers);
        setShowConfirmation(true);
    };

    const confirmSave = async () => {
        try {
            setSaving(true);
            // The body should be the reviewMembers, not activeMembers from editableMembers
            const response = await fetch(`${rootURL}/app-ids/${appId}/updateMembers`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token
                },
                body: JSON.stringify(reviewMembers) // Use reviewMembers here
            });

            if (!response.ok) {
                throw new Error(`Failed to save members: ${response.status}`);
            }

            alert('Members saved successfully');
            await fetchMembers();
            setIsEditing(false);
            setSearchText('');
        } catch (err) {
            console.error('Error saving members:', err);
            setError('Failed to save members');
        } finally {
            setSaving(false);
            setShowConfirmation(false); // Close confirmation dialog
        }
    };

    // Function to handle cancel edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setSearchText('');
        setEditableMembers([]);
    };

    // Function to handle checkbox changes in edit mode
    const handleCheckboxChange = (devId, field, checked) => {
        setEditableMembers(prev => 
            prev.map(member => 
                member.devId === devId 
                    ? { ...member, [field]: checked }
                    : member
            )
        );
    };

    // Function to filter devices based on search text
    const getFilteredDevices = () => {
        if (!searchText) {
            const result = isEditing ? editableMembers : members;
            return result;
        }

        const searchLower = searchText.toLowerCase();
        const devicesToFilter = isEditing ? editableMembers : members;

        const filteredResult = devicesToFilter.filter(device => {

            return (
                device.devId?.toLowerCase().includes(searchLower) ||
                device.description?.toLowerCase().includes(searchLower) ||
                device.manufacturer?.toLowerCase().includes(searchLower) ||
                device.model?.toLowerCase().includes(searchLower)
            );
        });

        return filteredResult;
    };

    useEffect(() => {
        if (restricted) {
            fetchMembers();
        }
        
        return () => {
            let side_tab = document.getElementById('side-Apps');
            if (side_tab && typeof side_tab.removeAttribute === 'function') {
                side_tab.removeAttribute('onClick');
            }
        };
    }, [appId, restricted, token])

    let setClick2List = (id) => {
        let side_tab = document.getElementById(id);
        side_tab.setAttribute('onClick', 'location.reload()')
    }

    return (
        <div>
            <div>
                {setClick2List('side-Apps')}
                <Box sx={{display: 'flex', justifyContent: 'space-between' }}>
                    <Button startIcon={<ArrowBackIcon />}  variant="contained" onClick={() => { setChosenApp(undefined) }}>Back to List</Button>
                    <Button startIcon={<DeleteIcon />} variant="contained" onClick={() => { deleteAppId() }}>Delete</Button>
                </Box>
                <hr/>
            </div>
            <div className='app-container'>
                <h1>App Id Information : {appId}</h1>
                <Box m={2} >
                    <TextField InputProps={{readOnly: true,}} sx={{ boxShadow: 3 }} value={appId} label="Application Id" variant="filled" />
                    <TextField InputProps={{readOnly: true,}} sx={{ boxShadow: 3 }} 
                        value={restricted ? 'Restricted': 'All Devices'} label="Device Access" variant="filled" />
                </Box> 
                <Box m={2}>
                    <TextField InputProps={{readOnly: true,}} value={appDesc} label="Description" multiline rows={3}  
                        style={{width:'390px'}}/>
                </Box>
                
                {/* Display members list for restricted app IDs */}
                {restricted && (
                    <Box m={2} style={{width:'390px'}}>
                        <Typography variant="h6" gutterBottom>
                            Member Devices
                        </Typography>
                        
                        {/* Search field - only show in edit mode */}
                        {isEditing && (
                            <Box mb={2}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search devices by ID, description, or manufacturer..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    variant="outlined"
                                />
                            </Box>
                        )}
                        
                        {loading && (
                            <Box display="flex" justifyContent="center" p={2}>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                        
                        {error && (
                            <Typography color="error">{error}</Typography>
                        )}
                        
                        {!loading && !error && (() => {
                            const filteredDevices = getFilteredDevices();
                            return (
                                <>
                                    <TableContainer component={Paper} elevation={2}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{width: '50%'}}><strong>Device</strong></TableCell>
                                                    <TableCell align="center" style={{width: '25%'}}><strong>Event</strong></TableCell>
                                                    <TableCell align="center" style={{width: '25%'}}><strong>Command</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredDevices.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={3} align="center">
                                                            {isEditing ? 'No devices found' : 'No authorized devices found'}
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredDevices.map((device, index) => (
                                                        <TableRow key={device.devId || index}>
                                                            <TableCell>
                                                                <Box>
                                                                    <Typography variant="body2" fontWeight="bold">
                                                                        {device.devId}
                                                                    </Typography>
                                                                    {device.description && (
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {device.description}
                                                                        </Typography>
                                                                    )}
                                                                    {device.manufacturer && (
                                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                                            {device.manufacturer}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Checkbox 
                                                                    checked={Boolean(device.evt)} 
                                                                    disabled={!isEditing}
                                                                    size="small"
                                                                    onChange={(e) => isEditing && handleCheckboxChange(device.devId, 'evt', e.target.checked)}
                                                                    sx={{
                                                                        color: device.evt ? '#1976d2' : '#d32f2f',
                                                                        '&.Mui-checked': {
                                                                            color: '#1976d2',
                                                                        },
                                                                        '&.Mui-disabled': {
                                                                            color: device.evt ? '#1976d2' : '#d32f2f',
                                                                        }
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Checkbox 
                                                                    checked={Boolean(device.cmd)} 
                                                                    disabled={!isEditing}
                                                                    size="small"
                                                                    onChange={(e) => isEditing && handleCheckboxChange(device.devId, 'cmd', e.target.checked)}
                                                                    sx={{
                                                                        color: device.cmd ? '#1976d2' : '#d32f2f',
                                                                        '&.Mui-checked': {
                                                                            color: '#1976d2',
                                                                        },
                                                                        '&.Mui-disabled': {
                                                                            color: device.cmd ? '#1976d2' : '#d32f2f',
                                                                        }
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    
                                    {/* Edit/Save/Cancel buttons */}
                                    <Box mt={2} display="flex" gap={1}>
                                        {!isEditing ? (
                                            <Button
                                                variant="contained"
                                                startIcon={<EditIcon />}
                                                onClick={handleEdit}
                                                disabled={loading}
                                            >
                                                Edit
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<SaveIcon />}
                                                    onClick={handleSaveClick}
                                                    disabled={saving}
                                                >
                                                    {saving ? 'Saving...' : 'Save'}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<CancelIcon />}
                                                    onClick={handleCancelEdit}
                                                    disabled={saving}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </>
                            );
                        })()}
                    </Box>
                )}
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)} fullWidth maxWidth="sm">
                <DialogTitle>Review Changes</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" gutterBottom>
                        The following changes will be saved:
                    </Typography>
                    <TableContainer component={Paper} elevation={2}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width: '50%'}}><strong>Device</strong></TableCell>
                                    <TableCell align="center" style={{width: '25%'}}><strong>Event</strong></TableCell>
                                    <TableCell align="center" style={{width: '25%'}}><strong>Command</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reviewMembers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            No devices selected for changes.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reviewMembers.map((member, index) => (
                                        <TableRow key={member.devId || index}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {member.devId}
                                                </Typography>
                                                {/* Optionally display description/manufacturer if available in reviewMembers */}
                                                {/* {member.description && <Typography variant="caption" color="text.secondary">{member.description}</Typography>} */}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={Boolean(member.evt)}
                                                    disabled // Checkboxes in review are not interactive
                                                    size="small"
                                                    sx={{
                                                        color: member.evt ? '#1976d2' : '#d32f2f',
                                                        '&.Mui-disabled': { // Ensure color is maintained when disabled
                                                            color: member.evt ? '#1976d2' : '#d32f2f',
                                                            opacity: 1 // Keep full opacity
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={Boolean(member.cmd)}
                                                    disabled // Checkboxes in review are not interactive
                                                    size="small"
                                                    sx={{
                                                        color: member.cmd ? '#1976d2' : '#d32f2f',
                                                        '&.Mui-disabled': { // Ensure color is maintained when disabled
                                                            color: member.cmd ? '#1976d2' : '#d32f2f',
                                                            opacity: 1 // Keep full opacity
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <Button onClick={confirmSave} color="primary" variant="contained" disabled={saving}>
                        {saving ? 'Saving...' : 'Confirm'}
                    </Button>
                    <Button onClick={() => setShowConfirmation(false)} color="secondary" variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AppId;