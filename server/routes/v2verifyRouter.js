const express = require("express");
const router = express.Router();
const axios = require('axios');



router.post('/register', async function (req,res,next) {
    const {username, gender} = req.body
    console.log(req.body)
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://public.v2ondemandapis.com/1/sve/Enrollment/${username}/${gender}`,
        headers: { 
          'Cloud-Developer-Key': 'A9676558-C4A8-W647-ACC4-1DE3C5458344', 
          'Cloud-Application-Key': '7BF2A8B0-79B7-W1CE-A4C3-203008641657', 
          'Vv-Override-Token': '123456', 
          'Interaction-Tag': username
        }
      };
      
      await axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
})