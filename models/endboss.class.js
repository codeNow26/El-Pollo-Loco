class Endboss extends MovableObject {

    height = 500;
    width = 300;
    y = -35;

    hadFirstContact = false;
    isIntroPlaying = false;
    canMove = false;

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

    constructor() {
        super().loadImage(this.IMAGES_INTRO[0]);
        this.loadImages(this.IMAGES_INTRO);
        this.loadImages(this.IMAGES_WALKING);
        this.speed = 2;
        this.x = 2500;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.hasDied) return;
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

}

