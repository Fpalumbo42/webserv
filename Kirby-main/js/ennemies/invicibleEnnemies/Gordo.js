class Gordo extends EnnemyInvincible {
    constructor(_left, _top) {
        super(_left, _top, "gordo");

        clearInterval(this.intervalGravity);
        this.intervalGravity = -1;
    }
}