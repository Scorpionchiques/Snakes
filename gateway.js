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
   
       //highscore_service  service
    socket.on('highscore_service', function () {
        console.log('highscore_service connected:', socket.id);
        highscore_service = socket;
        
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
        moving_service.emit('player_disconnect', data);
        highscore_service.emit('player_disconnect', data);
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
        socket.on('load_players', (data)=> {

            //console.log("loading players by (" + data.id + ', ' + data.name + ")");
            moving_service.emit('load_players', data);
        });
           socket.on('generate_apple', (data)=> {

            //console.log("loading players by (" + data.id + ', ' + data.name + ")");
            moving_service.emit('generate_apple', data);
        });
            socket.on('load_apple', (data)=> {

            //console.log("loading players by (" + data.id + ', ' + data.name + ")");
            moving_service.emit('load_apple', data);
        });
          socket.on('players_loaded', (data)=> {

            //console.log("players loaded... sending to client");
            io.to(data.id).emit('players_loaded', data.name);
        });
          socket.on('apple_generated', (data)=>{
             io.to(data.id).emit('apple_generated', data.apple);
          });
                 socket.on('apple_loaded', (data)=>{
             io.to(data.id).emit('apple_loaded', data.apple);
          });
                 socket.on('score_init', (data)=>{

                    highscore_service.emit('score_init', data);
                 });
                 socket.on('score_inited', (data)=>{

        io.to(data.id).emit('apple_loaded', data.score);
                 });
                 socket.on('change_score', (data)=>{
                    highscore_service.emit('change_score',data);

                 });
                 socket.on('score_changed', (data)=>{
                        io.to(data.id).emit('score_changed', data.score);
                 });
                 socket.on('update_hs', (data)=>{

                    highscore_service.emit('load_hs',data);
                 });
                    socket.on('hs_updated', (data)=>{
                        io.to(data.id).emit('hs_loaded', data.name);
                 });
                           socket.on('load_hs', (data)=>{

                    highscore_service.emit('load_hs',data);
                 });
                    socket.on('hs_loaded', (data)=>{
                        io.to(data.id).emit('hs_loaded', data.name);
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