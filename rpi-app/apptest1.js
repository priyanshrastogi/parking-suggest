const io = require('socket.io-client');
const authtoken = "randomauthtokenhere";
const rpiId = "rpi2modelbinparking1";

const socket = io.connect(`http://parking-suggest-api.priyanshrastogi.com/rpi?id=${rpiId}&authtoken=${authtoken}`);
let parking = null;

socket.on('parkingId', (data) => {
    parking = data.parkingId;
    console.log(parking);
    setInterval(function () {
        if(parking !== null) {
            console.log("emitted");
            socket.emit('rfid', { parking, rfidTag: "rfidTagForPriyanshRastogi" });
        }
    }, 30000);    
});