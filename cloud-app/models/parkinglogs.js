const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParkingLogsSchema = new Schema({
    parking: {type: mongoose.Schema.Types.ObjectId, ref: 'Parking'},
    freeSlots: Number,
    datatime: { type: Date, default: Date.now }
});

const ParkingLogs = mongoose.model('ParkingLogs', ParkingLogsSchema);

module.exports = ParkingLogs;