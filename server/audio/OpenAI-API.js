/**
 * @file This module provides functions for interacting with the OpenAI API.
 * @module OpenAI_API
 */

const { OpenAI } = require("openai");
require('dotenv').config()
const axios = require('axios');
const { Readable } = require('stream')

/**
 * Client instance for interacting with the OpenAI API.
 * @type {OpenAI}
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcribes text from an audio file.
 * @async
 * @function transcribeText
 * @param {string} audioFileUrl - URL of the audio file to transcribe.
 * @param {Buffer} audio - Buffer containing the audio data to transcribe.
 * @returns {Promise<string>} A Promise that resolves with the transcribed text, or rejects with an error.
 */
async function transcribeText(audioFileUrl, audio) {
  console.log("Trying to transcribe the text")
  console.log(audioFileUrl)

  try {
    console.log(audio)
    const audioFile = await OpenAI.toFile(Readable.from(audio.buffer), 'audio.mp3', {
      type: "audio/mpeg",
    });
    
    console.log(audioFile)
    console.log(audioFile.name)

    const result = await client.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile
    }).then(response => {
      console.log('Transcription: ' + response.text)
      return response.text
    }).catch(error => {
      console.error("Failed to transcribe audio:", error);
    });
    return result;
  } catch(error) {
    return error;
  }
}

module.exports = transcribeText;
