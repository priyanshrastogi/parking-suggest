const io = require('socket.io-client');
const Gpio = require('pigpio').Gpio; 
const authtoken = "randomauthtokenhere";
const rpiId = "rpi2modelbinparking1"
const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
var MICROSECDONDS_PER_CM = 1e6/34321;

const socket = io.connect(`http://parking-suggest-api.priyanshrastogi.com/rpi?id=${rpiId}&authtoken=${authtoken}`);
let parking = null;

socket.on('parkingId', (data) => {
    parking = data.parkingId;
    console.log(parking);    
});

trigger.digitalWrite(0); // Make sure trigger is low

var calculateDistance = () => {
    var startTick;

    echo.on('alert', function (level, tick) {
        var endTick, diff, distance;

        if (level == 1) {
            startTick = tick;
        } else {
            endTick = tick;
            diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
            distance = (diff / 2 / MICROSECDONDS_PER_CM).toFixed(2);
            console.log(distance);
            if(distance < 20 && distance > 2) {
                socket.emit('log', { parking, freeSlots: 0 });
            }
            else if(distance >= 20 && distance< 100) {
                socket.emit('log', { parking, freeSlots: 1 });
            }
            else {
            
            }
        }
    });
}

calculateDistance();

setInterval(function () {
    if(parking !== null) {
        trigger.trigger(10, 1); // Set trigger high for 10 microseconds
    }
  }, 5000);