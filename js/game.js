let canvas;
let world;
let backgroundMusic;
let menuMusic;
let GAME_PAUSED = false;
let keyboard = new Keyboard();









function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard)

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

function startGame() {
    document.getElementById("splash-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("canvas").style.display = "block";
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

function restartGame() {
    location.reload();
}

function continueGame() {
    world.hidePauseMenu();
    GAME_PAUSED = false;
    backgroundMusic.volume = 0.2;
}

function enterFullscreen() {
    const element = document.getElementById("fullscreen");
    document.getElementById("fullscreen-exit-button").style.display = "block";
    document.getElementById("fullscreen-button").style.display = "none";

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    document.getElementById("fullscreen-exit-button").style.display = "none";
     document.getElementById("fullscreen-button").style.display = "block";

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

