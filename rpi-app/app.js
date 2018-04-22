/**
 * Importing Required Dependencies
 */

const io = require('socket.io-client');
const Gpio = require('pigpio').Gpio;

/**
 * Authentication Constants
 */
const rpiId = "rpi2modelbinparking1";
const authtoken = "randomauthtokenhere";

/**
 * App Constants
 */
const MICROSECDONDS_PER_CM = 1e6/34321;
const trigger1 = new Gpio(23, {mode: Gpio.OUTPUT});
const echo1 = new Gpio(24, {mode: Gpio.INPUT, alert: true});
const trigger2 = new Gpio(14, {mode: Gpio.OUTPUT});
const echo2 = new Gpio(15, {mode: Gpio.INPUT, alert: true});
let parking = null;

const ROOT_URL = 'http://parking-suggest-api.priyanshrastogi.com';
const socket = io.connect(`${ROOT_URL}/rpi?id=${rpiId}&authtoken=${authtoken}`);


/**
 * As an event named 'parkingId' is received, that contains parkingId of this raspberry pi. Assign it to parkingId variable
 */
socket.on('parkingId', (data) => {
    parking = data.parkingId;
    console.log(parking);
});

var status1 = null;
var status2 = null;

trigger1.digitalWrite(0); // Make sure trigger is low
trigger2.digitalWrite(0); // Make sure trigger is low

/**
 * Calculate distance using ultrasonic sensors. Finding the diff b/w start and end tick and
 * multiplying it with speed of light. Based on distance assign 0 if slot is busy and 1 if slot is free. 
 */
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

/**
 * Check the parking slots status every 2 seconds and send total available slots to cloud.
 */
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

/**
 * As data is received from serial port, that is rfidTag value. Send it to cloud.
*/

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyACM0');
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
parser.on('data', (rfidTag) => { //Read data
    console.log(rfidTag);
    //socket.emit('rfid', { parking, rfidTag });
});