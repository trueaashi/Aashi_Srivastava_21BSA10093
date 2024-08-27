
const ws = new WebSocket('ws://localhost:3000');
const boardElement = document.getElementById('game-board');
const moveHistoryList = document.getElementById('move-history-list');
const errorElement = document.getElementById('error');
const winMessageElement = document.getElementById('win-message');
const drawMessageElement = document.getElementById('draw-message');
const selectedIndicator = document.getElementById('selected-indicator');
let selectedCharacter = null;
let currentPlayer = 'A'; // Initialize the current player
let moveHistory = null;

ws.onopen = () => {
    console.log('Connected to the server');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Message from server:', data);

    if (data.type === 'gameState') {
        updateBoard(data.state);
    } else if (data.type === 'moveResult') {
        handleMoveResult(data);
    } else if (data.type === 'currentPlayer') {
        updateCurrentPlayer(data.currentPlayer);
    } else if (data.type === 'gameOver') {
        handleGameOver(data);
    }
};

ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
};

boardElement.addEventListener('click', (event) => {
    const cell = event.target;
    if (cell.tagName === 'TD' && cell.textContent) {
        document.querySelectorAll('#game-board td').forEach(cell => {
            cell.classList.remove('selected');
        });
        cell.classList.add('selected');
        selectedCharacter = cell.textContent;
        selectedIndicator.textContent = `Selected: ${selectedCharacter}`;
        updateMoveOptions();
    }
});

document.getElementById('move-left').addEventListener('click', () => sendMove('L'));
document.getElementById('move-right').addEventListener('click', () => sendMove('R'));
document.getElementById('move-forward').addEventListener('click', () => sendMove('F'));
document.getElementById('move-backward').addEventListener('click', () => sendMove('B'));
document.getElementById('move-diagonal-left-forward').addEventListener('click', () => sendMove('FL'));
document.getElementById('move-diagonal-right-forward').addEventListener('click', () => sendMove('FR'));
document.getElementById('move-diagonal-left-backward').addEventListener('click', () => sendMove('BL'));
document.getElementById('move-diagonal-right-backward').addEventListener('click', () => sendMove('BR'));

function handleGameOver(data) {
    if (data.winner) {
        showWinMessage(data.winner);
        document.getElementById('restartGame').style.display = 'inline-block'; // Show button
    } else if (data.draw) {
        showDrawMessage();
        document.getElementById('restartGame').style.display = 'inline-block'; // Show button
    }
}

function sendMove(direction) {
    if (!selectedCharacter) {
        alert('Select a character first');
        return;
    }

    const selected = document.querySelector('.selected');
    if (selected) {
        const row = selected.dataset.row;
        const col = selected.dataset.col;

        const moveData = {
            type: 'makeMove',
            player: currentPlayer,
            character: selectedCharacter,
            position: [parseInt(row), parseInt(col)],
            direction: direction
        };

        console.log(`Sending move: ${JSON.stringify(moveData)}`);

        ws.send(JSON.stringify(moveData));

        // Initialize the move history entry with default values
        moveHistory = {
            player: currentPlayer,
            character: selectedCharacter,
            direction: direction,
            captured: 'None', // Default value
            success: false // Initial value
        };
    } else {
        alert('Select a cell first');
    }
}

function restartGame() {
    ws.send(JSON.stringify({ type: 'restartGame' }));
    // Reset local UI state if needed
    winMessageElement.style.display = 'none';
    drawMessageElement.style.display = 'none';
    errorElement.style.display = 'none';
    selectedIndicator.textContent = 'Selected: None';
    document.querySelectorAll('#game-board td').forEach(cell => {
        cell.classList.remove('selected');
    });
    moveHistoryList.innerHTML = ''; // Clear move history
}

function handleMoveResult(data) {
    if (!data.success) {
        showErrorInUI(data.error);
        if (moveHistory) {
            moveHistory.success = false;
            updateLastMoveInHistory(moveHistory);
        }
    } else {
        if (data.message) {
            alert(data.message); // Show capture message
        }
        updateBoard(data.gameState);
        if (moveHistory) {
            moveHistory.success = true;
            moveHistory.captured = data.captured || 'None';
            addMoveToHistory(moveHistory);
        }
        currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
        document.getElementById('current-player').textContent = `Current Player: ${currentPlayer}`;
    }
}

