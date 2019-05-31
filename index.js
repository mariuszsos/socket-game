var express = require('express');
var socketio = require('socket.io');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);
var io = socketio(server); 


server.listen(3000, () => console.log('Server wlaczony'));
app.use(express.static(path.join(__dirname, 'public')));


var connections = [null, null];

io.on('connection', function(socket){
	
	var playerIndex = -1;
	for(var i in connections) {		
		if(connections[i] == null) {
			playerIndex = i;
			break;
		}
	}
	
	socket.emit('player-index', playerIndex);
	socket.broadcast.emit('player-connect', playerIndex);
	
	console.log(`Gracz ${playerIndex} zostal polaczony`);
	
	if (playerIndex == -1) return;
		
	connections[playerIndex] = socket;
	
	socket.on('disconnect', function() {
		console.log(`Gracz ${playerIndex} rozlaczyl sie`);
		connections[playerIndex] = null;
	});
});



