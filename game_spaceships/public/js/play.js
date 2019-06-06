var speed = 4;

class PlayScene extends Phaser.Scene {

	preload() {
		this.load.image('ship', 'assets/spaceShips_001.png');
		this.load.image('otherPlayer', 'assets/enemyBlack5.png');
		this.load.image('star', 'assets/star_gold.png');
		this.load.audio('starSound', 'assets/star.mp3');
		this.load.image('background', 'assets/background.jpg');
	}

	create() {
		var self = this;
		this.socket = io();

		this.socket.on('gameIsFull', maxNumberOfPlayers => {
			game.scene.start('fullGame', { max: maxNumberOfPlayers });
			game.scene.remove(this.scene.key);
		})

		this.add.image(800, 600, 'background').setOrigin(1, 1);
		this.otherPlayers = this.physics.add.group();

		this.socket.on('currentPlayers', function (players) {
			Object.keys(players).forEach(function (id) {
				if (players[id].playerId === self.socket.id) {
					addPlayer(self, players[id]);
				} else {
					addOtherPlayers(self, players[id]);
				}
			});
		});

		this.socket.on('newPlayer', function (playerInfo) {
			addOtherPlayers(self, playerInfo);
		});

		this.socket.on('disconnect', function (playerId) {
			self.otherPlayers.getChildren().forEach(function (otherPlayer) {
				if (playerId === otherPlayer.playerId) {
					otherPlayer.destroy();
				}
			});
		});

		this.socket.on('playerMoved', function (playerInfo) {
			self.otherPlayers.getChildren().forEach(function (otherPlayer) {
				if (playerInfo.playerId === otherPlayer.playerId) {
					otherPlayer.setRotation(playerInfo.rotation);
					otherPlayer.setPosition(playerInfo.x, playerInfo.y);
				}
			});
		});

		this.cursors = this.input.keyboard.createCursorKeys();
		this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0060a1' });
		this.redScoreText = this.add.text(534, 16, '', { fontSize: '32px', fill: '#FF0000' });
		this.counterPlayersText = this.add.text(300, 550, '', { fontSize: '36px', fill: '#FFF' });

		this.socket.on('playersUpdate', function (numPlayers) {
			self.counterPlayersText.setText(`Graczy w grze: ${numPlayers.counter}/${numPlayers.max}`);
			self.counterPlayersText.setShadow(3, 3, 'rgba(0,0,0,0.9)', 5);
		});

		this.socket.on('scoreUpdate', function (scores) {
			self.blueScoreText.setText('Niebiescy: ' + scores.blue);
			self.blueScoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
			self.redScoreText.setText('Czerwoni: ' + scores.red);
			self.redScoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
		});

		this.socket.on('starLocation', function (starLocation) {
			if (self.star)
				self.star.destroy();
			self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
			self.physics.add.overlap(self.ship, self.star, function () {
				this.socket.emit('starCollected');
				game.sound.play('starSound');
			}, null, self);
		});
	}

	update() {
		if (this.ship) {
			if (this.cursors.right.isDown) {
				this.ship.x += speed;
				this.ship.rotation = -1.5;
			} else if (this.cursors.down.isDown) {
				this.ship.y += speed;
				this.ship.rotation = 0;
			} else if (this.cursors.left.isDown) {
				this.ship.x -= speed;
				this.ship.rotation = 1.5;
			} else if (this.cursors.up.isDown) {
				this.ship.y -= speed;
				this.ship.rotation = -3;
			}
			this.physics.world.wrap(this.ship, 1);

			// emit player movement
			var x = this.ship.x;
			var y = this.ship.y;
			this.socket.emit('playerMovement', { x: x, y: y });
		}
	}
};

addPlayer = function (self, playerInfo) {
	self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
	if (playerInfo.team === 'blue') {
		self.ship.setTint(0x0000ff);
	} else {
		self.ship.setTint(0xff0000);
	}
};

addOtherPlayers = function (self, playerInfo) {
	const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
	if (playerInfo.team === 'blue') {
		otherPlayer.setTint(0x0000ff);
	} else {
		otherPlayer.setTint(0xff0000);
	}
	otherPlayer.playerId = playerInfo.playerId;
	self.otherPlayers.add(otherPlayer);
};
