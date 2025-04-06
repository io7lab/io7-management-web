import React, { createContext, useState, useContext } from 'react';
import MQTTClient from '../services/MQTTService';

// Create MQTT context
const MQTTContext = createContext();

// Custom hook for using the MQTT context
export const useMQTT = () => {
  return useContext(MQTTContext);
};

// Provider component that wraps the app and makes MQTT client available
export const MQTTProvider = ({ children }) => {
  const [mqttClient, setMqttClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Connect to MQTT broker
  const connect = (brokerUrl, options = {}) => {
    try {
      const client = new MQTTClient(brokerUrl, options);
      
      client.onConnect(() => {
        setIsConnected(true);
        setConnectionError(null);
      });
      
      client.onError((err) => {
        setConnectionError(err.message);
        setIsConnected(false);
      });
      
      client.onDisconnect(() => {
        setIsConnected(false);
      });
      
      setMqttClient(client);
      return client;
    } catch (error) {
      setConnectionError(error.message);
      return null;
    }
  };

  // Disconnect from MQTT broker
  const disconnect = () => {
    if (mqttClient) {
      mqttClient.disconnect();
      setMqttClient(null);
      setIsConnected(false);
    }
  };

  // Subscribe to topic
  const subscribe = (topic, options = {}) => {
    if (mqttClient && isConnected) {
      return mqttClient.subscribe(topic, options);
    }
    return false;
  };

  // Unsubscribe from topic
  const unsubscribe = (topic) => {
    if (mqttClient && isConnected) {
      return mqttClient.unsubscribe(topic);
    }
    return false;
  };

  // Publish message to topic
  const publish = (topic, message, options = {}) => {
    if (mqttClient && isConnected) {
      return mqttClient.publish(topic, message, options);
    }
    return false;
  };

  // MQTT context value
  const value = {
    mqttClient,
    isConnected,
    connectionError,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish
  };

  return (
    <MQTTContext.Provider value={value}>
      {children}
    </MQTTContext.Provider>
  );
};

export default MQTTContext;
