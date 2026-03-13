/**
 * Main game world container.
 * Holds references to the player character, current level,
 * input state and all game objects.  Responsible for
 * updating game logic and rendering.
 */
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

    /**
     * Create a new World instance and start the game loop.
     * @param {HTMLCanvasElement} canvas  drawing surface
     * @param {Keyboard} keyboard         input handler
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.renderer = new WorldRenderer(this);
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
        this.renderer.draw();
        this.setWorld();
        this.run();
    }

    /** Link the player character back to this world. */
    setWorld() {
        this.character.world = this;
    }

    /** Start recurring checks (collisions, win/lose, throws). */
    run() {
        setInterval(() => {
            if (this.GAME_PAUSED) return;
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkGameOver();
            this.checkWonGame();
        }, 1000 / 25);
    }

    /** If player pressed throw key and cooldown expired, fire. */
    checkThrowObjects() {
        if (this.canThrowBottle()) {
            this.throwBottle();
        }
    }

    /**
     * Determine if a bottle can be thrown based on input/timer.
     * @returns {boolean}
     */
    canThrowBottle() {
        let now = Date.now();
        return this.keyboard.E &&
            now - this.lastBottleThrow > 1000;
    }

    /**
     * Compute starting position and horizontal direction for a thrown bottle.
     * @returns {{direction: number, bottleX: number}}
     */
    getBottleThrowData() {
        let direction = 1;
        let bottleX = this.character.x + 100;
        if (this.character.otherDirection) {
            direction = -1;
            bottleX = this.character.x;
        }
        return { direction, bottleX };
    }

    /** Handle logic for throwing a bottle object. */
    throwBottle() {
        const now = Date.now();
        this.character.stopSnoring();
        this.character.lastActiveTime = now;
        const percentage = this.character.useBottle(this.level.maxBottles);
        if (percentage === false) return;
        const { direction, bottleX } = this.getBottleThrowData();
        this.throwableObjects.push(
            new ThrowableObject(bottleX, this.character.y + 100, direction)
        );
        this.statusBarBottle.setPercentage(percentage);
        this.lastBottleThrow = now;
        this.keyboard.E = false;
    }

    /** Run all collision detection routines. */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkCoinCollisions()
        this.checkBottleCollisions();
        this.checkThrowableCollisions();
    }


    /** Check collisions between all throwable objects and enemies or the player. */
    checkThrowableCollisions() {
        this.throwableObjects.forEach(obj => {
            this.checkThrowableEnemyCollisions(obj);
            this.checkThrowableCharacterCollisions(obj);
        });
    }


    /** Check if a thrown object hits any enemy and handle the result. */
    checkThrowableEnemyCollisions(obj) {
        this.level.enemies.forEach(enemy => {
            if (!enemy.hasDied && obj.checkImpact(enemy)) {
                this.handleBottleHit(enemy);
            }
        });
    }

    /** Check if a boss egg projectile collides with the player character. */
    checkThrowableCharacterCollisions(obj) {
        if (obj.type === "egg" && obj.isColliding(this.character)) {
            this.character.hit();
            this.character.knockbackSpeed = -20;
            obj.splash();
            this.statusBarHealth.setPercentage(this.character.energy);
        }
    }

    /**
     * React to a bottle hitting an enemy: kill or damage.
     * @param {Object} enemy  enemy instance that was hit
     */
    handleBottleHit(enemy) {
        if (enemy instanceof Endboss) {
            this.damageEndboss(enemy);
        } else {
            enemy.die();
        }
    }

    /**
     * Apply damage to the endboss and update UI if changed.
     * @param {Endboss} enemy
     */
    damageEndboss(enemy) {
        const oldEnergy = enemy.energy;
        enemy.hurt();
        if (enemy.energy !== oldEnergy) {
            this.statusBarEndboss.setPercentage(enemy.energy);
        }
    }

    /** Check player collisions with all enemies and handle. */
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

    /**
     * Called when character jumps on an enemy; kill it.
     * @param {Object} enemy
     */
    handleJumpOnEnemy(enemy) {
        enemy.die();
        this.character.jumpAfterKill();
    }

    /**
     * Handle logic when the player is hit by an enemy.
     * @param {Object} enemy
     */
    handleEnemyHit(enemy) {
        if (this.character.hasDied) return;
        this.character.hit();
        this.checkHitDirection(enemy);
        this.statusBarHealth.setPercentage(this.character.energy);
    }

    /**
     * Determine knockback direction based on enemy position.
     * @param {Object} enemy
     */
    checkHitDirection(enemy) {
        const enemyCenter = enemy.x + enemy.width / 2;
        const characterCenter = this.character.x + this.character.width / 2;

        if (enemyCenter < characterCenter) {
            this.character.knockbackSpeed = 20;
        } else {
            this.character.knockbackSpeed = -20;
        }
    }

    /** Collect coins when the character overlaps them. */
    checkCoinCollisions() {
        this.level.coins.forEach((coin) => {
            if (!coin.collected && this.character.isColliding(coin)) {
                coin.collect();
                this.character.coins++;
                const percentage = Math.min(
                    (this.character.coins / this.level.maxCoins) * 100,
                    100
                );
                this.statusBarCoin.setPercentage(percentage);
            }
            this.level.coins = this.level.coins.filter(coin => !coin.collected);
        });
    }

    /** Pick up bottle powerups when colliding. */
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

    /** Reveal the restart button in the DOM. */
    showRestartButton() {
        document.getElementById("restart-button").style.display = "block";
    }

    /** Toggle the pause state of the game and UI. */
    togglePause() {
        if (GAME_PAUSED) {
            this.renderer.togglePauseMenu(false);
            GAME_PAUSED = false;
            backgroundMusic.volume = 0.2;
        } else {
            this.pauseGame();
            this.renderer.togglePauseMenu(true);
            GAME_PAUSED = true;
        }
    }

    /** Pause the game, capture current screen and lower audio. */
    pauseGame() {
        GAME_PAUSED = true;
        this.character.stopSnoring();
        this.pauseCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.pauseCtx.drawImage(this.canvas, 0, 0);
        backgroundMusic.volume = 0.05;
    }

    /** Check if the endboss is dead and trigger win. */
    checkWonGame() {
        this.level.enemies.forEach((enemy) => {
            if (
                enemy instanceof Endboss &&
                enemy.hasDied &&
                !GAME_OVER &&
                !this.winPending
            ) {
                this.wonGame();
            }
        });
    }

    /** Initiate win sequence with delay and screen display  */
    wonGame() {
        this.winPending = true;
        setTimeout(() => {
            GAME_OVER = true;
            this.winPending = false;
            backgroundMusic.volume = 0;
            this.pauseCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.pauseCtx.drawImage(this.canvas, 0, 0);
            this.renderer.toggleGameWonScreen(true);
            startGameWonMusic();
        }, 1400);
    }

    /** Check if game-over conditions are met. */
    checkGameOver() {
        if (this.character.hasDied && !GAME_OVER && !this.gameOverPending) {
            this.gameOver();
        }
    }

    /** Start the game-over sequence with delay and UI update. */
    gameOver() {
        this.gameOverPending = true;
        setTimeout(() => {
            GAME_OVER = true;
            this.gameOverPending = false;
            this.pauseCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.pauseCtx.drawImage(this.canvas, 0, 0);
            this.renderer.toggleGameOverScreen(true);
            startgameOverMusic();
            backgroundMusic.volume = 0;
        }, 2000);
    }

    /** Reset entire world state for a fresh start. */
    resetWorld() {
        clearAllIntervals();
        this.resetGameState();
        this.resetUI();
        this.resetLevel();
        this.resetMusic();
        this.run();
    }

    /** Clear global flags and camera/projectiles state. */
    resetGameState() {
        GAME_OVER = false;
        GAME_PAUSED = false;
        this.gameOverPending = false;
        this.winPending = false;
        this.camera_x = 0;
        this.throwableObjects = [];
    }

    /** Hide any UI elements shown from previous run. */
    resetUI() {
        this.renderer.toggleGameOverScreen(false);
        this.renderer.toggleGameWonScreen(false);
        this.renderer.togglePauseMenu(false);
        document.getElementById("game-over-restart-btn").style.display = "none";
        document.getElementById("game-over-home-btn").style.display = "none";
    }

    /** Reinitialize level and player object.*/
    resetLevel() {
        initLevel();
        this.level = level1;
        this.character = new Character();
        this.character.world = this;
    }

    /** Stop all music and restore background audio settings. */
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