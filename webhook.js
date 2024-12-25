const axios = require('axios');

const ESP32_URL = 'http://your-esp32-ip'; // Replace with your ESP32 IP or endpoint

// Sample function to send data from Node server to ESP32
async function sendToESP32(data) {
  try {
    const response = await axios.post(`${ESP32_URL}/data`, data);
    console.log('Data sent to ESP32:', response.data);
  } catch (error) {
    console.error('Error sending data to ESP32:', error);
  }
}

// Test sending data to ESP32
sendToESP32({ temperature: 25, humidity: 60 });
