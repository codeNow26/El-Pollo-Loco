class ThrowableObject extends MovableObject {

    IMAGES_SALSA_BOTTLE = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];

    IMAGES_SALSA_BOTTLE_SPLASH = [
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ]

    constructor(x, y) {
        super().loadImage(this.IMAGES_SALSA_BOTTLE[0]);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;

        this.currentImage = 0;
        this.loadImages(this.IMAGES_SALSA_BOTTLE);
        this.splashAudio = new Audio("audio/Bottle/splashBottle.mp3");
        this.splashAudio.volume = 0.2;
        this.animate();
        this.throw();
    }

    throw() {
        this.speedY = 10;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (GAME_PAUSED) return;
            if (this.isBroken) return;
            this.x += 10;
        }, 25);
    }

    animate() {
        this.rotationInterval = setInterval(() => {
            if (this.isBroken) return;
            this.playAnimation(this.IMAGES_SALSA_BOTTLE);
        }, 100);
    }

    splash() {
        this.isBroken = true;
        this.stopMovement();
        this.playSplashAnimation();
    }

    stopMovement() {
        this.speedY = 0;
        clearInterval(this.throwInterval);
        clearInterval(this.rotationInterval);
    }

    playSplashAnimation() {
        this.loadImages(this.IMAGES_SALSA_BOTTLE_SPLASH);
        this.splashAudio.play();
        this.currentImage = 0;
        this.splashInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_SALSA_BOTTLE_SPLASH);
            if (this.currentImage >= this.IMAGES_SALSA_BOTTLE_SPLASH.length) {
                clearInterval(this.splashInterval);
            }
        }, 80);
    }

    checkImpact(enemy) {
        if (this.isBroken) return;

        if (this.isColliding(enemy)) {
            this.splash();
            return true;
        }
        return false;
    }
}