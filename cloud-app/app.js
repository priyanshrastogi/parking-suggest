const express = require('express');
const app = express();
const PORT = process.env.PORT || 80;
const server = app.listen(PORT);
const io = require('socket.io')(server);
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('./config');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
mongoose.connect(config.mongoUri)

app.use(passport.initialize());

app.get('/', (req, res) => {
    res.send({welcome: "Parking Suggest"});
});

app.use('/auth', authRouter);
app.use('/users', userRouter);

var rpi = io.of('/rpi')
  .use((socket, next) => {
    let token = socket.handshake.query.auth;
    if (config.rpiauthtokens.includes(token)) {
      return next();
    }
    return next(new Error('Authentication Error'));
  })
  .on('connection', (socket) => {
    console.log('rpi connected');
    socket.emit('connected', {connected: true})
  })