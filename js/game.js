let canvas;
let world;
let backgroundMusic;
let gameOverMusic;
let gameWonMusic;
let menuMusic;
let GAME_PAUSED = false;
let GAME_OVER = false;
let keyboard = new Keyboard();
let intervalIds = [];
const originalSetInterval = window.setInterval;

window.setInterval = function (fn, time) {
    const id = originalSetInterval(fn, time);
    intervalIds.push(id);
    return id;
};

/**
 * Clear every interval that was started via overridden setInterval.
 */
function clearAllIntervals() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
}

/**
 * Initialize game world, input and UI state.
 */
function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard)

    if (window.innerHeight > window.innerWidth) {
        rotateCanvas();
    }

    hideImpressum();
    updateMuteIcon();

    keyboardControls();
    mobileControls();
}

/**
 * Attach keyboard event listeners for game input.
 */
function keyboardControls() {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
}

/**
 * Update keyboard state when a key is pressed.
 * @param {KeyboardEvent} e
 */
function handleKeyDown(e) {
    if (e.code === "KeyA" || e.code === "ArrowLeft") keyboard.LEFT = true;
    if (e.code === "KeyD" || e.code === "ArrowRight") keyboard.RIGHT = true;
    if (e.code === "KeyW" || e.code === "ArrowUp") keyboard.UP = true;
    if (e.code === "KeyS" || e.code === "ArrowDown") keyboard.DOWN = true;
    if (e.code === "Space") keyboard.SPACE = true;
    if (e.code === "KeyE") keyboard.E = true;
    if (e.key === "Escape") {
        world.togglePause();
    }
}

/**
 * Reset keyboard flags when a key is released.
 * @param {KeyboardEvent} e
 */
function handleKeyUp(e) {
    if (e.code === "KeyA" || e.code === "ArrowLeft") keyboard.LEFT = false;
    if (e.code === "KeyD" || e.code === "ArrowRight") keyboard.RIGHT = false;
    if (e.code === "KeyW" || e.code === "ArrowUp") keyboard.UP = false;
    if (e.code === "KeyS" || e.code === "ArrowDown") keyboard.DOWN = false;
    if (e.code === "Space") keyboard.SPACE = false;
    if (e.code === "KeyE") keyboard.E = false;
}

/**
 * Configure touch handlers for an on-screen mobile control button.
 *
 * Touch events are mapped to a key property on the global `keyboard` object.
 * The function prevents the default behavior on `touchstart` to avoid
 * unintended scrolling or zooming on mobile devices.
 *
 * @param {string} buttonId - The `id` of the DOM element acting as the button.
 * @param {string} key - The name of the keyboard property to toggle (e.g. "LEFT").
 */
function touchButton(buttonId, key) {
    const btn = document.getElementById(buttonId);

    btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard[key] = true;
    });

    btn.addEventListener("touchend", () => {
        keyboard[key] = false;
    });

    btn.addEventListener("touchcancel", () => {
        keyboard[key] = false;
    });
}

/**
 * Initialize touch controls for all mobile on-screen buttons.
 *
 * This helper registers the appropriate button IDs with their corresponding
 * keyboard actions by delegating to {@link touchButton}. It should be called
 * once during game initialization when mobile input is required.
 */
function mobileControls() {
    touchButton("btn-left", "LEFT");
    touchButton("btn-right", "RIGHT");
    touchButton("btn-jump", "UP");
    touchButton("btn-throw", "E");
}

/**
 * Rotate the canvas element 90 degrees for portrait orientation.
 */
function rotateCanvas() {
    const canvas = document.getElementById("canvas");
    canvas.style.transform = "rotate(90deg)";
    canvas.style.transformOrigin = "center center";
}

/**
 * Hide menus and launch main game initialization and music.
 */
