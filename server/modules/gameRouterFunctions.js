/**
 * @file Contains functions related to game routing logic.
 * @module gameRouterFunctions
 */

const Room = require("../modules/Room");
const uuid = require("uuid");
const { convertAudioToMove } = require("./AudioTranscription");

/**
 * Finds the next available room from the list of rooms.
 * @param {Array} rooms - An array containing room objects.
 * @returns {Room|undefined} The next available room or undefined if no available room is found.
 */
function findNextAvailableRoom(rooms) {
  return rooms.find(room => !room.isFull());
}

/**
 * Finds a player's room based on the player's name.
 * @param {string} player - The player's name.
 * @param {Array} rooms - An array containing room objects.
 * @returns {Room|undefined} The room where the player is or undefined if the player is not in any room.
 */
function findPlayerRoom(player, rooms) {
  return rooms.find(room => room.hasPlayer(player));
}

/**
 * Handles a player's joining request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Array} rooms - An array containing room objects.
 */
function join(req, res, rooms) {
  let player = req.headers.origin;
  let isInRoom = findPlayerRoom(player, rooms);
  if (isInRoom !== undefined) {
    res.status(200).json({ message: "Player already in a room", roomID: isInRoom.roomId });
    return;
  }
  let room = findNextAvailableRoom(rooms);
  if (room === undefined) {
    room = new Room(uuid.v4());
    rooms.push(room);
  }
  room.addPlayer({ player, status: 'Not Ready' });

  console.log(player + ' just joined the room');
  console.log(room);

  res.status(200).json({ roomID: room.roomId });
}

/**
 * Handles a player's readiness request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Array} rooms - An array containing room objects.
 */
function ready(req, res, rooms) {
  console.log("GET /ready");
  let player = req.headers.origin;
  const room = findPlayerRoom(player, rooms);
  if (room === undefined) {
    res.status(401).json({ message: "Player not in a room" });
    return;
  }
  let playerIndex = room.indexOfPlayer(player);
  room.playersInRoom[playerIndex].status = 'Ready';
  let areAllPlayersReady = room.areAllReady();
  console.log(areAllPlayersReady);

  if (!areAllPlayersReady) {
    res.status(200).json({ message: 'Request taken in account, waiting for other player' });
    return;
  }

  if (room.game === null) {
    room.startGame();
    res.status(200).json({ message: "Game Started!" });
    return room.roomId;
  }

  res.status(200).json({ message: "Game already started" });
}

/**
 * Handles the waiting for turn request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Array} rooms - An array containing room objects.
 */
function waitTurn(req, res, rooms) {
  let player = req.headers.origin;
  let room = findPlayerRoom(player, rooms);

  if (room === undefined) {
    res.status(401).json({ message: 'Player not in a room', playerTurn: false });
    return;
  }

  if (room.game === null) {
    res.status(200).json({ message: 'Waiting for game to start', playerTurn: false });
    return;
  }

  let indexOfPlayer = room.indexOfPlayer(player);
  let playerTurn = room.game.state.playerTurn ? 1 : 0;

  if (room.game.state.isOver) {
    res.status(200).json({ message: 'The winner has been decided', playerTurn: false, grid: room.game.state.grid, winner: room.game.checkWinner() });
    if (room.game.checkWinner() === 'O') {
      return room.playersInRoom[0].player;
    } else if (room.game.checkWinner() === 'X') {
      return room.playersInRoom[1].player;
    } else {
      return room.game.checkWinner();
    }
  }

  if (indexOfPlayer === playerTurn) {
    res.status(200).json({ message: 'It is now your turn', playerTurn: true, grid: room.game.state.grid });
    return;
  } else {
    res.status(200).json({ message: 'Waiting on other player', playerTurn: false, grid: room.game.state.grid });
    return;
  }
}

/**
 * Processes the move request.
 * @param {string} move - The move received from the request.
 * @param {Array} rooms - An array containing room objects.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function processMove(move, rooms, req, res) {
  let room = findPlayerRoom(req.headers.origin, rooms);
  if (room === undefined) {
    res.status(401).json({ message: "Player not in a room" });
    return;
  }
  let game = room.game;
  if (Object.keys(req.body).length === 0) {
    res.send("Error, body is empty");
    return;
  }
  if (move === null) {
    res.status(401).json({ message: "Move not valid" });
    return;
  }

  let returnValue = {
    grid: [[]],
    winner: "",
    isAccepted: false,
  };

  if (game.handleTurn(move)) {
    returnValue.isAccepted = true;
    console.log("User move accepted, proceed with grid changes");
  }

  if (game.state.isOver) {
    returnValue = {
      grid: game.state.grid,
      winner: game.checkWinner(),
      isAccepted: true,
    };
    console.log("Winner is " + game.checkWinner());
  }

  returnValue.grid = game.state.grid;
  res.json(returnValue);
  if (game.state.isOver) {
    return;
  }
}

/**
 * Handles the move request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Array} rooms - An array containing room objects.
 */
function move(req, res, rooms) {
  console.log(`Post /move `);
  console.log(req.body);
  console.log(req.file);
  let room = findPlayerRoom(req.headers.origin, rooms);
  let moveType = req.body.type;

  if (room === undefined) {
    console.log("Player not in a room");
    res.status("200").json({ message: "Player not in in a room" });
    return;
  }

  let game = room.game;
  if (Object.keys(req.body).length === 0) {
    res.status(207).json({ message: "Error, body is empty" });
    return;
  }

  let move = moveType === 'audio' ? convertAudioToMove(req.body.file) : req.body.move;
  if (move === null) {
    console.log("Could not detect valid moves, try again");
    res.status(201).json({ message: "Could not detect valid moves, try again", playerTurn: false });
    return;
  }

  return processMove(move, rooms, req, res);
}

/**
 * Handles the reset request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Array} rooms - An array containing room objects.
 */
function reset(req, res, rooms) {
  console.log("GET /reset");
  const player = req.headers.origin;
  const roomToReset = findPlayerRoom(player, rooms);
  if (roomToReset === undefined) {
    res.status(401).json({ message: "Player not in a room", playerTurn: false });
    return;
  }

  let indexToDelete = rooms.indexOf(roomToReset);
  rooms.splice(indexToDelete, 1);
  res.status(200).send("Successfully reset");
}

module.exports = {
  findNextAvailableRoom,
  findPlayerRoom,
  join,
  ready,
  waitTurn,
  move,
  processMove,
  reset
};
