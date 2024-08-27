const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
    console.log('WebSocket connection opened');

    // Test initialization with sample characters
    ws.send(JSON.stringify({
        type: 'initialize',
        player: 'A',
        characters: [
            { name: 'P1', position: { x: 0, y: 0 }, type: 'Pawn' },
            { name: 'H1', position: { x: 1, y: 0 }, type: 'Hero1' },
            { name: 'H2', position: { x: 2, y: 0 }, type: 'Hero2' },
            { name: 'P2', position: { x: 3, y: 0 }, type: 'Pawn' },
            { name: 'P3', position: { x: 4, y: 0 }, type: 'Pawn' }
        ]
    }));

    // Optionally send a move command
    ws.send(JSON.stringify({
        type: 'move',
        player: 'A',
        move: 'P1:R'
    }));
});

ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('Received:', message);
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', () => {
    console.log('WebSocket connection closed');
});
