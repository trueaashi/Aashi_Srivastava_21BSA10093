const createGameLogic = () => {
    let board = Array(5).fill().map(() => Array(5).fill(null));
    let currentPlayer = 'A';
    let moveHistory = [];
    let players = {
        A: { characters: [], deployed: true },
        B: { characters: [], deployed: true }
    };
    let gameEnded = false;
    let winner = null;

    // Setup initial board and characters
    const setupInitialBoard = () => {
        players.A.characters = [
            { name: 'A-P1', position: { x: 0, y: 0 }, type: 'Pawn' },
            { name: 'A-P2', position: { x: 1, y: 0 }, type: 'Pawn' },
            { name: 'A-H1', position: { x: 2, y: 0 }, type: 'Hero1' },
            { name: 'A-H2', position: { x: 3, y: 0 }, type: 'Hero2' },
            { name: 'A-P3', position: { x: 4, y: 0 }, type: 'Pawn' }
        ];
        players.B.characters = [
            { name: 'B-P1', position: { x: 0, y: 4 }, type: 'Pawn' },
            { name: 'B-P2', position: { x: 1, y: 4 }, type: 'Pawn' },
            { name: 'B-H1', position: { x: 2, y: 4 }, type: 'Hero1' },
            { name: 'B-H2', position: { x: 3, y: 4 }, type: 'Hero2' },
            { name: 'B-P3', position: { x: 4, y: 4 }, type: 'Pawn' }
        ];
        updateBoard();
    };

    // Make a move
    const makeMove = (player, { character, position, direction }) => {
        if (gameEnded) return { success: false, error: 'Game has already ended' };
        if (currentPlayer !== player) return { success: false, error: 'Not your turn' };
    
        const char = findCharacter(player, character);
        if (!char) return { success: false, error: 'Character not found' };
    
        const newPosition = calculateNewPosition(char.position, direction, char.type, player);
        if (!newPosition || !isPositionValid(newPosition)) {
            return { success: false, error: 'Move out of bounds' };
        }
    
        const destination = board[newPosition.y][newPosition.x];
    
        // Check if destination is occupied by own piece
        if (destination && destination.startsWith(player)) {
            return { success: false, error: 'Cannot move to a position occupied by your own piece' };
        }
    
        let captureMessage = null;
    
        // Capture opponent's piece if present
        if (destination && destination.startsWith(opponentPlayer(player))) {
            removeCharacterAt(newPosition);
            captureMessage = `Captured ${destination}`;
        }
    
        // Make the move
        board[char.position.y][char.position.x] = null;
        board[newPosition.y][newPosition.x] = char.name;
        char.position = newPosition;
    
        // Log the move in the history
        moveHistory.push({
            player,
            character: char.name,
            direction,
            captured: captureMessage || 'None'
        });
    
        // Check for end game conditions
        const currentWinner = checkForWinner();
if (currentWinner !== null) {
    gameEnded = true;
    winner = currentWinner; // Update the winner property
    return {
        success: true,
        player,
        character: char.name,
        direction,
        captureMessage,
        newPosition: char.position,
        gameState: getGameState(),
        message: `Game Over! Player ${currentWinner} wins!`,
        winner
    };
}

    
        // Toggle player turn
        currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
        console.log(`Turn ended. Current player is now: ${currentPlayer}`);
        updateBoard();
    
        return {
            success: true,
            player,
            character: char.name,
            direction,
            captureMessage,
            newPosition: char.position,
            gameState: getGameState()
        };
    };

    // Find a character by name
    const findCharacter = (player, charName) => {
        return players[player].characters.find(c => c.name === charName);
    };

    // Calculate new position based on character type, direction, and player
    const calculateNewPosition = (position, direction, type, player) => {
        let newPosition = null;
        switch (type) {
            case 'Pawn':
                newPosition = calculatePawnPosition(position, direction, player);
                break;
            case 'Hero1':
                newPosition = calculateHero1Position(position, direction, player);
                break;
            case 'Hero2':
                newPosition = calculateHero2Position(position, direction, player);
                break;
            default:
                newPosition = null;
        }
        return newPosition;
    };

    // Calculate new position for Pawn
    const calculatePawnPosition = ({ x, y }, direction, player) => {
        switch (direction) {
            case 'L': return { x: x - 1, y };
            case 'R': return { x: x + 1, y };
            case 'F': return { x, y: player === 'A' ? y + 1 : y - 1 };
            case 'B': return { x, y: player === 'A' ? y - 1 : y + 1 };
            default: return null;
        }
    };

    // Calculate new position for Hero1
    const calculateHero1Position = ({ x, y }, direction, player) => {
        switch (direction) {
            case 'L': return { x: x - 2, y };
            case 'R': return { x: x + 2, y };
            case 'F': return { x, y: player === 'A' ? y + 2 : y - 2 };
            case 'B': return { x, y: player === 'A' ? y - 2 : y + 2 };
            default: return null;
        }
    };

    // Calculate new position for Hero2
    const calculateHero2Position = ({ x, y }, direction, player) => {
        switch (direction) {
            case 'FL': return { x: x - 2, y: player === 'A' ? y + 2 : y - 2 };
            case 'FR': return { x: x + 2, y: player === 'A' ? y + 2 : y - 2 };
            case 'BL': return { x: x - 2, y: player === 'A' ? y - 2 : y + 2 };
            case 'BR': return { x: x + 2, y: player === 'A' ? y - 2 : y + 2 };
            default: return null;
        }
    };

    // Check if the position is within board bounds
    const isPositionValid = ({ x, y }) => {
        return x >= 0 && x < 5 && y >= 0 && y < 5;
    };

    // Get opponent player
    const opponentPlayer = (player) => player === 'A' ? 'B' : 'A';

    // Remove a character from a position
    const removeCharacterAt = ({ x, y }) => {
        const player = opponentPlayer(currentPlayer);
        players[player].characters = players[player].characters.filter(c => c.position.x !== x || c.position.y !== y);
        board[y][x] = null;
    };

    // Update the board with current character positions
    const updateBoard = () => {
        board = Array(5).fill().map(() => Array(5).fill(null));
        players.A.characters.forEach(c => board[c.position.y][c.position.x] = c.name);
        players.B.characters.forEach(c => board[c.position.y][c.position.x] = c.name);
    };

    // Get the current game state
    const getGameState = () => ({ board, currentPlayer, players });

    // Get the move history
    const getMoveHistory = () => moveHistory;

    // Check for game winner
    const checkForWinner = () => {
        if (players.A.characters.length === 0) return 'B';
        if (players.B.characters.length === 0) return 'A';
        return null;
    };

    // Initialize the board
    setupInitialBoard();

    // Restart the game
    const restartGame = () => {
        board = Array(5).fill().map(() => Array(5).fill(null));
        currentPlayer = 'A';
        moveHistory = [];
        players = {
            A: { characters: [], deployed: true },
            B: { characters: [], deployed: true }
        };
        gameEnded = false;
        winner = null;
        setupInitialBoard();
    };

    return {
        makeMove,
        getGameState,
        getMoveHistory,
        getCurrentPlayer: () => currentPlayer,
        restartGame,
        isGameEnded: () => gameEnded,
        getWinner: () => winner
    };
};

module.exports = createGameLogic;
