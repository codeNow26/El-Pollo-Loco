class Coin extends MovableObject {
    height = 150;
    width = 150;
    y = 260;
    collected = false;

    constructor(x) {
        super();
        this.loadImage('./img/8_coin/coin_2.png');
        this.coinAudio = new Audio("audio/Coins/coin1.wav");
        this.coinAudio.volume = 0.3;
        this.x = x;
    }

    collect() {
        this.collected = true;
        console.log("character has collected coin");
        this.coinAudio.currentTime = 0;
        this.coinAudio.play();
    }
}