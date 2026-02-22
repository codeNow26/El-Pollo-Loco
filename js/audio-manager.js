let SOUND_MUTED = false;

const originalPlay = HTMLMediaElement.prototype.play;

HTMLMediaElement.prototype.play = function () {
    this.muted = SOUND_MUTED;
    return originalPlay.apply(this, arguments);
};

function toggleMute() {
    SOUND_MUTED = !SOUND_MUTED;

    if (SOUND_MUTED == true) {
        backgroundMusic.volume = 0.0;
    }
      if (SOUND_MUTED == false) {
        backgroundMusic.volume = 0.2;
    }

    console.log("Muted:", SOUND_MUTED);
}

window.toggleMute = toggleMute;