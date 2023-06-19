import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import "../../style/Event.css";

const Event = (props) => {
    const { devId } = props.chosenDevice;
    const { mqttClient } = props;

    useEffect(() => {
        mqttClient.subscribe(`iot3/${devId}/evt/status/fmt/json`, {qos:0});
        mqttClient.on('message', (topic, message) => {
            let eventTable = document.getElementById("eventList"); 
            let row = eventTable.insertRow(1);
            let evt = row.insertCell(0);
            let evtTime = row.insertCell(1);
            evt.innerHTML = message.toString();
            evtTime.innerHTML = (new Date()).toLocaleTimeString();
        });

        return () => {
            mqttClient.unsubscribe(`iot3/${devId}/evt/status/fmt/json`);
        };
    }, [])

    return (
        <Box>
            <h1>Device Id : {devId}</h1>
            <table id='eventList' className='event-list'>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </Box>
    )
}

export default Event;