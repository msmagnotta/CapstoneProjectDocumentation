/**
 * @file Represents a Tic Tac Toe game module.
 * @module Game
 */

/**
 * Represents a Tic Tac Toe Game.
 * @class
 */
class Game {
    /**
     * Create a Tic Tac Toe game.
     * @constructor
     */
    constructor() {
        this.state = {
            grid: [['', '', ''],     /*A0 A1 A2 */
            ['', '', ''],     /*B0 B1 B2 */
            ['', '', '']      /*C0 C1 C2*/
            ],
            playerTurn: false,
            isOver: false
        };
    }

    /**
     * Gets the state of the Game class instance.
     * @returns {Object} The state of the Game class instance.
     */
    get gameState() {
        return this.state;
    }

    /**
     * Sets the state of the Game class instance.
     * @param {Object} newState - The new state to set.
     */
    set setGameState(newState) {
        this.state = newState;
    }

    // setPlayers(symbol, playerUrl){
    //     this.state.players[symbol] = playerUrl
    // }

    /**
     * Displays the grid of the Tic Tac Toe game.
     */
    displayGrid() {
        const grid = this.state.grid;
        for (let i = 0; i < 3; i++) {
            let row = '';
            for (let j = 0; j < 3; j++) {
                if (grid[i][j] === '') {
                    row += `   `;
                } else {
                    row += ` ${grid[i][j]} `;
                }

                if (j < 2) {
                    row += '|'; // Add vertical separator
                }
            }
            console.log(row);
            if (i < 2) {
                console.log('---+---+---'); // Add horizontal separator
            }
        }
    }

    /**
     * Places a mark on the grid of the Tic Tac Toe game.
     * @param {number} x - The x-coordinate of the spot on the grid.
     * @param {number} y - The y-coordinate of the spot on the grid.
     * @param {string} mark - The mark to place ('X' or 'O').
     */
    setGridTile(x, y, mark) {
        this.state.grid[x][y] = mark;
    }

    /**
     * Translates user's intended move from cell coordinates to X, Y coordinates.
     * @param {string} moveString - String representing cell coordinates (e.g., 'A1', 'B2').
     * @returns {Array} An array containing X, Y coordinates of the user's intended move.
     */
    translateMove(moveString) {
        let gridMove = [];
        switch (moveString) {
            case 'A0':
                gridMove = [0, 0];
                break;
            case 'A1':
                gridMove = [0, 1];
                break;
            case 'A2':
                gridMove = [0, 2];
                break;
            case 'B0':
                gridMove = [1, 0];
                break;
            case 'B1':
                gridMove = [1, 1];
                break;
            case 'B2':
                gridMove = [1, 2];
                break;
            case 'C0':
                gridMove = [2, 0];
                break;
            case 'C1':
                gridMove = [2, 1];
                break;
            case 'C2':
                gridMove = [2, 2];
                break;
            default:
                break;
        }
        return gridMove;
    }

    /**
     * Checks if the user's intended move is valid.
     * @param {Array} move - An array containing X, Y coordinates representing the user's intended move.
     * @returns {boolean} Whether the user's move is valid (true) or not (false).
     */
    isMoveAllowed(move) {
        let gridCell = this.state.grid[move[0]][move[1]];
        if (gridCell.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Places the mark on the grid for the current player ('X' or 'O').
     * @param {Array} move - An array containing X, Y coordinates representing the user's intended move.
     */
    setAcceptedMove(move) {
        if (this.state.playerTurn) { /* Player X */
            this.setGridTile(move[0], move[1], 'X');
        } else { /* Player O */
            this.setGridTile(move[0], move[1], 'O');
        }
    }

    /**
     * Checks the winner of the Tic Tac Toe game.
     * @returns {string|null} The winner ('X' or 'O') or 'Tie' if all spaces are filled.
     */
    checkWinner() {
        const grid = this.state.grid;
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            // Check rows
            if (grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2] && grid[i][0] !== '') {
                return grid[i][0]; // Return the winner ('X' or 'O')
            }

            // Check columns
            if (grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i] && grid[0][i] !== '') {
                return grid[0][i]; // Return the winner ('X' or 'O')
            }
        }

        // Check diagonals
        if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2] && grid[0][0] !== '') {
            return grid[0][0]; // Return the winner ('X' or 'O')
        }

        if (grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0] && grid[0][2] !== '') {
            return grid[0][2]; // Return the winner ('X' or 'O')
        }

        // Check for a tie
        for (let row of grid) {
            if (row.includes('')) {
                return null; // Game is not over yet
            }
        }

        return 'Tie'; // All spaces are filled, and no winner
    }

    /**
     * Handles the turn of the Tic Tac Toe game.
     * @param {string} moveString - String representing cell coordinates (e.g., 'A1', 'B2').
     * @returns {boolean} Whether the turn was valid and processed (true) or not (false).
     */
    handleTurn(moveString) {
        const move = this.translateMove(moveString);
        const isAllowed = this.isMoveAllowed(move);

        if (isAllowed) {
            this.setAcceptedMove(move);
        } else {
            return false;
        }

        if (this.checkWinner() !== null) {
            this.state.isOver = true;
        }
        this.state.playerTurn = !this.state.playerTurn;
        return true;
    }
}

module.exports = Game;
