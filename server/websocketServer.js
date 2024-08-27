const WebSocket = require('ws');
const createGameLogic = require('./gameLogic');

function setupWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });
    const gameLogic = createGameLogic();

    // Track pieces count for each player
    let playerPieceCounts = {
        'A': 5, // Initialize with 5 pieces per player
        'B': 5
    };

    wss.on('connection', (ws) => {
        console.log('Client connected');

        // Send initial game state to the new client
        ws.send(JSON.stringify({ type: 'gameState', state: gameLogic.getGameState() }));
        ws.send(JSON.stringify({ type: 'currentPlayer', currentPlayer: gameLogic.getCurrentPlayer() }));

        ws.on('message', (message) => {
            const data = JSON.parse(message);
            console.log('Received message:', data);

            if (data.type === 'makeMove') {
                const { player, character, position, direction } = data;
                console.log(`Move request: Player=${player}, Character=${character}, Position=${position}, Direction=${direction}`);

                const result = gameLogic.makeMove(player, { character, position, direction });
                let messageToSend = { type: 'moveResult', success: result.success };

                if (result.success) {
                    // Update player piece counts
                    if (result.captured) {
                        playerPieceCounts[result.captured.player]--;
                        if (playerPieceCounts[result.captured.player] <= 0) {
                            broadcast({ type: 'gameOver', winner: player });
                            return; // End the game
                        }
                    }

                    messageToSend = {
                        type: 'moveResult',
                        success: true,
                        player,
                        character: result.character,
                        direction: result.direction,
                        captured: result.captured,
                        gameState: result.gameState,
                        message: result.message
                    };
                } else {
                    messageToSend.error = result.error;
                }
                
                broadcast(messageToSend);
            } else if (data.type === 'restartGame') {
                gameLogic.restartGame();
                const newState = gameLogic.getGameState();
                broadcast({ type: 'restartGame', state: newState });
            }
        });
    });
    switch (data.type) {
        case 'startNewGame':
            resetGameState();
            // Notify all clients to reset their game state
            broadcast({ type: 'gameReset' });
            break;}

    const broadcast = (message) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    };


    return wss;
}

module.exports = { setupWebSocketServer };
