const Parking = require('../models/parking');
const ParkingLogs = require('../models/parkinglogs');

exports.getAvailableSlot = function processArray (array, index) {
    return new Promise((resolve, reject) => {
        var deferred = 
        console.log(index);
        console.log(array[index]);
        ParkingLogs.find({parking: array[index].parkingId}).limit(1).sort({$natural:-1})
        .then(log => {
            if (log[0].freeSlots > 0) {
                Parking.findById(log[0].parking).select('name location')
                .then(parking => {
                    return resolve({status: "found", parking, freeSlots: log[0].freeSlots, distance: array[index].distance});
                })
                .catch(err => {return reject(err) });
            }
            else {
                index++;
                ParkingLogs.find({parking: array[index].parkingId}).limit(1).sort({$natural:-1})
                .then(log => {
                    if (log[0].freeSlots > 0) {
                        Parking.findById(log[0].parking).select('name location')
                        .then(parking => {
                            return resolve({status: "found", parking, freeSlots: log[0].freeSlots, distance: array[index].distance});
                        })
                    }
                })
                .catch(err => {return reject(err) });
                if(index === array.length-1) {
                    return resolve({status: "not found"});
                }
            }
        })
        .catch(err => { return next(err) });
    })
};