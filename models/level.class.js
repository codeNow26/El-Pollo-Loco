/**
 * Represents a game level including enemies, collectibles and scenery.
 */
class Level {
    enemies;
    clouds;
    coins;
    maxCoins = 5;
    maxBottles = 5;
    bottles;
    backgroundObjects;
    level_end_x = 719 * 8;

    /**
     * @param {Array} enemies          enemy objects in the level
     * @param {Array} clouds           cloud objects for parallax
     * @param {Array} coins            coin collectibles
     * @param {Array} bottle           bottle pickups
     * @param {Array} backgroundObjects background scenery objects
     */
    constructor(enemies, clouds, coins, bottle, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.bottle = bottle;
        this.backgroundObjects = backgroundObjects;
    }
}