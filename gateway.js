let express = require('express');
let http = require('http');
let bodyParser = require('body-parser');
let path = require('path');
let socketIO = require('socket.io');
let app = express();
let server = http.Server(app);
let io = socketIO(server);
let PORT = 8080;


let authorization_service, moving_service

io.on('connection', function (socket) {

    //authorization players service
    socket.on('authorization_service', function () {
        console.log('authorization_service connected:', socket.id);
        authorization_service = socket;


        
    });

    //moving players service
    socket.on('moving_service', function () {
        console.log('moving_service connected:', socket.id);
        moving_service = socket;
        
    });
   

    //add new player
    socket.on('add_player', function (data) {
        console.log("Adding player: (" + data.id + ', ' + data.name + ")");
        authorization_service.emit('add_player', data);
    });

  
    socket.on('player_already_exists', function (data) {
        console.log('Player already exists: (' + data.id + ', ' + data.name + ')');
        io.to(data.id).emit('player_already_exists');
    });

    socket.on('player_added', function (data) {
        console.log('Player added: (' + data.id + ', ' + data.name + ')');
        io.to(data.id).emit('player_added', data);
    })

      socket.on('player_initialized', function (data) {
        console.log('player initialized: (' + data.id + ', ' + data.name + ')');
        io.to(data.id).emit('player_initialized', data);
    })
    //REMOVING PLAYER
    socket.on('player_disconnect', function (data) {
        console.log("Player disconnected: (" + data.id + ', ' + data.name + ")");
        authorization_service.emit('player_disconnect', data);
    });

    socket.on('position_init', (data) =>{
        console.log("initialisation player (" + data.id + ', ' + data.name + ")");
        moving_service.emit('position_init', data);

    });

      socket.on('change_x_left_position', (data) =>{
        //console.log("initialisation player (" + data.id + ', ' + data.name + ")");
        moving_service.emit('change_x_left_position', data);

    });
        socket.on('change_y_down_position', (data) =>{
        //console.log("initialisation player (" + data.id + ', ' + data.name + ")");
        moving_service.emit('change_y_down_position', data);

    });
          socket.on('change_x_right_position', (data) =>{
        //console.log("initialisation player (" + data.id + ', ' + data.name + ")");
        moving_service.emit('change_x_right_position', data);

    });
            socket.on('change_y_up_position', (data) =>{
        //console.log("initialisation player (" + data.id + ', ' + data.name + ")");
        moving_service.emit('change_y_up_position', data);

    });

        socket.on('position_changed', (data) =>{
        //console.log("initialisation player (" + data.id + ', ' + data.name + ")");
        io.to(data.id).emit('position_changed', data);

    });
})


//ROUTING AND STUFF
app.set('port', PORT);

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use('/scripts', express.static(__dirname + '/public/scripts'));

app.use('/game', bodyParser.urlencoded({
    extended: true
}));

app.post('/game', function (request, response, next) {
    response.sendFile(path.join(__dirname, 'public', 'game.js'));
});


server.listen(PORT, function () {
    console.log('Starting server on port ' + PORT);
});