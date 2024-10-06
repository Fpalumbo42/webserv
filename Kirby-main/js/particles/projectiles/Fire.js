class Fire extends Projectile {
    direction = 0;

    constructor(_left, _top, _isFlip, _direction, _duration, _isAKirbyProjectile) {
        super(_left, _top, _isFlip, "fire", _duration, _isAKirbyProjectile);

        this.direction = _direction;

        this.intervalMove = setInterval(this.Move.bind(this), 10);
    }

    Move() {
        this.TranslateXRound(this.direction);
    }
}