const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserParkingSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parking: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking' },
    inTime: {type: Date, default: Date.now},
    outTime: Date,
    bill: Number,
    status: {type: String, default: 'parked', enum: ['parked', 'done']},
    paid: {type: Boolean, default: false} 
}, { timestamps: true });

const UserParking = mongoose.model('UserParking', UserParkingSchema);

module.exports = UserParking;