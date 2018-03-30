let io = require('socket.io-client');
let socket = io.connect('http://localhost:8080');
/*  
    player =
    {
       id: "",
       name: ""
    }
*/
let players = [];

socket.on('connect', function () {

    console.log('Connected');

    socket.emit('authorization_service');

    socket.on('add_player', function (data) {
       
        if (players.find(player => player.name == data.name)) socket.emit('player_already_exists', {
            id: data.id,
            name: data.name
        })
        else {
            socket.emit('player_added', {
                id: data.id,
                name: data.name
            });
            players.push(data);
            console.log('New player: ' + data.name);
            console.log('Players:', players.map(x => x.name));
        }
    })

    socket.on('player_disconnect', function (data) {
        socket.emit('player_disconnected', {
            id: data.id,
            name: data.name
        });
        let index = players.findIndex(x => x.id == data.id);
        players.splice(index, 1);
        console.log('Players:', players.map(x => x.name));

    })


})

socket.on('disconnect', function () {
    console.log('Disconnected');
});