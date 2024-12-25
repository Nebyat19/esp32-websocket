const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Set up webhook endpoint
app.use(bodyParser.json());
app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  // Process the incoming data (e.g., save to database, forward to WebSocket, etc.)
  res.status(200).send('Webhook received');
});

// Set up WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established.');

  ws.on('message', (message) => {
    console.log('Received data:', message);
    // Broadcast the message to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed.');
  });
});

app.server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.server.on('upgrade', (request, socket, head) => {
  if (request.url === '/websocket') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});
