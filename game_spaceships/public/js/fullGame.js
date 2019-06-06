class FullGameScene extends Phaser.Scene {
    init(data) {
        this.maxNumberOfPlayers = data.max;
    }

    create() {
		
        this.cameras.main.setBackgroundColor(0x9ea7a6);
        this.gameFullTitle = this.add.text(150, 150, '', { fontSize: '48px', fill: '#000000' });
        this.gameFullFooter = this.add.text(200, 200, '', { fontSize: '16px', fill: '#000000' });
        this.gameFullTitle.setText('Gra jest pełna!');
        this.gameFullFooter.setText('Maksymalna ilość graczy w grze: ' + this.maxNumberOfPlayers);
    }
}

