import mqtt, { connect } from 'mqttws/dist/mqtt';

const conn_mgr = {
    connect : (broker, option) => {
        if (!mqttClient) {
            mqttClient = mqtt.connect(broker, option);
        }
        return mqttClient;
    },
    mqttClient : () => {
        return mqttClient;
    }
}

export const mqtt_options = {
    "clientId": "io7web",
    "username": "$web",
    "password": "",
    "clean_session": true,
    "tls_insecure": true,
    "rejectUnauthorized": false
}

export let mqttClient = null;
export default conn_mgr;