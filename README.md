# Turn-Based Chess-Like Game with WebSocket Communication

**GitHub Link**: [Your GitHub Repository Link]

## Overview
This project is a **turn-based chess-like game** designed for real-time multiplayer play using WebSocket communication. The game features a 5x5 grid where two players control teams of characters, each with unique movement rules. The objective is to capture the opponent’s pieces, with the game ending when one player eliminates all of the opponent’s characters.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, WebSocket API
- **Tools**: VS Code, Git, GitHub

## Game Components

### 1. Server
- **Language**: Node.js
- **Responsibilities**:
  - Implements the core game logic.
  - Sets up and manages the WebSocket server for real-time communication.
  - Processes game moves and maintains the overall game state.
  - Broadcasts game state updates to connected clients.

### 2. WebSocket Layer
- **Responsibilities**:
  - Facilitates real-time communication between the server and clients.
  - Manages events such as game initialization, player moves, state updates, and notifications.
  - Ensures synchronization of game states across clients.

### 3. Web Client
- **Technologies**: HTML, CSS, JavaScript
- **Responsibilities**:
  - Displays the game board and provides interactive controls for players.
  - Implements WebSocket communication with the server for move submissions and state updates.
  - Renders the game state in real-time, allowing for intuitive player interactions.

## Game Rules

### Setup
- **Grid Size**: 5x5
- **Characters per Player**: 5 (Pawns, Hero1, Hero2)
- **Initial Setup**: Players arrange their characters on their respective starting rows.

### Characters and Movement

- **Pawn**:
  - Moves one block in any direction (left, right, forward, back).

- **Hero1**:
  - Moves two blocks straight in any direction.
  - Captures any opponent's character in its path.

- **Hero2**:
  - Moves two blocks diagonally in any direction.
  - Captures any opponent's character in its path.
  - **Move commands**: FL (forward-left), FR (forward-right), BL (back-left), BR (back-right).

### Game Flow
- **Turns**: Players alternate turns, making one move per turn.
- **Combat**: Characters capture opponent's pieces if they land on the same square.
- **Invalid Moves**: Moves are invalid if they go out of bounds, are not valid for the character type, or target a friendly piece.
- **Game State Display**: The game board visually represents all characters' positions.
- **Winning Condition**: The game ends when one player eliminates all of the opponent’s characters.

## Key Features
- Real-time game state synchronization using WebSocket communication.
- Customizable game rules and movement logic for characters.
- Simple yet engaging gameplay based on strategic moves and captures.

## Demo
A demo of the game can be accessed at: [Demo Video Link](https://drive.google.com/file/d/1Y-mktmdT4JXNP-mIEocTwmZOWT7Y8SwB/view?usp=sharing)

## Getting Started

### Prerequisites
- Node.js

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/chess-like-game.git
    cd chess-like-game
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the WebSocket server:

    ```bash
    node server.js
    ```

4. Open `index.html` in two browser windows to simulate two players.

