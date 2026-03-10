class Bottle extends MovableObject {
    height = 100;
    width = 100;
    y = 330;
    collected = false;

    constructor(x) {
        super();
        this.x = x;

        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.otherDirection = false;

        setInterval(() => {
            this.otherDirection = !this.otherDirection;
        }, 500);

        this.bottleAudio = new Audio("audio/Bottle/pickupBottle.wav")
        this.bottleAudio.volume = 0.3;

    }

    collect() {
        this.collected = true;
        this.bottleAudio.play();
    }

}