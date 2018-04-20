const express = require('express');
const parkingRouter = express.Router();
const Parking = require('../models/parking');
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
    //console.log(req.body);
    Parking.create(req.body)
    .then(parking => {
        res.send(parking);
    })
    .catch(err => { return next(err) })
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
        util.getAvailableSlot(distances, 0)
        .then((response) => {
            return res.json(response);
        })
        .catch((err) => { return next(err) })
        /*distances.forEach((element, idx, distances) => {
            ParkingLogs.find({parking: element.parkingId}).limit(1).sort({$natural:-1})
            .then(log => {
                if (log[0].freeSlots > 0) {
                    Parking.findById(log[0].parking).select('name location')
                    .then(parking => {
                        return res.json({status: "found", parking, freeSlots: log[0].freeSlots, distance: element.distance});
                    })
                    .catch(err => {return next(err) });
                }
                else {
                    if(idx === distances.length-1) {
                        return res.send({status: "not found"});
                    }
                }
            })
            .catch(err => { return next(err) });
        })*/
    })
    .catch((err) => { return next(err) });
});

module.exports = parkingRouter;