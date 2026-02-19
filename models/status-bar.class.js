class StatusBar extends DrawableObject {

    x;
    y;
    width = 200;
    height = 60;
    percentage = 100;
    images = [];

    constructor(x, y, images) {
        super();
        this.x = x;
        this.y = y;
        this.images = images;
        this.loadImages(this.images);
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.images[this.resolveImageIndex()];
        this.img = this.imageCache[imagePath];
    }

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        }
        else if (this.percentage > 80) {
            return 4;
        }
        else if (this.percentage > 60) {
            return 3;
        }
        else if (this.percentage > 40) {
            return 2;
        }
        else if (this.percentage > 20) {
            return 1;
        }
        else {
            return 0;
        }
    }
}

