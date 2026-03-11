/**
 * Bottle collectible that flips on the ground and can be picked up.
 */
class Bottle extends MovableObject {
    height = 100;
    width = 100;
    y = 330;
    collected = false;

    /**
     * @param {number} x  initial horizontal position
     */
    constructor(x) {
        super();
        this.x = x;

        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.otherDirection = false;
        this.flipAnimation();

        this.bottleAudio = new Audio("audio/Bottle/pickupBottle.wav")
        this.bottleAudio.volume = 0.3;

    }

    /**
     * Mark as collected and play pickup sound.
     */
    collect() {
        this.collected = true;
        this.bottleAudio.play();
    }

    /**
     * Toggle direction regularly to animate bottle spin.
     */
    flipAnimation() {
        this.flipInterval = setInterval(() => {
            this.otherDirection = !this.otherDirection;
        }, 500);
    }

}