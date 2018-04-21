const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FindHistorySchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userLocation: {
        lat: {type: Number},
        long: {type: Number}
    },
    nearestEmptyParking: { type: mongoose.Types.ObjectId, ref: 'Parking' }
}, { timestamps: true });

const FindHistory = mongoose.model('FindHistory', FindHistorySchema);

module.exports = FindHistory;