const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const options = {
  cert: fs.readFileSync('./sslcert/fullchain.pem'),
  key: fs.readFileSync('./sslcert/privkey.pem')
};
const PORT = process.env.PORT || 80;
const SECUREPORT = process.env.SECUREPORT || 443;
const server = app.listen(PORT);
https.createServer(options, app).listen(SECUREPORT);
const io = require('socket.io')(server);
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const cors = require('cors');
const config = require('./config');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const parkingRouter = require('./routes/parkingRouter');
const Parking = require('./models/parking');
const RPiLogs = require('./models/rpilogs');
const ParkingLogs = require('./models/parkinglogs');
const User = require('./models/user');
const UserParking = require('./models/userparkings');
const mailer = require('./services/mailer');

/*
Connect to MongoDB on Mlab
*/
mongoose.connect(config.mongoUri)
.then(db => console.log("connected to database"))
.catch(err => console.log(err))

app.use(passport.initialize());
app.use(express.json());
/*
Enable Cross Origin Resource Sharing on Server
*/
app.use(cors());

/*
Handling Root route
*/
app.use(express.static('static'));

/*
Handling Auth, User and Parkings Route
*/
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/parkings', parkingRouter);

/* 
Socket.io for Raspberry Pi Web Socket Communication.
*/

const rpi = io.of('/rpi')
  /*
  Middleware for Raspberry Pi Authentication
  */
  .use((socket, next) => {
    Parking.findOne({rpiId: socket.handshake.query.id})
    .then(parking => {
      console.log(parking);
      if(parking.authToken === socket.handshake.query.authtoken) {
        parking.sessionId = socket.id;
        parking.save();
        socket.emit('parkingId', {parkingId: parking._id})
        return next();
      }
      return next(new Error('Authentication Error'));
    })
    .catch(err => console.log(err));
  })
  /*
  As a Raspberry Pi socket gets connected, logging it in RpiLogs Collection.
  */
  .on('connection', (socket) => {
    RPiLogs.create({rpiId: socket.handshake.query.id, sessionId: socket.id})
    .catch(err => console.log(err));
    /*
    On disconnection with a socket, logging the disconnect time and reason in RPiLogs
    */
    socket.on('disconnect', (reason) => {
      RPiLogs.findOne({sessionId: socket.id})
      .then(log => {
        log.disconnectedTime = Date.now();
        log.disconnectReason = reason;
        log.save();
      })
      .catch(err => console.log(err));
    });
    /*
    Storing data received from Raspberry Pi socket in ParkingLogs collection
    */
    socket.on('log', (payload) => {
      console.log(payload);
      ParkingLogs.create(payload)
      .catch(err => console.log(err));
    })

    socket.on('rfid', (payload) => {
      console.log(payload);
      User.findOne({rfidTag: payload.rfidTag})
      .then((user) => {
        UserParking.findOne({user: user._id, parking: payload.parking, status: 'parked'}).populate('parking','name perHourPrice')
        .then((userparking) => {
          if(userparking !== null) {
            userparking.outTime = Date.now();
            const delta = userparking.outTime.valueOf()-userparking.inTime.valueOf();
            userparking.bill = (delta/(3600*1000)*userparking.parking.perHourPrice).toFixed(2);
            userparking.status = 'done';
            userparking.save()
            .then((userparking => {
              mailer.sendParkingOutMail(user.email, user.name, userparking.parking.name, userparking.inTime, userparking.outTime, userparking.bill);
            }))
            .catch(err => {console.log(err)});
          }
          else {
            UserParking.create({user: user._id, parking: payload.parking})
            .then((userparking) => {
              Parking.findById(payload.parking).select('name')
              .then((parking) => {
                mailer.sendParkingInMail(user.email, user.name, parking.name, userparking.inTime);
              })
            })
            .catch(err => console.log(err));
          }
        })
      })
      .catch(err => console.log(err));
    })
  });