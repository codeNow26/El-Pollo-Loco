class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

 /**
     * Creates a background object positioned at the bottom of the canvas.
     * @param {string} imagePath Path to the background image.
     * @param {number} x X position of the background element.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}