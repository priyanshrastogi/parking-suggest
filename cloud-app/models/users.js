const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    googleId: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;