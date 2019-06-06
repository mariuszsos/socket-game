var titlescreen;

class MenuScene extends Phaser.Scene {
    create() {				
	
        const helloButton = this.add.text(centerX - 50, centerY - 50, 'Play', { fill: '#0f0', align: 'center' })
            .setInteractive()
            .on('pointerover', () => helloButton.setStyle({ fill: '#fff' }))
            .on('pointerdown', () => {
                game.scene.start('play');
                game.scene.remove(this.scene.key);
            })
            .on('pointerout', () => helloButton.setStyle({ fill: '#0f0' }));

        const aboutButton = this.add.text(centerX - 50, centerY + 50, 'About', { fill: '#0f0', align: 'center' })
            .setInteractive()
            .on('pointerover', () => aboutButton.setStyle({ fill: '#fff' }))
            .on('pointerdown', () => console.log('pointerDown'))
            .on('pointerout', () => aboutButton.setStyle({ fill: '#0f0' }))
    }
};