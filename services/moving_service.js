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

    socket.emit('moving_service');

    socket.on('position_init', function (data) {
        
        let  player =
                    {
        id: "",
       name: "",
       px: "",
       py: ""
       
                        };
        player.id=data.id;
        player.name=data.name;
        player.px=getRandomInt(0,40);
        player.py=getRandomInt(0,40);
        players.push(player);
        console.log('Players:', players);
    socket.emit('player_initialized', player);
    });
    
   socket.on('change_x_left_position', function (data) {
    let pl=players.find(player => player.name == data.name);
    pl.px+=-1;
    //console.log('Player:', pl);
    socket.emit('position_changed', pl);

}); 

   socket.on('change_x_right_position', function (data) {
    let pl=players.find(player => player.name == data.name);
    pl.px+=1;
    //console.log('Player:', pl);
     socket.emit('position_changed', pl);

}); 
      socket.on('change_y_up_position', function (data) {
         let pl=players.find(player => player.name == data.name);
         pl.py+=1;
           //console.log('Player:', pl);
         socket.emit('position_changed', pl);

}); 
         socket.on('change_y_down_position', function (data) {
            let pl=players.find(player => player.name == data.name);
         pl.py-=1;
           //console.log('Player:', pl);
             socket.emit('position_changed', pl);

}); 

})
socket.on('disconnect', function () {
    console.log('Disconnected');
});
