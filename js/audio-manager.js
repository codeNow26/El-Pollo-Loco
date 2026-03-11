let SOUND_MUTED = localStorage.getItem("soundMuted") === "true";

const originalPlay = HTMLMediaElement.prototype.play;

HTMLMediaElement.prototype.play = function () {
    this.muted = SOUND_MUTED;
    return originalPlay.apply(this, arguments);
};

/**
 * Reflect mute state in the UI icons.
 */
function updateMuteIcon() {
    if (SOUND_MUTED) {
        document.getElementById("mute").style.display = "block";
        document.getElementById("sound-on-icon").style.display = "none";
    } else {
        document.getElementById("mute").style.display = "none";
        document.getElementById("sound-on-icon").style.display = "block";
    }
}

/**
 * Toggle the global sound-muted flag and update storage + audio elements.
 */
function toggleMute() {
    SOUND_MUTED = !SOUND_MUTED;
    localStorage.setItem("soundMuted", SOUND_MUTED);
    applyMute();
    updateMuteIcon();
}

/**
 * Update audio elements to reflect the global mute flag.
 */
function applyMute() {
    if (backgroundMusic) {
        backgroundMusic.muted = SOUND_MUTED;
        if (SOUND_MUTED) {
            backgroundMusic.volume = 0;
        } else {
            backgroundMusic.volume = 0.2;
        }
    }
    if (world && world.character && world.character.snoreAudio) {
        world.character.snoreAudio.muted = SOUND_MUTED;
    }
}

window.toggleMute = toggleMute;

window.addEventListener("DOMContentLoaded", () => {
    updateMuteIcon();
});