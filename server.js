const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3000;

// Serve static files (main page and secondary device pages)
app.use(express.static('public'));

// Create WebSocket server
const wss = new WebSocket.Server({ server: app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}) });

wss.on('connection', (ws) => {
    console.log('A client connected');
    
    // Broadcast received messages to all connected clients
    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    console.log('Broadcasting message:', message.toString());
                    client.send(message.toString());  // Ensure it's a string
                }
            });
        });
    });
    
});
