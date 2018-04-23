function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function sortJSON(data, key, way) {
    return data.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === '123' ) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        if (way === '321') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}
let io = require('socket.io-client');
let socket = io.connect('http://localhost:8080');
/*  
    player =
    {   
      
       id: ""
       name: ""
       score:""
       
    }
*/
let players = [];

socket.on('connect', function () {

    console.log('Connected');
     socket.emit('highscore_service');

  socket.on('score_init',(data)=>{

  	let player={
  		id:data.id,
  		name:data.name,
  		score:0
  	};
  	players.push(player);
  	console.log('Players:', players);
  	socket.emit('score_inited', player);
  });

  socket.on('change_score',(data)=>{
 let pl=players.find(player => player.name == data.name);
 ++pl.score;
	
 	players=sortJSON(players,'score','321');
	console.log(pl);


	socket.emit('score_changed', pl);
  });
    socket.on('player_disconnect', function (data) {
        let index = players.findIndex(x => x.id == data.id);
        players.splice(index, 1);
        console.log('Players:', players.map(x => x.name));

    });
    socket.on('update_hs',(data)=>{
    	data.name=players;
    	socket.emit('hs_updated',data);
    });
     socket.on('load_hs',(data)=>{
    	data.name=players;
    	socket.emit('hs_loaded',data);
    });

})
socket.on('disconnect', function () {
    console.log('Disconnected');
});