function updateCurrentPlayer(player) {
    currentPlayer = player;
    document.getElementById('current-player').textContent = `Current Player: ${currentPlayer}`;
}

function handleGameOver(data) {
    if (data.winner) {
        showWinMessage(data.winner);
    } else if (data.draw) {
        showDrawMessage();
    }
}

function addMoveToHistory(moveDetails) {
    if (moveDetails.success) {
        const li = document.createElement('li');
        li.textContent = `Player: ${moveDetails.player || 'Unknown'}, Character: ${moveDetails.character || 'Unknown'}, Direction: ${moveDetails.direction || 'Unknown'}, Captured: ${moveDetails.captured || 'None'}`;
        moveHistoryList.appendChild(li);
    }
}

function updateLastMoveInHistory(moveDetails) {
    const lastItem = moveHistoryList.lastElementChild;
    if (lastItem && !moveDetails.success) {
        lastItem.textContent = `Player: ${moveDetails.player || 'Unknown'}, Character: ${moveDetails.character || 'Unknown'}, Direction: ${moveDetails.direction || 'Unknown'}, Captured: ${moveDetails.captured || 'None'} - Failed`;
    }
}

function showErrorInUI(message) {
    errorElement.textContent = `Error: ${message}`;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000); // Hide error message after 5 seconds
}

function showWinMessage(winner) {
    winMessageElement.textContent = `Player ${winner} wins!`;
    winMessageElement.style.display = 'block';
    setTimeout(() => {
        winMessageElement.style.display = 'none';
    }, 5000); // Hide win message after 5 seconds
}

function showDrawMessage() {
    drawMessageElement.textContent = 'The game is a draw!';
    drawMessageElement.style.display = 'block';
    setTimeout(() => {
        drawMessageElement.style.display = 'none';
    }, 5000); // Hide draw message after 5 seconds
}

function updateBoard(state) {
    boardElement.innerHTML = ''; // Clear existing board

    if (!state || !state.board) {
        console.error('Invalid game state:', state);
        return;
    }

    state.board.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, colIndex) => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            td.dataset.row = rowIndex;
            td.dataset.col = colIndex;

            // Apply color based on player
            if (cell) {
                if (cell.startsWith('A-')) {
                    td.style.backgroundColor = '#202C3F'; // Red for Player A
                } else if (cell.startsWith('B-')) {
                    td.style.backgroundColor = '#658CD0'; // Blue for Player B
                }
            }

            tr.appendChild(td);
        });
        boardElement.appendChild(tr);
    });

    document.getElementById('current-player').textContent = `Current Player: ${state.currentPlayer}`;

    // Debug: Print the board state to check character positions
    console.log('Board State:', state.board);
}

function updateMoveOptions() {
    const hero2Buttons = [
        'move-diagonal-left-forward',
        'move-diagonal-right-forward',
        'move-diagonal-left-backward',
        'move-diagonal-right-backward'
    ];

    const isHero2 = selectedCharacter && selectedCharacter.endsWith('H2');
    hero2Buttons.forEach(id => {
        document.getElementById(id).style.display = isHero2 ? 'inline-block' : 'none';
    });

    // Hide standard move buttons if Hero2 is selected
    const standardButtons = ['move-left', 'move-right', 'move-forward', 'move-backward'];
    standardButtons.forEach(id => {
        document.getElementById(id).style.display = isHero2 ? 'none' : 'inline-block';
    });
}

function initializeBoard() {
    const initialBoardState = {
        board: [
            ['A-P1', 'A-P2','A-H1', 'A-H2','A-P3', ],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            ['B-P1', 'B-P2', 'B-H1', 'B-H2','B-P3',]
        ],
        currentPlayer: 'A'
    };
    updateBoard(initialBoardState);
}

// Initialize the game board on page load
initializeBoard();
