// Import Game module
const Game = require('../modules/Game');

// Define the Room class
class Room {
    constructor(id) {
        this.roomID = id; // Room ID
        this.roomSize = 2; // Max number of players in room
        this.playersInRoom = []; // Array to store players in room
        this.game = null; // Game object
        this.status = 'inactive'; // Room status
        this.numPlayers = 0; // Number of players in room
    }

    // Check if the room is full
    isFull() {
        return this.playersInRoom.length === this.roomSize;
    }

    // Check if a game is in progress
    isGameGoing() {
        return this.game !== null;
    }

    // Start a new game
    startGame() {
        this.game = new Game();
    }

    // Check if all players in the room are ready
    areAllReady() {
        if(this.numPlayers !== this.roomSize)
        return false
        return this.playersInRoom.every(({ player, status }) => {
            return status === 'Ready';
        });
    }

    // Check if a player is in the room
    hasPlayer(playerName) {
        let hasPlayerBool = false;
        this.playersInRoom.forEach(({ player, status }) => {
            if (player === playerName) {
                hasPlayerBool = true;
            }
        });
        return hasPlayerBool;
    }

    // Get the index of a player in the room
    indexOfPlayer(playerName) {
        let playerIndex = -1;
        this.playersInRoom.forEach(({ player, status }, index) => {
            if (player === playerName) {
                playerIndex = index;
            }
        });
        return playerIndex;
    }

    // Add a player to the room
    addPlayer(player) {
        if (this.isFull()) {
            console.log("Room full cannot add players");
            return false;
        }
        this.playersInRoom.push(player);
        this.numPlayers += 1;
        return true;
    }

    // Remove a player from the room
    removePlayer(player) {
        let index = this.playersInRoom.indexOf(player);
        this.playersInRoom.splice(index, 1);
    }

    // Clear the room (unused in current implementation)
    clearRoom() {
        // TODO: implement
    }
}

// Export the Room class
module.exports = Room;
