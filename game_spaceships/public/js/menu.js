class MenuScene extends Phaser.Scene {
    init(data) {
        this.maxNumberOfPlayers = data.max;
    }

    create() {
        const playBtn = this.add.text(centerX - 70, centerY - 50, 'Graj', { fill: '#0f0', fontSize: '48px' })
            .setInteractive()
            .on('pointerover', () => playBtn.setStyle({ fill: '#fff', fontSize: '48px' }))
            .on('pointerdown', () => {
                game.scene.start('play');
                game.scene.remove(this.scene.key);
            })
            .on('pointerout', () => playBtn.setStyle({ fill: '#0f0', fontSize: '48px' }));
    }
};