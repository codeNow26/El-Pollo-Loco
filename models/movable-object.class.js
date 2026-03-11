/**
 * Extends DrawableObject with movement, physics and collision helpers.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    speedY = 5;
    acceleration = 1.5;
    otherDirection = false;
    energy = 100;
    lastHit = 0;
    hasDied = false;
    knockbackSpeed = 0;

    /**
     * Continuously apply gravitational acceleration to object.
     */
    applyGravity() {
        setInterval(() => {
            if (GAME_PAUSED) return;
            if (this.hasDied || this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Determine if object is above ground level (ignores thrown bottles).
     * @returns {boolean}
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 120;
    }

    /**
     * Axis-aligned bounding box collision test.
     * @param {MovableObject} mo
     * @returns {boolean}
     */
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height;
    }

    /**
     * Check if collision occurred from above (used for stomping).
     * @param {MovableObject} enemy
     * @returns {boolean}
     */
    isCollidingFromTop(enemy) {
        const characterBottom = this.y + this.height;
        const enemyTop = enemy.y;
        return (
            this.isColliding(enemy) &&
            this.speedY <= 0 &&
            characterBottom <= enemyTop + 20
        );
    }

    /**
     * Apply damage to the character and trigger effects.
     */
    hit() {
        this.world.character.energy -= 20;
        this.world.character.playRandomHurtSound();
        if (this.world.character.energy <= 0) {
            this.world.character.energy = 0;
            this.die();
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Move object according to any stored knockback velocity.
     */
    applyKnockback() {
        if (this.knockbackSpeed !== 0) {
            this.x += this.knockbackSpeed;

            if (this.speedY < 4) {
                this.y -= 2;
            }

            this.knockbackSpeed *= 0.85;

            if (Math.abs(this.knockbackSpeed) < 0.5) {
                this.knockbackSpeed = 0;
            }
        }
    }

    /**
     * True if object was hit less than one second ago.
     * @returns {boolean}
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Convenience check if the character’s energy is depleted.
     * @returns {boolean}
     */
    isDead() {
        return this.character.energy == 0;
    }

    /**
     * Shift object right by its speed unless paused.
     */
    moveRight() {
        if (GAME_PAUSED) return;
        this.x += this.speed;
    }

    /**
     * Shift object left by its speed unless paused.
     */
    moveLeft() {
        if (GAME_PAUSED) return;
        this.x -= this.speed;
    }

    /**
     * Cycle through the provided image array for animation.
     * @param {string[]} images
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Play animation frames once and stop.
     * @param {string[]} images
     */
    playAnimationOnce(images) {
        let i = 0;
        const interval = setInterval(() => {
            this.img = this.imageCache[images[i]];
            i++;
            if (i >= images.length) {
                clearInterval(interval);
            }
        }, 150);
    }

    /**
     * Initiate a jump by setting vertical velocity and playing sound.
     */
    jump() {
        if (GAME_PAUSED) return;
        this.playJumpAudio();
        if (this.isAboveGround()) return;
        this.jumpPrepStart = Date.now();
        this.speedY = 20;
    }

    /**
     * Play one of the jump sound effects randomly.
     */
    playJumpAudio() {
        const randomIndex = Math.floor(Math.random() * this.AUDIO_JUMP.length);
        this.jumpAudio.src = this.AUDIO_JUMP[randomIndex];
        this.jumpAudio.playbackRate = this.speed / 6;
        this.jumpAudio.currentTime = 0;
        this.jumpAudio.play().catch(() => { });
    }

    /**
         * Pick a random clip from `list` and play it on the provided Audio object.
         * @param {HTMLAudioElement} audio - target audio to update
         * @param {string[]} list - array of source URLs
         */
    playRandomSound(audio, list) {
        const randomIndex = Math.floor(Math.random() * list.length);
        audio.src = list[randomIndex];
        audio.currentTime = 0;
        audio.play();
    }

    /**
         * Play a random walking sound unless the game is paused.
         */
    playRandomWalkSound() {
        if (GAME_PAUSED) return;
        this.playRandomSound(this.walkAudio, this.AUDIO_WALKING);
    }

    /**
         * Trigger a random hurt sound effect.
         */
    playRandomHurtSound() {
        this.playRandomSound(this.hurtAudio, this.AUDIO_HURT);
    }

        /**
     * Play walking sounds at intervals while moving.
     */
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
}