class Endboss extends MovableObject {

    height = 500;
    width = 300;
    y = -35;
    energy = 100;
    lastHit = 0;
    hadFirstContact = false;
    isIntroPlaying = false;
    canMove = false;
    deathAnimationStarted = false;

    IMAGES_INTRO = [
        "img/4_enemie_boss_chicken/2_alert/G5.png",
        "img/4_enemie_boss_chicken/2_alert/G6.png",
        "img/4_enemie_boss_chicken/2_alert/G7.png",
        "img/4_enemie_boss_chicken/2_alert/G8.png",
        "img/4_enemie_boss_chicken/2_alert/G9.png",
        "img/4_enemie_boss_chicken/2_alert/G10.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png",
        "img/4_enemie_boss_chicken/2_alert/G12.png",
    ];

    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png",
    ]

    IMAGES_HURT = [
        "img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img/4_enemie_boss_chicken/4_hurt/G22.png",
        "img/4_enemie_boss_chicken/4_hurt/G23.png",
    ]

    IMAGES_DEAD = [
        "img/4_enemie_boss_chicken/5_dead/G24.png",
        "img/4_enemie_boss_chicken/5_dead/G25.png",
        "img/4_enemie_boss_chicken/5_dead/G26.png",
    ]

    AUDIO_HURT = [
        "audio/Endboss/ChickenEndbossHurt1.mp3",
        "audio/Endboss/ChickenEndbossHurt2.mp3",
        "audio/Endboss/ChickenEndbossHurt3.mp3",
        "audio/Endboss/ChickenEndbossHurt4.mp3",
        "audio/Endboss/ChickenEndbossHurt5.mp3",
    ]

    AUDIO_DEAD = [

    ]

    constructor() {
        super().loadImage(this.IMAGES_INTRO[0]);
        this.loadImages(this.IMAGES_INTRO);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.endbossHurtAudio = new Audio()
        this.endbossHurtAudio.volume = 0.4;
        this.endbossDieAudio = new Audio("audio/Endboss/ChickenEndbossDie.mp3");
        this.endbossDieAudio.volume = 0.4;
        this.speed = 2;
        this.x = 2500;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.hadFirstContact) {
                if (world.character.x > 1900) {
                    this.startIntro();
                }
                return;
            }
            if (this.canMove) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.hasDied && !this.deathAnimationStarted) {
                this.deathAnimationStarted = true;
                this.playAnimationOnce(this.IMAGES_DEAD);
                return;
            }
            if (!this.hasDied && this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
        }, 120);
    }

    startIntro() {
        this.hadFirstContact = true;
        this.isIntroPlaying = true;
        this.canMove = false;

        let i = 0;

        const introInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_INTRO[i]];
            i++;

            if (i >= this.IMAGES_INTRO.length) {
                clearInterval(introInterval);
                this.isIntroPlaying = false;
                this.canMove = true;
                this.startWalkingAnimation();
            }
        }, 200);
    }

    startWalkingAnimation() {
        this.walkingInterval = setInterval(() => {
            if (this.hasDied || this.isIntroPlaying) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 150);
    }

    hurt() {
        if (this.hasDied) return;
        let timepassed = (Date.now() - this.lastHit) / 1000;
        if (timepassed < 1) return;
        this.lastHit = Date.now();
        if (this.energy - 20 <= 0) {
            this.die();
            return;
        }
        this.energy -= 20;
        this.x += 60;
        this.playRandomEndbossHurtSound();
    }

    die() {
        if (this.hasDied) return;
        this.hasDied = true;
        this.speedY = 25;
        this.speed = 0;
        this.endbossDieAudio.play()
    }

    playRandomEndbossHurtSound() {
        const randomIndex = Math.floor(Math.random() * this.AUDIO_HURT.length);
        this.endbossHurtAudio.src = this.AUDIO_HURT[randomIndex];
        this.endbossHurtAudio.currentTime = 0;
        this.endbossHurtAudio.play();
    }
}

