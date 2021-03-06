var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};
var star = {
	x: Math.floor(Math.random() * 700) + 50,
	y: Math.floor(Math.random() * 500) + 50
};
var scores = {
	blue: 0,
	red: 0
};
var numPlayers = {
	counter: 0,
	max: 4
};
var teams = {
	blue: 0,
	red: 0
}

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});


io.on('connection', function (socket) {
	console.log('a user connected: ', socket.id);
	numPlayers.counter++;
	if (numPlayers.counter <= numPlayers.max) {
		// create a new player and add it to our players object
		players[socket.id] = {
			rotation: 0,
			x: Math.floor(Math.random() * 700) + 50,
			y: Math.floor(Math.random() * 500) + 50,
			playerId: socket.id,
			team: getTeamWithLessPlayers()
		};

		// send the players object to the new player
		socket.emit('currentPlayers', players);
		// send the star object to the new player
		socket.emit('starLocation', star);
		// send the current scores
		socket.emit('playersUpdate', numPlayers);
		// update all other players of the new player
		socket.broadcast.emit('newPlayer', players[socket.id]);

		socket.broadcast.emit('playersUpdate', numPlayers);
	} else {
		socket.emit('gameIsFull', numPlayers.max);
	}

	// when a player disconnects, remove them from our players object
	socket.on('disconnect', function () {
		console.log('user disconnected: ', socket.id);
		numPlayers.counter--;
		if (numPlayers.counter === 0) {
			scores.blue = 0;
			scores.red = 0;
		}
		if (players[socket.id]) {
			if (players[socket.id].team === 'blue') {
				teams.blue--;
			} else {
				teams.red--;
			}
		}
		delete players[socket.id];
		socket.broadcast.emit('playersUpdate', numPlayers);
		// emit a message to all players to remove this player
		io.emit('disconnect', socket.id);
	});

	socket.emit('scoreUpdate', scores);
	// when a player moves, update the player data
	socket.on('playerMovement', function (movementData) {
		players[socket.id].x = movementData.x;
		players[socket.id].y = movementData.y;
		// emit a message to all players about the player that moved
		socket.broadcast.emit('playerMoved', players[socket.id]);
	});

	socket.on('starCollected', function () {
		if (players[socket.id].team === 'red') {
			scores.red += 10;
		} else {
			scores.blue += 10;
		}
		star.x = Math.floor(Math.random() * 700) + 50;
		star.y = Math.floor(Math.random() * 500) + 50;
		io.emit('starLocation', star);
		io.emit('scoreUpdate', scores);
	});
});

server.listen(8081, function () {
	console.log(`Listening on ${server.address().port}`);
});

function getTeamWithLessPlayers() {
	if (teams.blue > teams.red) {
		teams.red++;
		return 'red';
	} else {
		teams.blue++;
		return 'blue';
	}
}