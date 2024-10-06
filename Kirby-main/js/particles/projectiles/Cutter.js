class Cutter extends Projectile {
    direction = 0;
    force = 30;

    constructor(_left, _top, _isFlip, _direction, _isAKirbyProjectile) {
        super(_left, _top, _isFlip, "cutter", CUTTER_DURATION, _isAKirbyProjectile);

        this.direction = _direction;
        this.force *= this.direction;

        this.intervalMove = setInterval(this.Move.bind(this), 10);
    }

    Move() {
        this.TranslateXRound(- (this.force / 10));
        this.force = this.direction == -1 ? this.force + 1 : this.force - 1;
    }

    static SpawnCutter(object) {
        // Position
        let left;
        if (!object.isFlip)
            left = (object.transform.GetLeft() + object.transform.GetWidth() / 2 + 10 * Math.round(SCALE));
        else
            left = (object.transform.GetLeft() + object.transform.GetWidth() / 2 - 30 * Math.round(SCALE));

        if (left < object.transform.GetLeft() + object.transform.GetWidth() / 2)
            var c = new Cutter(left, object.transform.GetTop(), object.isFlip, 1, true);
        else if (left > object.transform.GetLeft() + object.transform.GetWidth() / 2)
            var c = new Cutter(left, object.transform.GetTop(), object.isFlip, -1, true);
    }
}