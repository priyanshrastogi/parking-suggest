const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FindHistory = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userLocation: {
        lat: {type: Number},
        long: {type: Number}
    },
    nearestEmptyParking: { type: mongoose.Types.ObjectId, ref: 'Parking' }
}, { timestamps: true });