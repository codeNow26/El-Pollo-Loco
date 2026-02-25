class Character extends MovableObject {

    height = 300;
    width = 150;
    speed = 8;
    coins = 0;
    bottle = 0;
    jumpFrame = 0;
    lastJumpFrameTime = 0;
    jumpFrameDelay = 0;
    walkFrameSpeed = 40;
    sleepFrameDelay = 100;
    lastSleepFrameTime = 0;
    isPreparingJump = false;
    jumpPrepFrames = 0;
    lastActiveTime = 0;

    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png",
    ];

    IMAGES_JUMPING = [
        "img/2_character_pepe/3_jump/J-31.png",
        "img/2_character_pepe/3_jump/J-32.png",
        "img/2_character_pepe/3_jump/J-33.png",
        "img/2_character_pepe/3_jump/J-34.png",
        "img/2_character_pepe/3_jump/J-35.png",
        "img/2_character_pepe/3_jump/J-36.png",
        "img/2_character_pepe/3_jump/J-37.png",
        "img/2_character_pepe/3_jump/J-38.png",
        "img/2_character_pepe/3_jump/J-39.png",
    ];

    IMAGES_DEAD = [
        "img/2_character_pepe/5_dead/D-51.png",
        "img/2_character_pepe/5_dead/D-52.png",
        "img/2_character_pepe/5_dead/D-53.png",
        "img/2_character_pepe/5_dead/D-54.png",
        "img/2_character_pepe/5_dead/D-55.png",
        "img/2_character_pepe/5_dead/D-56.png",
    ];

    IMAGES_HURT = [
        "img/2_character_pepe/4_hurt/H-41.png",
        "img/2_character_pepe/4_hurt/H-42.png",
        "img/2_character_pepe/4_hurt/H-43.png",
    ];

    IMAGES_SLEEPING = [
        "img/2_character_pepe/1_idle/long_idle/I-11.png",
        "img/2_character_pepe/1_idle/long_idle/I-12.png",
        "img/2_character_pepe/1_idle/long_idle/I-13.png",
        "img/2_character_pepe/1_idle/long_idle/I-14.png",
        "img/2_character_pepe/1_idle/long_idle/I-15.png",
        "img/2_character_pepe/1_idle/long_idle/I-16.png",
        "img/2_character_pepe/1_idle/long_idle/I-17.png",
        "img/2_character_pepe/1_idle/long_idle/I-18.png",
        "img/2_character_pepe/1_idle/long_idle/I-19.png",
        "img/2_character_pepe/1_idle/long_idle/I-20.png",
    ];

    AUDIO_WALKING = [
        "audio/jute-dh-steps/stepdirt_1.wav",
        "audio/jute-dh-steps/stepdirt_2.wav",
        "audio/jute-dh-steps/stepdirt_3.wav",
        "audio/jute-dh-steps/stepdirt_4.wav",
        "audio/jute-dh-steps/stepdirt_5.wav",
        "audio/jute-dh-steps/stepdirt_6.wav",
        "audio/jute-dh-steps/stepdirt_7.wav",
        "audio/jute-dh-steps/stepdirt_8.wav",
    ]

    AUDIO_JUMP = [
        "audio/Jump/Jump1.mp3",
        "audio/Jump/Jump2.mp3",
        "audio/Jump/Jump3.mp3",
        "audio/Jump/Jump4.mp3",
        "audio/Jump/Jump5.mp3",
    ]

    AUDIO_HURT = [
        "audio/hurt/hurtSound1.mp3",
        "audio/hurt/hurtSound2.mp3",
        "audio/hurt/hurtSound3.mp3",
        "audio/hurt/hurtSound4.mp3",
        "audio/hurt/hurtSound5.mp3",
    ]
    world;

    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.y = 140;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SLEEPING);
        this.jumpAudio = new Audio();
        this.jumpAudio.volume = 0.6;
        this.walkAudio = new Audio();
        this.walkAudio.volume = 0.3;
        this.throwAudio = new Audio("audio/Bottle/throwBottle.mp3");
        this.throwAudio.volume = 0.2;
        this.hurtAudio = new Audio();
        this.hurtAudio.volume = 0.4;
        this.dieAudio = new Audio("audio/hurt/Die Sound.mp3");
        this.dieAudio.volume = 0.4;
        this.lastStepTime = 0;
        this.lastActiveTime = Date.now();
        this.stepDelay = 300;
        this.animate();
        this.applyGravity();
    }

    playRandomWalkSound() {
        const randomIndex = Math.floor(Math.random() * this.AUDIO_WALKING.length);
        this.walkAudio.src = this.AUDIO_WALKING[randomIndex];
        this.walkAudio.playbackRate = this.speed / 6;
        this.walkAudio.currentTime = 0;
        this.walkAudio.play();
    }

    playRandomHurtSound() {
        const randomIndex = Math.floor(Math.random() * this.AUDIO_HURT.length);
        this.hurtAudio.src = this.AUDIO_HURT[randomIndex];
        this.hurtAudio.playbackRate = this.speed / 6;
        this.hurtAudio.currentTime = 0;
        this.hurtAudio.play();
    }

    animate() {
        setInterval(() => {

            if (!this.noKeyPressed() || this.isAboveGround()) {
                this.lastActiveTime = Date.now();
            }

            if (!this.isAboveGround() && (this.world.keyboard.SPACE || this.world.keyboard.UP)) {
                this.jump();
            }

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x + 100;
            this.handleWalkSound();
        }, 1000 / 60);


        setInterval(() => {
            if (this.hasDied) {
                this.playAnimation(this.IMAGES_DEAD);
                this.die();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
            else if (this.isAboveGround() || this.isPreparingJump) {
                this.animateJump();
            }
            else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.animateWalk();
                } else if (this.noKeyPressed() && !this.isAboveGround()) {
                    this.sleep();
                }
            }
        }, 16);
    }


    handleWalkSound() {
        let now = Date.now();
        if (
            (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) &&
            !this.isAboveGround()
        ) {
            if (now - this.lastStepTime > this.stepDelay) {
                this.playRandomWalkSound();
                this.lastStepTime = now;
            }
        }
    }

    animateWalk() {
        let now = Date.now();
        if (now - this.lastWalkFrameTime < this.walkFrameSpeed) return;

        this.playAnimation(this.IMAGES_WALKING);
        this.lastWalkFrameTime = now;
    }

    die() {
        if (this.hasDied) return;
        this.dieAudio.play()
        this.hasDied = true;
        this.speedY = 25;
        this.speed = 0;
    }

    jumpAfterKill() {
        this.speedY = 15;
    }

    sleep() {
        let now = Date.now();
        if (now - this.lastSleepFrameTime < this.sleepFrameDelay) return;
        if (now - this.lastActiveTime > 5000) {
            this.playAnimation(this.IMAGES_SLEEPING);
            this.lastSleepFrameTime = now;
        }
    }

    animateJump() {
        let now = Date.now();
        if (now - this.jumpPrepStart < 40) {
            let prepFrame;
            if (now - this.jumpPrepStart < 15) prepFrame = 0;
            else if (now - this.jumpPrepStart < 30) prepFrame = 1;
            else prepFrame = 2;
            this.img = this.imageCache[this.IMAGES_JUMPING[prepFrame]];
            return;
        }
        let frameIndex;
        if (this.speedY > 6) {
            frameIndex = 3;
        }
        else if (this.speedY > 0) {
            frameIndex = 4;
        }
        else if (this.speedY > -10) {
            frameIndex = 6;
        }
        else if (this.speedY > -18) {
            frameIndex = 7;
        }
        else {
            frameIndex = 8;
        }
        this.img = this.imageCache[this.IMAGES_JUMPING[frameIndex]];
    }

    useBottle(maxBottles) {
        if (this.bottle <= 0) return false;
        this.throwAudio.play();
        this.bottle--;
        return (this.bottle / maxBottles) * 100;
    }


    noKeyPressed() {
        return !(
            this.world.keyboard.LEFT ||
            this.world.keyboard.RIGHT ||
            this.world.keyboard.UP ||
            this.world.keyboard.DOWN ||
            this.world.keyboard.SPACE ||
            this.world.keyboard.E
        );
    }

}