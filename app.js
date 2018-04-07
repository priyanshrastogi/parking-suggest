const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('./config');
const authRouter = require('./routes/authRouter');

mongoose.connect(config.mongoUri)

app.get('/', (req, res) => {
    res.send({welcome: "Parking Suggest"});
});

app.use('/auth', authRouter);

io.of('/rpi')
.on('connection', (socket) => {
    console.log('somebody got connected.');
});