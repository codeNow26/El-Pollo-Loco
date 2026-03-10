class Coin extends MovableObject {
    height = 150;
    width = 150;
    y = 260;
    collected = false;

    constructor(x) {
        super();
        this.x = x;

        this.loadImage('./img/8_coin/coin_2.png');

        this.coinAudio = new Audio("audio/Coins/coin1.wav");
        this.coinAudio.volume = 0.3;
    }

    collect() {
        this.collected = true;
        this.coinAudio.currentTime = 0;
        this.coinAudio.play();
    }
}