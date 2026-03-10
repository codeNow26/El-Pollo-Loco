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
    statusBarEndboss;
    gameOverPending = false;
    winPending = false;
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        
        this.statusBarHealth = new StatusBarHealth();
        this.statusBarCoin = new StatusBarCoins();
        this.statusBarBottle = new StatusBarBottle();
        this.statusBarEndboss = new StatusBarEndboss();

        this.pauseCanvas = document.createElement("canvas");
        this.pauseCanvas.width = this.canvas.width;
        this.pauseCanvas.height = this.canvas.height;
        this.pauseCtx = this.pauseCanvas.getContext("2d");

        this.lastBottleThrow = 0;
        this.endboss = this.level.enemies.find(e => e instanceof Endboss);

        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            if (this.GAME_PAUSED) return;
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkGameOver();
            this.checkWonGame();
        }, 1000 / 25);
    }

    checkThrowObjects() {
        if (this.canThrowBottle()) {
            this.throwBottle();
        }
    }

    canThrowBottle() {
        let now = Date.now();
        return this.keyboard.E &&
            now - this.lastBottleThrow > 1000;
    }

    throwBottle() {
        let now = Date.now();
        this.character.stopSnoring();
        this.character.lastActiveTime = now;
        const percentage = this.character.useBottle(this.level.maxBottles);
        if (percentage !== false) {
            this.throwableObjects.push(
                new ThrowableObject(this.character.x + 100, this.character.y + 100)
            );
            this.statusBarBottle.setPercentage(percentage);
            this.lastBottleThrow = now;
        }
        this.keyboard.E = false;
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
                    this.handleBottleHit(enemy);
                }
            });
        });
    }

    handleBottleHit(enemy) {
        if (enemy instanceof Endboss) {
            this.damageEndboss(enemy);
        } else {
            enemy.die();
        }
    }

    damageEndboss(enemy) {
        const oldEnergy = enemy.energy;

        enemy.hurt();

        if (enemy.energy !== oldEnergy) {
            this.statusBarEndboss.setPercentage(enemy.energy);
        }
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (enemy.hasDied) return;
            if (this.character.isCollidingFromTop(enemy)) {
                this.handleJumpOnEnemy(enemy);
                return;
            }
            if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                this.handleEnemyHit(enemy);
            }
        });
    }

    handleJumpOnEnemy(enemy) {
        enemy.die();
        this.character.jumpAfterKill();
    }

    handleEnemyHit(enemy) {
        this.character.hit();
        this.checkHitDirection(enemy);
        this.statusBarHealth.setPercentage(this.character.energy);
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
        if (GAME_OVER) {
            this.drawGameOverScreen();
            requestAnimationFrame(() => this.draw());
            return;
        }
        this.clearCanvas();
        this.drawBackground();
        this.drawUI();
        this.drawGameObjects();
        requestAnimationFrame(() => this.draw());
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawUI() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        if (this.endboss && this.endboss.hadFirstContact) {
            this.addToMap(this.statusBarEndboss);
        }
    }

    drawGameObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottle);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.character.applyKnockback();
        this.ctx.translate(-this.camera_x, 0);
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
        this.character.stopSnoring();
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

    showGameOverScreen() {
        document.getElementById("game-over-screen").style.display = "block";
    }

    hideGameOverScreen() {
        document.getElementById("game-over-screen").style.display = "none";
    }

    showGameWonScreen() {
        document.getElementById("game-won-screen").style.display = "block";
    }

    hideGameWonScreen() {
        document.getElementById("game-won-screen").style.display = "none";
    }

    checkWonGame() {
        this.level.enemies.forEach((enemy) => {
            if (this.isEndbossDead(enemy)) {
                this.wonGame();
            }
        });
    }

    isEndbossDead(enemy) {
        return enemy instanceof Endboss &&
            enemy.hasDied &&
            !GAME_OVER &&
            !this.winPending;
    }

    wonGame() {
        this.winPending = true;
        setTimeout(() => {
            GAME_OVER = true;
            this.winPending = false;
            backgroundMusic.volume = 0;
            this.pauseCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.pauseCtx.drawImage(this.canvas, 0, 0);
            this.showGameWonScreen();
            startGameWonMusic();
        }, 1400);
    }

    checkGameOver() {
        if (this.triggerGameOver()) {
            this.gameOver();
        }
    }

    triggerGameOver() {
        return this.character.hasDied && !GAME_OVER && !this.gameOverPending;
    }

    gameOver() {
        this.gameOverPending = true;
        setTimeout(() => {
            GAME_OVER = true;
            this.gameOverPending = false;
            this.pauseCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.pauseCtx.drawImage(this.canvas, 0, 0);
            this.showGameOverScreen();
            startgameOverMusic();
            backgroundMusic.volume = 0;
        }, 2000);
    }

    drawGameOverScreen() {
        this.ctx.save();
        this.ctx.filter = "blur(3px)";
        this.ctx.drawImage(this.pauseCanvas, 0, 0);
        this.ctx.filter = "none";
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.font = "64px Arial";
        this.ctx.textAlign = "center";
        this.ctx.restore();
    }

    resetWorld() {
        clearAllIntervals();
        this.resetGameState();
        this.resetUI();
        this.resetLevel();
        this.resetMusic();
        this.run();
    }

    resetGameState() {
        GAME_OVER = false;
        GAME_PAUSED = false;
        this.gameOverPending = false;
        this.winPending = false;
        this.camera_x = 0;
        this.throwableObjects = [];
    }

    resetUI() {
        this.hideGameOverScreen();
        this.hideGameWonScreen();
        this.hidePauseMenu();
    }

    resetLevel() {
        initLevel();
        this.level = level1;
        this.character = new Character();
        this.character.world = this;
    }

    resetMusic() {
        if (gameOverMusic) {
            gameOverMusic.pause();
            gameOverMusic.currentTime = 0;
        }
        if (gameWonMusic) {
            gameWonMusic.pause();
            gameWonMusic.currentTime = 0;
        }
        backgroundMusic.currentTime = 0;
        backgroundMusic.volume = 0.2;
    }
}




