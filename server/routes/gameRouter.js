/**
 * @file Defines routes for handling game-related requests.
 * @module gameRouter
 */

const express = require("express");
const routerFunction = require("../modules/gameRouterFunctions");
const Game = require("../modules/Game");
const Room = require("../modules/Room");
const uuid = require("uuid");
let { createTopic, produceMessage, consumeMessages } = require('../kafka/kafkaService');

/** 
 * Turn this value to true to enable kafka commands 
 */
const enableKafka = false

const router = express.Router();

let globalRoomId = null;
let rooms = []; /* Stores Room objects*/

/**
 * Route for the root endpoint.
 * @name GET/
 * @function
 * @memberof module:gameRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get("/", async function (req, res, next) {});

/**
 * Route for processing player moves.
 * @name POST/move
 * @function
 * @memberof module:gameRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.post("/move", async function (req, res, next) {
  if(routerFunction.move(req, res, rooms) === true){
    if(enableKafka){
      produceMessage(globalRoomId, 'key1', "Player " + req.headers.origin + " selected " + req.body.move)
    } 
  }
});

/**
 * Route for resetting the game.
 * @name GET/reset
 * @function
 * @memberof module:gameRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get("/reset", function (req, res, next) {
  console.log("GET /reset");
  
  if(enableKafka){
    produceMessage(globalRoomId, 'key1', "Game Reset")
  }
  rooms = [];
  routerFunction.reset(req,res,rooms)
});

/**
 * Route for players to join a room.
 * @name GET/join
 * @function
 * @memberof module:gameRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get("/join", async function (req, res, next) {
  routerFunction.join(req, res, rooms);
});

/**
 * Route for setting player status as ready.
 * @name GET/ready
 * @function
 * @memberof module:gameRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get("/ready", async function (req, res, next) {
  const readyStatus = routerFunction.ready(req, res, rooms);
  let newGame = !(readyStatus === undefined)
  if (newGame && enableKafka) {
    globalRoomId = readyStatus
    await createTopic(globalRoomId)
    consumeMessages(globalRoomId)
    produceMessage(globalRoomId, 'key1', "Game Started")
  }
});

/**
 * Route for updating clients and waiting for turns.
 * @name GET/waitTurn
 * @function
 * @memberof module:gameRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get("/waitTurn", async function (req, res, next) {
  console.log("GET /waitTurn")
  potentialWinner = routerFunction.waitTurn(req, res, rooms)

  if(potentialWinner !== undefined && enableKafka) {
    produceMessage(globalRoomId, 'key1', "Player " + potentialWinner + " Wins!")
  }
});

/**
 * Route for getting real-time information about rooms.
 * @name GET/rooms
 * @function
 * @memberof module:gameRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get('/rooms', async function(req,res,next){
  res.json(rooms)
})

const gameRouter=router
module.exports = {gameRouter, rooms};
