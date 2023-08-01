import React from "react";
import Form from "react-bootstrap/Form";
import Button from '@mui/material/Button';
import { Cookies } from 'react-cookie';

import "../style/Login.css";
const svr = window.location;
let rootURL = window.runtime.API_URL_ROOT || svr.protocol+'//'+svr.hostname+':2009';

const Login = (props) => {

    const { setToken } = props;
    const cookies = new Cookies();

    function set_window_runtime_variables(email, token) {
        fetch(rootURL + '/users/wsmqaccess/?user=' + email, 
        {
            method: 'get',
            headers: { "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token },
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                alert('failed to get the MQTT over WebSocket access information');
            }
        }).then((data) => {
            window.runtime.mqtt_options = {
                    "username": data.username,
                    "password": data.password,
                    "clean_session": true,
                    "tls_insecure": true,
                    "rejectUnauthorized": false
            }
            return;
        })
        .catch((err) => {
            console.log(err);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        fetch(rootURL + '/users/login',
            {
                method: 'post',
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({
                    "email": event.target.email.value,
                    "password": event.target.password.value
                })
            })
            .then((result) => result.json())
            .then((data) => {
                if (data.access_token === undefined) {
                    console.log('login failed');
                } else {
                    console.log('login succeeded');
                    cookies.set('token', data.access_token);
                    setToken(data.access_token);
                    set_window_runtime_variables(event.target.email.value, data.access_token);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="Login-Container">
            <div className="Login">
                <Form className="Login-Form" onSubmit={handleSubmit}>
                    <div className="Login-Email">
                        <label className="Label" htmlFor="email">Email</label>
                        <input className="Input" type="email" id="email" />
                    </div>
                    <div className="Login-Password">
                        <label className="Label" htmlFor="password">Password</label>
                        <input className="Input" type="password" id="password" />
                    </div>
                    <Button variant="contained" size="medium" type="submit">
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Login;