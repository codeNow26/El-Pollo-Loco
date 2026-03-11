/**
 * Smaller variant of chicken enemy with identical behavior.
 */
class SmallChicken extends MovableObject {
    height = 70;
    width = 60;
    y = 360;


    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ]

    IMAGE_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    AUDIO_CHICKEN_DEAD = [
        "audio/Chicken/Chicken Die1.mp3",
        "audio/Chicken/Chicken Die2.mp3",
        "audio/Chicken/Chicken Die3.mp3"
    ]

    /**
     * @param {number} x  starting horizontal position
     */
    constructor(x) {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.speed = 0.15 + Math.random() * 0.25;
        this.applyGravity();
        this.animate();
        this.chickenDeadAudio = new Audio()
        this.chickenDeadAudio.volume = 0.4;
        this.x = x;
    }

    /**
     * Kick off movement and animation loops.
     */
    animate() {
        setInterval(() => {
            if (this.hasDied) return;
            this.moveLeft();
        }, 1000 / 60);
        setInterval(() => {
            if (this.hasDied) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
        setInterval(() => {
            this.randomJump();
        }, 500);
    }

    /**
     * Trigger death state with sound.
     */
    die() {
        if (this.hasDied) return;
        this.hasDied = true;
        this.speed = 0;
        this.speedY = 0;
        this.acceleration = 0;
        this.y = 360;

        this.loadImage(this.IMAGE_DEAD);
        this.playRandomChickenDeadSound();
    }

    /**
     * Play random death audio clip.
     */
    playRandomChickenDeadSound() {
        const randomIndex = Math.floor(Math.random() * this.AUDIO_CHICKEN_DEAD.length);
        this.chickenDeadAudio.src = this.AUDIO_CHICKEN_DEAD[randomIndex];
        this.chickenDeadAudio.play();
    }

    /**
     * Check if the chicken is currently in the air.
     * Resets position when falling below ground level.
     * @returns {boolean} true when above the ground line
     */
    isAboveGround() {
        if (this.hasDied) return false;
          if (this.y > 360) {
            this.y = 360;
            this.speedY = 0;
        }
        return this.y < 360;
    }

    /**
     * Occasionally initiate a jump when on the ground.
     */
    randomJump() {
        if (this.hasDied) return;
        if (!this.isAboveGround()) {
            if (Math.random() < 0.08) {
                this.speedY = 20;
            }
        }
    }

}