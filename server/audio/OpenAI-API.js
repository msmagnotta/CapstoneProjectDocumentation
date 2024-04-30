const { OpenAI } = require("openai");
const axios = require('axios');
const {Readable } = require('stream')
const client = new OpenAI({
  apiKey: 'sk-proj-aFL7o8AqefmqjwxePvhHT3BlbkFJjcTuu2NuuThywCHxQBq2',
});

async function transcribeText(audioFileUrl, audio ){
  console.log("Trying to transcribe the text")
  console.log(audioFileUrl)
  // console.log(audio.constructor.name)
  // const audioReadStream =stream
  // audioReadStream.path = 'conversation.wav';
  // console.log(audioReadStream)
  // let data = new FormData()
  // data.append('file',audio)
  try {
    // const formData = new FormData();
    // formData.append("model", "whisper-1");
    // formData.append("file", audio);
    // formData.append("file", fs.createReadStream(req.file.path), {
    //   filename: req.file.originalname,
    // });
    // const response = await axios({
    //   method: 'get',
    //   url: audioFileUrl,
    //   responseType: 'arraybuffer'
    // });
    // const audioBuffer = Buffer.from(response.data);
    // const audioFormat = path.extname(audioFileUrl);
    console.log(audio)
    const audioFile = await OpenAI.toFile(Readable.from(audio.buffer), 'audio.mp3', {
      type: "audio/mpeg",
    });
    
    // const audioFile = await OpenAI.toFile(audio.buffer, audio.originalname);
    console.log(audioFile)
    console.log(audioFile.name)
    // const response = await axios.post(
    //   "https://api.openai.com/v1/audio/transcriptions",
    //   formData,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       Authorization:
    //         "sk-proj-aFL7o8AqefmqjwxePvhHT3BlbkFJjcTuu2NuuThywCHxQBq2",
    //     },
    //   }
    // );

  //   return response
  // } catch (e) {
  //   console.log("Failed to transcribe audio:", e);
  //   return(new Error(e));
  // }

    const result = await client.audio.transcriptions.create({
    model: "whisper-1",
    file: audioFile
    }).then(response => {
    console.log('Transcription: ' + response.text)
    return response.text
  }).catch(error => {
    console.error("Failed to transcribe audio:", error);
  });
 return result
} catch(error){
  return error
}
 
}
module.exports = transcribeText