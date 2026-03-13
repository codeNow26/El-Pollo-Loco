/**
 * Collectible coin object that plays sound on pickup.
 */
class Coin extends MovableObject {
    height = 150;
    width = 150;
    y = 260;
    collected = false;



    /**
     * @param {number} x  horizontal start position
     */
    constructor(x, y) {
        super();
        this.offsetLeft = 40;
        this.offsetRight = 40;
        this.offsetTop = 40;
        this.offsetBottom = 40;
        this.x = x;
        this.y = y;
        this.loadImage('./img/8_coin/coin_2.png');

        this.coinAudio = new Audio("audio/Coins/coin1.wav");
        this.coinAudio.volume = 0.3;
    }

    /**
     * Mark coin as collected and play audio.
     */
    collect() {
        this.collected = true;
        this.coinAudio.currentTime = 0;
        this.coinAudio.play();
    }
}