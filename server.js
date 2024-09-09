const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3000;

// Serve static files (main page and secondary device pages)
app.use(express.static('public'));

// WebSocket server 
const wss = new WebSocket.Server({ server: app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}) });

wss.on('connection', (ws) => {
    console.log('A client connected');
    

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    // Currently broadcasting message multiple times to the same client multiple times based on total connected clients
                    // This means that if you reload the main page multiple times and then send a single message from the console, the message will be recived mulitple times.
                    // AFAIK inital client count is 1 due to the server also counting as a client. (Client != connections but I'm saying they are.)
                    console.log('Broadcasting message:', message.toString());
                    client.send(message.toString());  // Ensure it's a string
                }
            });
        });
    });
    
});
