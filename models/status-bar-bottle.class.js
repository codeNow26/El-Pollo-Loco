/**
 * Status bar representing number of bottles collected.
 */
class StatusBarBottle extends StatusBar {

    IMAGES = [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",

    ];

    /**
     * Initialize bottle status bar at fixed screen position.
     */
    constructor() {
        super(20, 120, []);
        this.images = this.IMAGES;
        this.loadImages(this.images);
        this.setPercentage(0);
    }

    /**
     * Translate percentage into corresponding image index for bottle bar.
     * @returns {number}
     */
    resolveImageIndex() {
        if (this.percentage <= 0) return 0;
        if (this.percentage <= 20) return 1;
        if (this.percentage <= 40) return 2;
        if (this.percentage <= 60) return 3;
        if (this.percentage <= 80) return 4;
        return 5;
    }
}