function messageDisplay(className, show) {
	var messageContainer = document.querySelector(className);
	messageContainer.style.display = show ? 'block' : 'none';
}

function gameWaiting(show) {
	messageDisplay('.game-waiting', show)
}

function gameFull() {
	messageDisplay('.game-full', true);
}

function gameWrapper(show) {
	messageDisplay('.wrapper', show);
}


window.requestAnimationFrame(function () {
	
	const socket = io();
	socket.on('player-index', function (playerNumber) {
		if (playerNumber == 0) {
			gameWaiting(true); 
			
			socket.on('player-connect', function() {
				gameWaiting(false); 
				gameWrapper(true);
				//startGry();
			});
		} else if (playerNumber == -1) {
			gameFull(); 
			gameWrapper(false);
		} else { 
			gameWrapper(true);			
		}
	});
});