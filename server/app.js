
const express = require('express');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const gameRouter = require('./routes/gameRouter')
const v2verifyRouter = require('./routes/v2verifyRouter')
const app = express();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const port = 3001
const cors = require('cors')
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game', gameRouter);
app.use('/voice', v2verifyRouter)
app.listen(port, () => console.log('Example app is listening on port ' + port +'.' ));