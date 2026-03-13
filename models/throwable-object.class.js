/**
 * Projectile bottle that spins through the air and splashes on impact.
 */
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
    ];

    IMAGES_BOSS_EGG = [
        "img/4_enemie_boss_chicken/3_attack/EGG TOP.png",
        "img/4_enemie_boss_chicken/3_attack/EGG LEFT.png",
        "img/4_enemie_boss_chicken/3_attack/EGG DOWN.png",
        "img/4_enemie_boss_chicken/3_attack/EGG RIGHT.png",
    ];

    IMAGE_BOSS_EGG_SPLASH = [
        "img/4_enemie_boss_chicken/3_attack/EGG SPLASH.png",
        "img/4_enemie_boss_chicken/3_attack/EGG SPLASH 2.png",
        "img/4_enemie_boss_chicken/3_attack/EGG SPLASH 3.png",
        "img/4_enemie_boss_chicken/3_attack/EGG SPLASH 4.png",
        "img/4_enemie_boss_chicken/3_attack/EGG SPLASH 5.png",
    ]

    /**
     * @param {number} x  starting horizontal position
     * @param {number} y  starting vertical position
     */
    constructor(x, y, direction, type = "bottle") {
        super();
        this.x = x;
        this.y = y;
        this.type = type;
        this.direction = direction;
        this.width = 50;
        this.height = 50;
        this.currentImage = 0;

        if (this.type === "egg") {
            this.loadImage(this.IMAGES_BOSS_EGG[0]);
        } else {
            this.loadImage(this.IMAGES_SALSA_BOTTLE[0]);
        }
        this.loadImages(this.IMAGES_SALSA_BOTTLE);
        this.loadImages(this.IMAGES_BOSS_EGG);
        this.splashAudio = new Audio("audio/Bottle/splashBottle.mp3");
        this.splashAudio.volume = 0.2;
        this.animate();
        this.throw();
    }

    /**
     * Launch object forward and apply gravity.
     */
    throw() {
        this.speedY = 10;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (GAME_PAUSED) return;
            if (this.isBroken) return;
            this.x += 10 * this.direction;
        }, 25);
    }

    /**
     * Rotate bottle while airborne by cycling images.
     */
    animate() {
        this.rotationInterval = setInterval(() => {
            if (this.isBroken) return;
            if (this.type === "bottle") {
                this.playAnimation(this.IMAGES_SALSA_BOTTLE);
            }
            else {
                this.playAnimation(this.IMAGES_BOSS_EGG);
            }
        }, 100);
    }

    /**
     * Handle impact: stop and show splash animation.
     */
    splash() {
        this.isBroken = true;
        this.stopMovement();
        if (this.type === "bottle") {
            this.playSplashAnimation();
        } else {
            this.playEggSplashAnimation();
        }
    }

    /**
     * Cease all movement and clear timers.
     */
    stopMovement() {
        this.speedY = 0;
        clearInterval(this.throwInterval);
        clearInterval(this.rotationInterval);
    }

    /**
     * Swap to splash frames and play underwater sound.
     */
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

    playEggSplashAnimation() {
        this.loadImages(this.IMAGE_BOSS_EGG_SPLASH);
        this.splashAudio.play();
        this.currentImage = 0;
         this.splashInterval = setInterval(() => {
            this.playAnimation(this.IMAGE_BOSS_EGG_SPLASH);
            if (this.currentImage >= this.IMAGE_BOSS_EGG_SPLASH.length) {
                clearInterval(this.splashInterval);
            }
        }, 80);
        
    }

    /**
     * Test against an enemy; trigger splash on hit.
     * @param {MovableObject} enemy
     * @returns {boolean} true if impact occurred
     */
    checkImpact(enemy) {
        if (this.isBroken) return;

        if (this.isColliding(enemy)) {
            this.splash();
            return true;
        }
        return false;
    }
}