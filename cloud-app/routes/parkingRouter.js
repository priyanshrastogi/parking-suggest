const express = require('express');
const parkingRouter = express.Router();
const Parking = require('../models/parking');
const ParkingLogs = require('../models/parkinglogs');
const googleDMApi = require('../services/googledistancematrixapi');

parkingRouter.route('/')
.get((req, res, next) => {
    Parking.find({})
    .then(parkings => {
        res.send(parkings)
    })
    .catch((err) => { return next(err) })
});

parkingRouter.route('/add')
.post((req, res, next) => {
    console.log(req.body);
    Parking.create(req.body)
    .then(parking => {
        res.send(parking);
    })
    .catch(err => { return next(err) })
});

parkingRouter.route('/findnearest')
.get((req, res, next) => {
    googleDMApi.getDistanceToParkings(`${req.query.lat},${req.query.long}`)
    .then((distances) => {
        distances.forEach(element => {
            ParkingLogs.findOne({parking: element.parkingId})
            .then(log => {
                if (log.freeSlots > 0) {
                    Parking.findById(element.parkingId)
                    .then(parking => {
                        return res.send({parking, freeSlots: log.freeSlots})
                    })
                    .catch(err => {return next(err) });
                }
            })
            .catch(err => { return next(err) });
        });
    })
    .catch((err) => { return next(err) });
});

module.exports = parkingRouter;