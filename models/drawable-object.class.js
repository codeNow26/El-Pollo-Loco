/**
 * Base class for anything that can be drawn onto the canvas.
 */
class DrawableObject {
    x = 120;
    y = 260;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;


        /**
         * Load a single image into the object.
         * @param {string} path  image source URL
         */
        loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    
        /**
         * Draw current image on provided canvas context.
         * @param {CanvasRenderingContext2D} ctx
         */
     draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

        /**
         * Preload and cache multiple images.
         * @param {string[]} arr  array of image URLs
         */
        loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

        /**
         * Optionally draw a debug frame around the object.
         * @param {CanvasRenderingContext2D} ctx
         */
        drawFrame(ctx) {
        if (false && this instanceof Character || false && this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = "0";
            ctx.strokeStyle = "red";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }
}

