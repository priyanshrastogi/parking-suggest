const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParkingSchema = new Schema({
    name: String,
    location: {
        lat: {type: Number},
        long: {type: Number}
    },
    capacity: Number,
    perHourPrice: Number,
    authToken: String,
    rpiId: String,
    sessionId: String    
});

const Parking = mongoose.model('Parking', ParkingSchema);

module.exports = Parking;