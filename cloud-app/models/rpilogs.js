const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RPiLogsSchema = new Schema({
    rpiId: String,
    sessionId: String,
    connectedTime: {type: Date, default: Date.now},
    disconnectedTime: Date,
    disconnectReason: String
});

const RPiLogs = mongoose.model('RPiLogs', RPiLogsSchema);

module.exports = RPiLogs;