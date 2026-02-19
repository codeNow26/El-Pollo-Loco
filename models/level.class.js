class Level {
    enemies;
    clouds;
    coins;
    maxCoins = 5;
    maxBottles = 5;
    bottles;
    backgroundObjects;
    level_end_x = 719 * 3;

    constructor(enemies, clouds, coins, bottle, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.bottle = bottle;
        this.backgroundObjects = backgroundObjects;
    }
}