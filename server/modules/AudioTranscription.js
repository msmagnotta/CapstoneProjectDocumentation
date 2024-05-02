/** This file contains all the logic to transcribe text into acceptable values for playing the Tic Talk Toe game */
const transcribeText = require('../audio/OpenAI-API')

const audioConversionValues = {
  A0: ["top left", "upper left", "A0", "up left"],
  A1: ["top", "upper middle", "A1", "up", "center", "top center"],
  A2: ["top right", "upper right", "A2", "up right"],
  B0: ["left", "center left", "B0", "middle left"],
  B1: ["center", "middle", "B1"],
  B2: ["right", "center right", "B1", "middle right"],
  C0: ["bottom left", "lower left", "C0", "down left"],
  C1: ["bottom", "lower middle", "C1", "low center", "down middle"],
  C2: ["bottom right", "lower right", "C2", "down right"],
};
async function convertAudioToMove (audioUrl, audio) {
    let transcribedText = ""
    transcribedText = await transcribeText(audioUrl, audio)
    console.log(transcribedText)
    let matchedKey = null
    /** Find any of the audioConversionValues listed above */
    Object.keys(audioConversionValues).forEach((key) => {
      const rowValues = audioConversionValues[key]
      let wordMatched = ""
      let numMatches = 0
      rowValues.forEach((value)=> {
        if(transcribedText.includes(value)){
          wordMatched = value;
          numMatches ++;
        }
      })
      /* A matching word was found, return the key. So if user says Lower middle, then the returned value would be C1*/
      if(numMatches > 0 ){
        matchedKey = wordMatched
      }
    })
    return matchedKey
}
module.exports = convertAudioToMove
