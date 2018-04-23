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
let apple = {
  ax:getRandomInt(0,40),
  ay:getRandomInt(0,40)
};

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
        } while ((players.find(player => player.px==px) && players.find(player=> player.py==py)) && player.px==apple.ax && player.py==apple.ay)
        player.px=px;
        player.py=py;
        players.push(player);
        console.log('Players:', players);
    socket.emit('player_initialized', player);
    });
    
   socket.on('change_x_left_position', function (data) {
    let pl=players.find(player => player.name == data.name);
    let op=players.find(player=>(player.px==pl.px-1&&player.py==pl.py))
 if (typeof op == 'undefined')
   {pl.px-=1;
    //console.log('Player:', pl);
    socket.emit('position_changed', pl);}

}); 

   socket.on('change_x_right_position', function (data) {
    let pl=players.find(player => player.name == data.name);
   let op=players.find(player=>(player.px==pl.px+1&&player.py==pl.py))
 if (typeof op == 'undefined')
   {pl.px+=1;
    //console.log('Player:', pl);
     socket.emit('position_changed', pl);}

}); 
      socket.on('change_y_up_position', function (data) {
         let pl=players.find(player => player.name == data.name);
        let op=players.find(player=>(player.px==pl.px&&player.py==pl.py+1))
 if (typeof op == 'undefined')
   {pl.py+=1;
           //console.log('Player:', pl);
         socket.emit('position_changed', pl);
       }

}); 
         socket.on('change_y_down_position', function (data) {
            let pl=players.find(player => player.name == data.name);
             let op=players.find(player=>(player.px==pl.px&&player.py==pl.py-1))
 if (typeof op == 'undefined')
   {pl.py-=1;
           //console.log('Player:', pl);
             socket.emit('position_changed', pl);}

});   
         socket.on('load_players', (data)=>{

          data.name=players;
          socket.emit('players_loaded', data);
         });

           socket.on('player_disconnect', function (data) {
        let index = players.findIndex(x => x.id == data.id);
        players.splice(index, 1);
        console.log('Players:', players.map(x => x.name));

    });
          socket.on('generate_apple', (data)=>{
            let ax,ay;
             do
        {
       ax=getRandomInt(0,40);
       ay=getRandomInt(0,40);
       
        } while ((players.find(player => ax==px) && players.find(player=> ay==py) && apple.ax!=ax && apple.ay!=ay))
        apple.ax=ax;
        apple.ay=ay;
        data.apple=apple;
          socket.emit('apple_generated',data);
          });

   socket.on('load_apple', (data)=>{
        data.apple=apple;
          socket.emit('apple_loaded',data);
          });


})
socket.on('disconnect', function () {
    console.log('Disconnected');
});
