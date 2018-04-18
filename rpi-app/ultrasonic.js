const Gpio = require('pigpio').Gpio;
  
const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
var MICROSECDONDS_PER_CM = 1e6/34321;

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

      }
      else if(distance >= 20 && distance< 100) {

      }
      else {
        
      }
    }
  });
}

calculateDistance();

// Trigger a distance measurement once per second
setInterval(function () {
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 5000);