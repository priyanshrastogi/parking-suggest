const io = require('socket.io-client');
const Gpio = require('pigpio').Gpio; 
const authtoken = "randomauthtokenhere";
const rpiId = "rpi2modelbinparking1"
const trigger1 = new Gpio(23, {mode: Gpio.OUTPUT});
const echo1 = new Gpio(24, {mode: Gpio.INPUT, alert: true});
const trigger2 = new Gpio(14, {mode: Gpio.OUTPUT});
const echo2 = new Gpio(15, {mode: Gpio.INPUT, alert: true});
var MICROSECDONDS_PER_CM = 1e6/34321;

const socket = io.connect(`http://parking-suggest-api.priyanshrastogi.com/rpi?id=${rpiId}&authtoken=${authtoken}`);
let parking = null;

socket.on('parkingId', (data) => {
    parking = data.parkingId;
    console.log(parking);    
});

var status1 = null;
var status2 = null;

trigger1.digitalWrite(0); // Make sure trigger is low
trigger2.digitalWrite(0); // Make sure trigger is low

var calculateDistance = (echo, num) => {
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
                num === 1 ? status1 = 0 : status2 = 0;
            }
            else if(distance >= 20) {
                num === 1 ? status1 = 1 : status2 = 1;
            }
            else {
            
            }
        }
    });
}

calculateDistance(echo1, 1);
calculateDistance(echo2, 2);

setInterval(function () {
    if(parking !== null) {
        trigger1.trigger(10, 1); // Set trigger high for 10 microseconds
        trigger2.trigger(10, 1); // Set trigger high for 10 microseconds
    }
    if(status1 !== null && status2!==null) {
        console.log(status1+status2);
       socket.emit('log',{parking, freeSlots: status1+status2});
    }
  }, 5000);