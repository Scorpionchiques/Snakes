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
        px=py=0;
        do
        {
       px=getRandomInt(0,40);
       py=getRandomInt(0,40);
        } while ((players.find(player => player.px==px) && players.find(player=> player.py==py)))
        player.px=px;
        player.py=py;
        players.push(player);
        console.log('Players:', players);
    socket.emit('player_initialized', player);
    });
    
   socket.on('change_x_left_position', function (data) {
    let pl=players.find(player => player.name == data.name);
    let op=players.find(player=>player.px==pl.px-1);
 if (op)
      {if (!(op.py==pl.py&& op.px== pl.px-1))
    pl.px+=-1;}
  else pl.px+=-1;
    console.log('Player:', pl);
    socket.emit('position_changed', pl);

}); 

   socket.on('change_x_right_position', function (data) {
    let pl=players.find(player => player.name == data.name);
        let op=players.find(player=>player.px==pl.px+1);
if (op)
     { if (!(op.py==pl.py&& op.px== pl.px+1))

    pl.px+=1;}
else pl.px+=+1;
    console.log('Player:', pl);
     socket.emit('position_changed', pl);

}); 
      socket.on('change_y_up_position', function (data) {
         let pl=players.find(player => player.name == data.name);
         let op=players.find(player=>player.py==pl.py+1);
 if (op)
     { if (!(op.px==pl.px&& op.py== pl.py+1))
         pl.py+=1;}
       else pl.py+=1;
           console.log('Player:', pl);
         socket.emit('position_changed', pl);

}); 
         socket.on('change_y_down_position', function (data) {
            let pl=players.find(player => player.name == data.name);
              let op=players.find(player=>player.py==pl.py-1);
if  (op)
     { if (!(op.px==pl.px&& op.py== pl.py-1))
         pl.py+=-1;}
       else pl.py+=-1;
           console.log('Player:', pl);
             socket.emit('position_changed', pl);

});   
         socket.on('load_players', (data)=>{

          data.name=players;
          socket.emit('players_loaded', data);
         });


})
socket.on('disconnect', function () {
    console.log('Disconnected');
});
