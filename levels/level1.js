let level1;
function initLevel() {
level1 = new Level(
    [new Chicken(350), new SmallChicken(460), new SmallChicken(800), new Chicken(1000), new Chicken(2200), new Endboss(3000)],
    [new Cloud(), new Cloud(), new Cloud()],
    [new Coin(300), new Coin(800), new Coin(1400), new Coin(2000), new Coin(3000), new Coin(4000)],
    [new Bottle(500), new Bottle(1000), new Bottle(1800), new Bottle(2000), new Bottle(4200),],
    [
        new BackgroundObject("img/5_background/layers/air.png", -719),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),
        new BackgroundObject("img/5_background/layers/air.png", 0),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/air.png", 719),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
        new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
        new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
        new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 4),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 4),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 4),
    ]);

    }