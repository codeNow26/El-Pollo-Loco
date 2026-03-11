/**
 * Background cloud that drifts left across the screen.
 */
class Cloud extends MovableObject {

    x = Math.random() * 500;
    y = 20;
    width = 500;
    height = 250;

    /**
     * Initialize cloud position and start movement.
     */
    constructor() {
        super().loadImage('./img/5_background/layers/4_clouds/1.png');
        this.animate();
    }

    /**
     * Begin moving cloud by calling leftward loop.
     */
    animate() {
    this.moveLeft();
}

moveLeft() {
    setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);  
}

}