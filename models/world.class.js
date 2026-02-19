class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth;
    statusBarCoin;
    statusBarBottle;
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.statusBarHealth = new StatusBarHealth();
        this.statusBarCoin = new StatusBarCoins();
        this.statusBarBottle = new StatusBarBottle();
        this.draw();
        this.setWorld();
        this.run();


        this.pauseCanvas = document.createElement("canvas");
        this.pauseCanvas.width = this.canvas.width;
        this.pauseCanvas.height = this.canvas.height;
        this.pauseCtx = this.pauseCanvas.getContext("2d");
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            if (this.GAME_PAUSED) return;
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000 / 25);
    }

    checkThrowObjects() {
        if (this.keyboard.E) {
            const percentage = this.character.useBottle(this.level.maxBottles);

            if (percentage !== false) {
                this.throwableObjects.push(
                    new ThrowableObject(this.character.x + 100, this.character.y + 100)
                );
                this.statusBarBottle.setPercentage(percentage);
            }
            this.keyboard.E = false;
        }
    }

    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkCoinCollisions()
        this.checkBottleCollisions();
        this.checkThrowableCollisions();
    }

    checkThrowableCollisions() {
        this.throwableObjects.forEach(bottle => {
            this.level.enemies.forEach(enemy => {
                if (!enemy.hasDied && bottle.checkImpact(enemy)) {
                    enemy.die();
                }
                bottle.checkImpact(enemy);
            });
        });
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (enemy.hasDied) return;
            if (this.character.isCollidingFromTop(enemy)) {
                enemy.die();
                this.character.jumpAfterKill();
                return;
            }
            if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                this.character.hit();
                this.checkHitDirection(enemy);
                this.statusBarHealth.setPercentage(this.character.energy);
            }
        });
    }

    checkHitDirection(enemy) {
        const enemyCenter = enemy.x + enemy.width / 2;
        const characterCenter = this.character.x + this.character.width / 2;

        if (enemyCenter < characterCenter) {
            this.character.knockbackSpeed = 20;   // nach rechts
        } else {
            this.character.knockbackSpeed = -20;  // nach links
        }
    }

    checkCoinCollisions() {
        this.level.coins.forEach((coin) => {
            if (!coin.collected && this.character.isColliding(coin)) {
                coin.collect();
                this.character.coins++;
                const percentage =
                    (this.character.coins / this.level.maxCoins) * 100;
                this.statusBarCoin.setPercentage(percentage);
            }
            this.level.coins = this.level.coins.filter(coin => !coin.collected);
        });
    }

    checkBottleCollisions() {
        this.level.bottle.forEach((bottle) => {
            if (!bottle.collected && this.character.isColliding(bottle)) {
                bottle.collect();
                this.character.bottle++;

                const percentage =
                    (this.character.bottle / this.level.maxBottles) * 100;

                this.statusBarBottle.setPercentage(percentage);
            }
            this.level.bottle = this.level.bottle.filter(bottle => !bottle.collected);
        });
    }

    draw() {
        if (GAME_PAUSED) {
            this.drawPauseScreen();
            requestAnimationFrame(() => this.draw());
            return;
        }


        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0); // Back
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        this.ctx.translate(this.camera_x, 0); // Forwards
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottle);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.character.applyKnockback();
        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame(() => this.draw()
        );
    }

    addObjectsToMap(objects) {
        objects.forEach((obj) => {
            this.addToMap(obj);
        })
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo)
        }
    }

    updateBackgrounds() {
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    checkGameOver() {
        if (this.character.hasDied()) {
            showRestartButton();
            return true;
        }
        return false;
    }

    showRestartButton() {
        document.getElementById("restart-button").style.display = "block";
    }

    togglePause() {
        if (GAME_PAUSED) {
            this.hidePauseMenu();
            GAME_PAUSED = false;
            backgroundMusic.volume = 0.2;
        } else {
            this.pauseGame();
            this.showPauseMenu();
            GAME_PAUSED = true;
        }
    }

    pauseGame() {
        GAME_PAUSED = true;
        this.pauseCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.pauseCtx.drawImage(this.canvas, 0, 0);
        backgroundMusic.volume = 0.05;
    }

    drawPauseScreen() {
        this.ctx.save();
        this.ctx.filter = "blur(2px)";
        this.ctx.drawImage(this.pauseCanvas, 0, 0);
        this.ctx.filter = "none";
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.font = "48px Arial";
        this.ctx.textAlign = "center";
        this.ctx.restore();
    }


    showPauseMenu() {
        document.getElementById("pause-menu").style.display = "block";
    }

    hidePauseMenu() {
        document.getElementById("pause-menu").style.display = "none";
    }

}




