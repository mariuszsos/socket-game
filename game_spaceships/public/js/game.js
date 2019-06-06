var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    }
};
var centerX = config.width / 2;
var centerY = config.height / 2;


var game = new Phaser.Game(config);

game.scene.add('play', PlayScene);
game.scene.add('menu', MenuScene);
game.scene.add('fullGame', FullGameScene);

game.scene.start('menu');