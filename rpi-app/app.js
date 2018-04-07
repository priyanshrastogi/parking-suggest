const io = require('socket.io-client');
const token = "somerandomstringhere";
const socket = io.connect(`http://10.13.41.14:5000/rpi?auth=${token}`);

socket.on('connected', (data) => {
    console.log(data);
})