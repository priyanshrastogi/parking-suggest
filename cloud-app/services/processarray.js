const Parking = require('../models/parking');
const ParkingLogs = require('../models/parkinglogs');

exports.getAvailableSlots = function processArray(array, index, callback) {
    if (index < array.length) {
        ParkingLogs.find({parking: array[index].parkingId}).limit(1).sort({$natural:-1})
        .then(log => {
            if (log[0].freeSlots > 0) {
                Parking.findById(log[0].parking).select('name location')
                .then(parking => {
                    callback(null, {status: "found", parking, freeSlots: log[0].freeSlots, distance: array[index].distance});
                })
                .catch(err => { callback(err, null) });
            }
            else {
                if(index === array.length-1) {
                    callback(null, {status: "not found"});
                }
                processArray(array, ++index, callback);
            }
        })
        .catch(err => { callback(err, null) });
    }
}