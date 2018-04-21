const io = require('socket.io-client');
const authtoken = "randomauthtokenhere2";
const rpiId = "rpi2modelbinparking2";

const socket = io.connect(`http://localhost/rpi?id=${rpiId}&authtoken=${authtoken}`);
let parking = null;

socket.on('parkingId', (data) => {
    parking = data.parkingId;
    console.log(parking);
});

setInterval(function () {
    if (parking !== null) {
        socket.emit('log', { parking, freeSlots: 1 });
    }
}, 2000);