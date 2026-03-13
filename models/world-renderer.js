class WorldRenderer {

    constructor(world) {
        this.world = world;
        this.ctx = world.ctx;
    }

/**
     * Main render loop; calls sub-drawers and handles pause/gameover.
     */
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

   /**
     * Clear the rendering canvas.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
    }

   /**
     * Render background layers and clouds with camera offset.
     */
    drawBackground() {
        this.ctx.translate(this.world.camera_x, 0);
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.addObjectsToMap(this.world.level.clouds);
        this.ctx.translate(-this.world.camera_x, 0);
    }

 /**
     * Draw all UI elements (status bars, endboss bar).
     */
    drawUI() {
        this.addToMap(this.world.statusBarHealth);
        this.addToMap(this.world.statusBarCoin);
        this.addToMap(this.world.statusBarBottle);
        if (this.world.endboss && this.world.endboss.hadFirstContact) {
            this.addToMap(this.world.statusBarEndboss);
        }
    }

    /**
     * Draw characters, enemies, coins, bottles and projectiles.
     */
    drawGameObjects() {
        this.ctx.translate(this.world.camera_x, 0);
        this.addToMap(this.world.character);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.level.bottle);
        this.addObjectsToMap(this.world.level.enemies);
        this.addObjectsToMap(this.world.throwableObjects);
        this.world.character.applyKnockback();
        this.ctx.translate(-this.world.camera_x, 0);
    }

    /**
     * Helper to add an array of drawable objects to render queue.
     * @param {Array} objects
     */
    addObjectsToMap(objects) {
        objects.forEach((obj) => {
            this.addToMap(obj);
        })
    }

    /**
     * Draw a single movable object, flipping if needed.
     * @param {MovableObject} mo
     */
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

  /**
     * Flip canvas horizontally for mirrored drawing.
     * @param {MovableObject} mo
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restore canvas state after a flip.
     * @param {MovableObject} mo
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

     /**
     * Render a blurred overlay and pause text when paused.
     */
    drawPauseScreen() {
        this.ctx.save();
        this.ctx.filter = "blur(2px)";
        this.ctx.drawImage(this.world.pauseCanvas, 0, 0);
        this.ctx.filter = "none";
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.ctx.fillRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.font = "48px Arial";
        this.ctx.textAlign = "center";
        this.ctx.restore();
    }

     /**
     * Render a special overlay when the game is over.
     */
    drawGameOverScreen() {
        this.ctx.save();
        this.ctx.filter = "blur(3px)";
        this.ctx.drawImage(this.world.pauseCanvas, 0, 0);
        this.ctx.filter = "none";
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        this.ctx.fillRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.font = "64px Arial";
        this.ctx.textAlign = "center";
        this.ctx.restore();
    }

      /**
         * Show or hide the pause menu DOM element.
         * @param {boolean} show - true to display, false to hide
         */
    togglePauseMenu(show) {
        const menu = document.getElementById("pause-menu");

        if (show) {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    }

    /**
         * Toggle visibility of the game-over screen element.
         * @param {boolean} show - true to show, false to hide
         */
    toggleGameOverScreen(show) {
        const screen = document.getElementById("game-over-screen");

        if (show) {
            screen.style.display = "block";
        } else {
            screen.style.display = "none";
        }
    }

    /**
         * Show or hide the victory screen element.
         * @param {boolean} show - true to display, false to conceal
         */
    toggleGameWonScreen(show) {
        const screen = document.getElementById("game-won-screen");

        if (show) {
            screen.style.display = "block";
        } else {
            screen.style.display = "none";
        }
    }
}