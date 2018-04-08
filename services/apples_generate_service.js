function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
let io = require('socket.io-client');
let socket = io.connect('http://localhost:8080');
/*  
    player =
    {   
       id:""
       name: ""
       px: ""
       py: ""
       
    }
*/
let players = [];

socket.on('connect', function () {

    console.log('Connected');

    socket.emit('apples_generate_service');
ß

})
socket.on('disconnect', function () {
    console.log('Disconnected');
});
