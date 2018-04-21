const express = require('express');
const parkingRouter = express.Router();
const crypto = require('crypto');
const Parking = require('../models/parking');
const authentication = require('../services/authentication');
const googleDMApi = require('../services/googledistancematrixapi');
const util = require('../services/processarray');

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
    crypto.randomBytes(8, (err, buffer) => {
        if(err) return next(err);
        req.body.authToken = buffer.toString('hex');
        Parking.create(req.body)
        .then(parking => {
            res.send(parking);
        })
        .catch(err => { return next(err) })
    })
});


/**
 * Brain of the project
 */

parkingRouter.route('/findnearest')
.get((req, res, next) => {
    /**
     * Get Parkings sorted as nearest distance first wrt user's current location.
     */
    googleDMApi.getDistanceToParkings(`${req.query.lat},${req.query.long}`)
    .then((distances) => {
        /**
         * For Each parking in the array, check if a parking has free slots. If there are free slots in parking,
         * return it to the user otherwise check next. If there are no free slots at all, return not found.
         */
        util.getAvailableSlots(distances, 0, (err, response) => {
            if (err) return next(err);
            res.json(response);
        })
    })
    .catch((err) => { return next(err) });
});

module.exports = parkingRouter;