function startGame() {
    document.getElementById("splash-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("canvas").style.display = "block";
    initLevel();
    init();
    startBackgroundMusic();
}

/**
 * Begin looping background music at low volume.
 */
function startBackgroundMusic() {
    backgroundMusic = new Audio("audio/Background Music/El Pollo Loco Background Music.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
    backgroundMusic.play();
}

/**
 * Play the menu music (initially silent volume).
 */
function startMenuMusic() {
    menuMusic = new Audio("audio/Background Music/El Pollo Loco Menu Music.mp3");
    menuMusic.loop = true;
    menuMusic.volume = 0;
    menuMusic.play();
}

/**
 * Start looping the game-over theme.
 */
function startgameOverMusic() {
    gameOverMusic = new Audio("audio/Background Music/El Pollo Loco Game Over Music.mp3");
    gameOverMusic.loop = true;
    gameOverMusic.volume = 0.2;
    gameOverMusic.play();
}

/**
 * Play the victory music track.
 */
function startGameWonMusic() {
    gameWonMusic = new Audio("audio/Background Music/El Pollo Loco Game Won Music.mp3")
    gameWonMusic.volume = 0.2;
    gameWonMusic.play();
}

/**
 * Reset the world state to restart the level.
 */
function restartGame() {
    world.resetWorld();
}

/**
 * Resume play from pause state and restore audio.
 */
function continueGame() {
   world.renderer.togglePauseMenu(false);
    GAME_PAUSED = false;
    backgroundMusic.volume = 0.2;
}

/**
 * Request browser fullscreen mode for canvas container.
 */
function enterFullscreen() {
    document.getElementById("fullscreen").requestFullscreen();
}

/**
 * Exit fullscreen mode if active.
 */
function exitFullscreen() {
    document.exitFullscreen();
}

document.addEventListener("fullscreenchange", handleFullscreenChange);

/**
 * Update UI when fullscreen state changes.
 */
function handleFullscreenChange() {
    const exitBtn = document.getElementById("fullscreen-exit-button");
    const enterBtn = document.getElementById("fullscreen-button");
    const border = document.getElementById("border-screen");
    if (document.fullscreenElement) {
        exitBtn.classList.remove("hidden");
        enterBtn.classList.add("hidden");
        border.classList.add("hidden");
    } else {
        exitBtn.classList.add("hidden");
        enterBtn.classList.remove("hidden");
        border.classList.remove("hidden");
    }
}

/**
 * Show or hide the touch control instructions overlay.
 */
function toggleControlsScreen() {
    const controls = document.getElementById("controls-screen");

    if (controls.style.display === "block") {
        hideControlsScreen();
    } else {
        showControlsScreen();
    }
}

/**
 * Exit current game and return to the title screen.
 */
function backToTitleScreen() {
    stopGame();
    stopAllMusic();
    showTitleScreen();
}

/**
 * Display controls information and pause world if running.
 */
function showControlsScreen() {
    document.getElementById("controls-screen").style.display = "block";
    document.getElementById("control-cancel-button").style.display = "block";
    document.getElementById("controls-wrapper").style.display = "none";
    document.getElementById("start-button").style.display = "none";

    if (world) {
        world.pauseGame();
    }
}

/**
 * Hide the controls overlay and resume game audio.
 */
function hideControlsScreen() {
    document.getElementById("controls-screen").style.display = "none";
    document.getElementById("control-cancel-button").style.display = "none";
    document.getElementById("controls-wrapper").style.display = "flex";
    document.getElementById("start-button").style.display = "block";

    GAME_PAUSED = false;

    if (backgroundMusic) {
        backgroundMusic.volume = 0.2;
    }
}

/**
 * Stop all game activity and show the impressum screen.
 */
function stopGame() {
    clearAllIntervals();
    showImpressum();
    GAME_OVER = false;
    GAME_PAUSED = false;
}

/**
 * Pause and reset any active audio tracks.
 */
function stopAllMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
    if (gameOverMusic) {
        gameOverMusic.pause();
        gameOverMusic.currentTime = 0;
    }
    if (gameWonMusic) {
        gameWonMusic.pause();
        gameWonMusic.currentTime = 0;
    }
}

/**
 * Transition UI back to the title and splash screens.
 */
function showTitleScreen() {
    document.getElementById("pause-menu").style.display = "none";
    document.getElementById("game-over-screen").style.display = "none";
    document.getElementById("game-won-screen").style.display = "none";
    document.getElementById("canvas").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
    document.getElementById("splash-screen").style.display = "flex";
}

/**
 * Toggle visibility of the impressum information overlay.
 */
function toggleImpressumScreen() {
    const showImpressum = document.getElementById("impressum-screen");
    const impressumOverlay = document.getElementById("impressum-overlay")
    if (!impressumOverlay.innerHTML.trim()) {
        impressumOverlay.innerHTML = impressumTemplate();
    }
    if (showImpressum.style.display === "block") {
        showImpressum.style.display = "none";
        document.getElementById("start-button").style.display = "block"
    } else {
        showImpressum.style.display = "block";
        document.getElementById("start-button").style.display = "none"
    }
}

/**
 * Hide the impressum overlay element.
 */
function hideImpressum() {
    document.getElementById("impressum").classList.add("hidden");
}

/**
 * Reveal the impressum overlay element.
 */
function showImpressum() {
    document.getElementById("impressum").classList.remove("hidden");
}

/**
 * Show an overlay when device is in portrait orientation.
 */
function checkOrientation() {
    const overlay = document.getElementById("rotateOverlay");

    if (window.innerHeight > window.innerWidth) {
        overlay.style.display = "flex";
    } else {
        overlay.style.display = "none";
    }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);