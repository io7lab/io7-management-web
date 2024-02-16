import mqtt, { connect } from 'mqtt';

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

export let mqttClient = null;
export default conn_mgr;