#include <WiFi.h>
#include <WebSocketsClient.h>

// Replace with your network credentials
const char* ssid = "your-SSID";
const char* password = "your-PASSWORD";

// Replace with your WebSocket server address
const char* wsServer = "your-vercel-deployment-url";

// Initialize WebSocket client
WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("Disconnected from WebSocket server.");
      break;
    case WStype_CONNECTED:
      Serial.println("Connected to WebSocket server.");
      break;
    case WStype_TEXT:
      Serial.printf("Message from server: %s\n", payload);
      break;
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");
  
  webSocket.begin(wsServer, 443, "/api/websocket");
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
  
  // Send data every 5 seconds
  static unsigned long lastSend = 0;
  if (millis() - lastSend > 5000) {
    lastSend = millis();
    
    String json = "{\"type\":\"sensor\",\"value\":42}";
    webSocket.sendTXT(json);
    
    Serial.println("Sent data to WebSocket: " + json);
  }
}
