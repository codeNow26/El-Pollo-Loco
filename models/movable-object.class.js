class MovableObject extends DrawableObject {
    speed = 0.15;
    speedY = 5;
    acceleration = 1.5;
    otherDirection = false;
    energy = 100;
    lastHit = 0;
    hasDied = false;
    knockbackSpeed = 0;

    applyGravity() {
        setInterval(() => {
            if (GAME_PAUSED) return;
            if (this.hasDied || this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 120;
    }

    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height;
    }

    isCollidingFromTop(enemy) {
        const characterBottom = this.y + this.height;
        const enemyTop = enemy.y;
        return (
            this.isColliding(enemy) &&
            this.speedY <= 0 &&
            characterBottom <= enemyTop + 20

        );
    }

    hit() {
        this.world.character.energy -= 19;
        this.world.character.playRandomHurtSound();
        if (this.world.character.energy < 0) {
            this.world.character.energy = 0;
            this.die();
        } else {
            this.lastHit = new Date().getTime();
        }
    }

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

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // difference in ms
        timepassed = timepassed / 1000; // difference in s
        return timepassed < 1;
    }

    isDead() {
        return this.character.energy == 0;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        if (GAME_PAUSED) return;
        this.x -= this.speed;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump() {
        if (GAME_PAUSED) return;
        this.playJumpAudio();
        if (this.isAboveGround()) return;
        this.jumpPrepStart = Date.now();
        this.speedY = 20;
    }

    playJumpAudio() {
        const randomIndex = Math.floor(Math.random() * this.AUDIO_JUMP.length);
        this.jumpAudio.src = this.AUDIO_JUMP[randomIndex];
        this.jumpAudio.playbackRate = this.speed / 6;
        this.jumpAudio.currentTime = 0;
        this.jumpAudio.play();
    }
}