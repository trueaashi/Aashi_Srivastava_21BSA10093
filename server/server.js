const http = require('http');
const WebSocket = require('ws');
const createGameLogic = require('./gameLogic');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('WebSocket server is running');
});

const wss = new WebSocket.Server({ server });

const gameLogic = createGameLogic();

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received message:', data);

        if (data.type === 'makeMove') {
            const result = gameLogic.makeMove(data.player, {
                character: data.character,
                position: data.position,
                direction: data.direction
            });
            
            if (result.success) {
                ws.send(JSON.stringify({
                    type: 'moveResult',
                    success: true,
                    newPosition: result.newPosition,
                    gameState: gameLogic.getGameState()
                }));
            } else {
                ws.send(JSON.stringify({
                    type: 'moveResult',
                    success: false,
                    error: result.error
                }));
            }
        }
    });

    // Send initial game state to the new client
    ws.send(JSON.stringify({
        type: 'gameState',
        state: gameLogic.getGameState()
    }));
});

server.listen(3000, () => {
    console.log('HTTP server running on port 3000');
});
