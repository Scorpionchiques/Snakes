let socket = io.connect(window.location.hostname + ':8080', {
    resource: 'api',
    'sync disconnect on unload':true
})




socket.on('connect', () => {console.log(socket.id);});


let player = {
    id: socket.id,
    name: undefined,
};


 $(window).bind("beforeunload", function() {
        socket.emit('player_disconnect', player);
       //return("Close the app?");
    });

$('#send_name').on('click', function () {
    $('#send_name').attr('disabled', true);
    
    let name = $('#name').val();
    let id = socket.id;
    console.log('ID: ' + id, 'Name: ' + name);
    player = {
        id: id,
        name: name,
    }
    
    socket.emit('add_player', player);
});



socket.on('player_already_exists', function (data) {
    $('#send_name').attr('disabled', false);
      console.log('Player already exists');
});

socket.on('player_added', function (data) {
    //username = data.name;
    //$('#name_input').html('Привет, ' + player.name );
    console.log('Player added');
    socket.emit('position_init', data);
});

socket.on('player_initialized', function (data) {
    //$('#name_input').html('Привет, ' + player.name );
    console.log('Player initialized');
    $('#username').hide();
    $('#game').show();
    px=data.px;
    py=data.py;
    console.log(px,py);
    start_game();
});

socket.on('disconnect', () => {
  

    console.log('Disconnected');
});













function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function start_game() {
	canv=document.getElementById("gc");
	ctx=canv.getContext("2d");
	document.addEventListener("keydown", keyPush);
	setInterval(game,1000/60);
}

canv=document.getElementById("gc");
cw = canv.width;
var px=py=0;
gs=20;
ax=getRandomInt(0,cw/20);
ay=getRandomInt(0,cw/20);
xv=yv=0;
Score=0;
function game() {

	
	ctx.fillStyle="black";
	ctx.fillRect(0,0,canv.width,canv.height);

	ctx.fillStyle="lime";

		ctx.fillRect(px*gs,py*gs,gs,gs);


	if(ax==px && ay==py) {
		++Score;
		document.getElementById('sc').innerHTML=Score;
		ax=getRandomInt(0,cw/20);
		ay=getRandomInt(0,cw/20);
	}
	ctx.fillStyle="red";
	ctx.fillRect(ax*gs,ay*gs,gs,gs);
}
function keyPush(evt) {
     socket.on('position_changed', (data)=>{
                px=data.px;
                py=data.py;
            });
	switch(evt.keyCode) {
		case 37:
			if (px>0)
            {
            socket.emit('change_x_left_position', player);
           
			
            }
			break;
		case 38:
			if (py>0)
            {
                socket.emit('change_y_down_position', player);
			 
			}
            break;
		case 39:
			if (px<39)
            {
                 socket.emit('change_x_right_position', player);
		
			}
            break;
		case 40:
			if (py<39) {
                 socket.emit('change_y_up_position', player);
              
            }
			break;
	}
}
