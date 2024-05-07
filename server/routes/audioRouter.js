/**
 * @file Defines routes for handling audio-related requests.
 * @module audioRouter
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");

// Set up Multer storage in memory
const storage = multer.memoryStorage();

// Initialize Multer
const upload = multer({ storage: storage });

const { findPlayerRoom, processMove } = require("../modules/gameRouterFunctions");
const convertAudioToMove = require("../modules/AudioTranscription");
const axios = require('axios');
const { rooms } = require("../routes/gameRouter");
const transcribeText = require('../audio/OpenAI-API');

/**
 * Handles the audio move request.
 * @name POST/move
 * @function
 * @memberof module:audioRouter
 * @inner
 * @param {string} req.file - The uploaded audio file.
 * @param {string} req.body - The request body.
 * @param {string} req.body.voiceUrl - The URL of the voice.
 * @param {string} req.body.move - The move corresponding to the audio.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
router.post(
  "/move",
  upload.single("file"),
  async function (req, res, next) {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!req.body) {
      return res.status(400).json({ message: "No body submitted" });
    }
    
    const transcribedText = await transcribeText(req.body.voiceUrl, req.file);
    const move = await convertAudioToMove(req.body.voiceUrl, req.file);
    
    if (move === null) {
      console.log("Could not detect valid moves, try again");
      res.status(201).json({
        message: "Could not detect valid moves, try again",
        transcription: transcribedText,
        playerTurn: true,
      });
      return;
    }
    
    return processMove(move, rooms, req, res);
  }
);

module.exports = router;
