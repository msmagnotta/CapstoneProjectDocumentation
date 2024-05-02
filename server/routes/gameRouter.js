const express = require("express");
const routerFunction = require("../modules/gameRouterFunctions");
const router = express.Router();
const Game = require("../modules/Game");
const Room = require("../modules/Room");
const uuid = require("uuid");

let rooms = []; /* Stores Room objects*/
/* Finds the next available room by finding the first non full room */

/* NOTHING HERE. May Change*/
router.get("/", async function (req, res, next) {});

/* Post Route /move used to process client move
   Requires the player to already be in a room
   Requires move sent through Post body */
router.post("/move", async function (req, res, next) {
  routerFunction.move(req, res, rooms)
});

/* reset Every room. TO DO: Only reset current game. */
router.get("/reset", function (req, res, next) {
  console.log("GET /reset");
  rooms = [];
  res.status(200).send("Successfully reset");
});

/* Route for client to join a room. Required before starting a game. */
router.get("/join", async function (req, res, next) {
  routerFunction.join(req, res, rooms);
});
/* Route for client to set his status as ready. Once the two players are marked as ready, the game is created and can be played */
router.get("/ready", async function (req, res, next) {
  routerFunction.ready(req, res, rooms);
});
/* Main route to update clients every time interval defined in the client source file.
   The idea is that every T time, client makes a call to this route in order to retrieve the current state of the game. 
   This route is also used after a user makes a move, in order to wait for his turn.
   The player turn is determined based on the index of the player inside the room. */
router.get("/waitTurn", async function (req, res, next) {
  routerFunction.waitTurn(req, res, rooms);
});
/* Route for client to ask for a rematch. Both players must agree to a rematch for a new game. */
router.get("/rematch", function (req, res) {
  routerFunction.rematch(req, res, rooms);
});


module.exports = router;
