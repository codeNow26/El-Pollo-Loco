class Bottle extends MovableObject {
    height = 100;
    width = 100;
    y = 330;
    collected = false;

    constructor(x) {
        super();
        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.bottleAudio = new Audio("audio/Bottle/pickupBottle.wav")
        this.bottleAudio.volume = 0.3;
        this.x = x;
    }

    collect() {
        this.collected = true;
        this.bottleAudio.play();
    }

}