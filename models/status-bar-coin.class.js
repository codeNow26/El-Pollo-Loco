class StatusBarCoins extends StatusBar {

    IMAGES = [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    ];

    constructor() {
        super(20, 70, []);
        this.images = this.IMAGES;
        this.loadImages(this.images);
        this.setPercentage(100);
    }
}