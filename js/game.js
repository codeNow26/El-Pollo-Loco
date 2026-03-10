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

function clearAllIntervals() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
}

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard)

    if (window.innerHeight > window.innerWidth) {
        rotateCanvas();
    }

    hideImpressum();
    updateMuteIcon();
    setupMobileControls();

    window.addEventListener("keydown", (e) => {
        if (e.code == "KeyA" || e.code === "ArrowLeft") {
            keyboard.LEFT = true;

        }
        if (e.code == "KeyD" || e.code === "ArrowRight") {
            keyboard.RIGHT = true;

        }
        if (e.code == "KeyW" || e.code === "ArrowUp") {
            keyboard.UP = true;

        }
        if (e.code == "KeyS" || e.code === "ArrowDown") {
            keyboard.DOWN = true;

        }
        if (e.code == "Space") {
            keyboard.SPACE = true;

        }
        if (e.code == "KeyE") {
            keyboard.E = true;

        }
        if (e.key == "Escape") {
            world.togglePause();
        }
    });

    window.addEventListener("keyup", (e) => {
        if (e.code == "KeyA" || e.code === "ArrowLeft") {
            keyboard.LEFT = false;

        }
        if (e.code == "KeyD" || e.code === "ArrowRight") {
            keyboard.RIGHT = false;

        }
        if (e.code == "KeyW" || e.code === "ArrowUp") {
            keyboard.UP = false;

        }
        if (e.code == "KeyS" || e.code === "ArrowDown") {
            keyboard.DOWN = false;
            console.log("down is released");
        }
        if (e.code == "Space") {
            keyboard.SPACE = false;

        }
        if (e.code == "KeyE") {
            keyboard.E = false;
        }
    });
}

function setupMobileControls() {
    const left = document.getElementById("btn-left");
    const right = document.getElementById("btn-right");
    const jump = document.getElementById("btn-jump");
    const throwBtn = document.getElementById("btn-throw");
    left.addEventListener("touchstart", () => keyboard.LEFT = true);
    left.addEventListener("touchend", () => keyboard.LEFT = false);
    right.addEventListener("touchstart", () => keyboard.RIGHT = true);
    right.addEventListener("touchend", () => keyboard.RIGHT = false);
    jump.addEventListener("touchstart", () => keyboard.UP = true);
    jump.addEventListener("touchend", () => keyboard.UP = false);
    throwBtn.addEventListener("touchstart", () => keyboard.E = true);
    throwBtn.addEventListener("touchend", () => keyboard.E = false);
}

function rotateCanvas() {
    const canvas = document.getElementById("canvas");
    canvas.style.transform = "rotate(90deg)";
    canvas.style.transformOrigin = "center center";
}

function startGame() {
    document.getElementById("splash-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("canvas").style.display = "block";
    initLevel();
    init();
    startBackgroundMusic();
}

function startBackgroundMusic() {
    backgroundMusic = new Audio("audio/Background Music/El Pollo Loco Background Music.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
    backgroundMusic.play();
}

function startMenuMusic() {
    menuMusic = new Audio("audio/Background Music/El Pollo Loco Menu Music.mp3");
    menuMusic.loop = true;
    menuMusic.volume = 0;
    menuMusic.play();
}

function startgameOverMusic() {
    gameOverMusic = new Audio("audio/Background Music/El Pollo Loco Game Over Music.mp3");
    gameOverMusic.loop = true;
    gameOverMusic.volume = 0.2;
    gameOverMusic.play();
}

function startGameWonMusic() {
    gameWonMusic = new Audio("audio/Background Music/El Pollo Loco Game Won Music.mp3")
    gameWonMusic.volume = 0.2;
    gameWonMusic.play();
}

function restartGame() {
    world.resetWorld();
}

function continueGame() {
    world.hidePauseMenu();
    GAME_PAUSED = false;
    backgroundMusic.volume = 0.2;
}

function enterFullscreen() {
    document.getElementById("fullscreen").requestFullscreen();
}

function exitFullscreen() {
    document.exitFullscreen();
}

document.addEventListener("fullscreenchange", () => {
    const exitBtn = document.getElementById("fullscreen-exit-button");
    const enterBtn = document.getElementById("fullscreen-button");

    if (document.fullscreenElement) {
        exitBtn.classList.remove("hidden");
        enterBtn.classList.add("hidden");
        document.getElementById("border-screen").classList.add("hidden");
    } else {
        exitBtn.classList.add("hidden");
        enterBtn.classList.remove("hidden");
        document.getElementById("border-screen").classList.remove("hidden")
    }
});

function toggleControlsScreen() {
    const showControls = document.getElementById("controls-screen");
    const controlIcons = document.getElementById("controls-wrapper");
    const controlCancel = document.getElementById("control-cancel-button");

    if (showControls.style.display === "block") {
        showControls.style.display = "none";
        controlCancel.style.display = "none";
        controlIcons.style.display = "flex";
        document.getElementById("start-button").style.display = "block"
        GAME_PAUSED = false;
        if (backgroundMusic) {
            backgroundMusic.volume = 0.2;
        }


    } else {
        showControls.style.display = "block";
        controlCancel.style.display = "block";
        controlIcons.style.display = "none";
        document.getElementById("start-button").style.display = "none"

        if (world) {
            world.pauseGame();
        }
    }
}

function backToTitleScreen() {
    clearAllIntervals();
    showImpressum();
    GAME_OVER = false;
    GAME_PAUSED = false;

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

    document.getElementById("pause-menu").style.display = "none";
    document.getElementById("game-over-screen").style.display = "none";
    document.getElementById("game-won-screen").style.display = "none";
    document.getElementById("canvas").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
    document.getElementById("splash-screen").style.display = "flex";
}

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

function hideImpressum() {
    document.getElementById("impressum").classList.add("hidden");
}

function showImpressum() {
    document.getElementById("impressum").classList.remove("hidden");
}

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