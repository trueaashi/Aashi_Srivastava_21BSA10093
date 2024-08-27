Turn-Based Chess-Like Game with WebSocket Communication
Overview
This project is a turn-based chess-like game designed for real-time play using WebSocket communication. It features a 5x5 grid where two players control teams of characters with unique movement rules, aiming to capture their opponent’s pieces.

Components
1. Server
Language Node.js
Responsibilities
Implement core game logic.
Set up and manage WebSocket server.
Process game moves and maintain game state.
Broadcast game state updates to clients.
2. WebSocket Layer
Responsibilities
Handle real-time communication between server and clients.
Manage events for game initialization, moves, state updates, and notifications.
3. Web Client
Technologies HTML, CSS, JavaScript
Responsibilities
Display the game board and controls.
Implement WebSocket communication with the server.
Render game state and provide interactive controls for players.
Game Rules
Setup
Grid 5x5
Characters per Player 5 (Pawns, Hero1, Hero2)
Initial Setup Players arrange their characters on their respective starting rows.
Characters and Movement
Pawn

Moves one block in any direction (L, R, F, B).
Hero1

Moves two blocks straight in any direction.
Kills any opponent's character in its path.
Hero2

Moves two blocks diagonally in any direction.
Kills any opponent's character in its path.
Move commands FL, FR, BL, BR
Game Flow
Turns Players alternate turns, making one move per turn.
Combat Characters capture opponent's pieces in their path.
Invalid Moves Moves are invalid if they go out of bounds, are not valid for the character type, or target a friendly piece.
Game State Display Shows a 5x5 grid with all characters' positions.
Winning The game ends when one player eliminates all of the opponent’s characters.