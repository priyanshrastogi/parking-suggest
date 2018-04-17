const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    googleId: String,
    name: String,
    email: String,
    phone: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;