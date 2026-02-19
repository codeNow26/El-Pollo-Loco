class Chicken extends MovableObject {
    height = 100;
    width = 90;
    y = 330;


    IMAGES_WALKING = [
        "./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "./img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ]

    IMAGE_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    AUDIO_CHICKEN_DEAD = [
        "audio/Chicken/Chicken Die1.mp3",
        "audio/Chicken/Chicken Die2.mp3",
        "audio/Chicken/Chicken Die3.mp3"
    ]

    constructor(x) {
        super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
        this.chickenDeadAudio = new Audio()
        this.chickenDeadAudio.volume = 0.4;
        this.x = x;
    }

    animate() {
        setInterval(() => {
            if (this.hasDied) return;
            this.moveLeft();
        }, 1000 / 60);
        setInterval(() => {
            if (this.hasDied) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    die() {
        if (this.hasDied) return;
        this.hasDied = true;
        this.speedY = 25;
        this.speed = 0;
        this.loadImage(this.IMAGE_DEAD);
        this.playRandomChickenDeadSound();
    }

    playRandomChickenDeadSound() {
        const randomIndex = Math.floor(Math.random() * this.AUDIO_CHICKEN_DEAD.length);
        this.chickenDeadAudio.src = this.AUDIO_CHICKEN_DEAD[randomIndex];
        this.chickenDeadAudio.play();
    }

}