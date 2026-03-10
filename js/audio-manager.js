let SOUND_MUTED = localStorage.getItem("soundMuted") === "true";

const originalPlay = HTMLMediaElement.prototype.play;

HTMLMediaElement.prototype.play = function () {
    this.muted = SOUND_MUTED;
    return originalPlay.apply(this, arguments);
};

function updateMuteIcon() {
    if (SOUND_MUTED) {
        document.getElementById("mute").style.display = "block";
        document.getElementById("sound-on-icon").style.display = "none";
    } else {
        document.getElementById("mute").style.display = "none";
        document.getElementById("sound-on-icon").style.display = "block";
    }
}

function toggleMute() {
    SOUND_MUTED = !SOUND_MUTED;

    localStorage.setItem("soundMuted", SOUND_MUTED);

    if (backgroundMusic) {
        backgroundMusic.muted = SOUND_MUTED;

        if (SOUND_MUTED) {
            backgroundMusic.volume = 0.0;
        } else {
            backgroundMusic.volume = 0.2;
        }
    }
    updateMuteIcon();
}

window.toggleMute = toggleMute;

window.addEventListener("DOMContentLoaded", () => {
    updateMuteIcon();
});