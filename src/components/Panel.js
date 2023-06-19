import React, {useState} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';


const Panel = (props) => {
    // const {devId, devDesc, createdDate} = props.chosenDevice;
    // const token = props.token;
    const panelType = props.panelType;

    return (
        <Box sx={{
            backgroundColor: "pink",
        }}>
            {panelType}
        </Box>
    )
}

export default Panel;