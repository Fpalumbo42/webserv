class Spark extends Projectile {
    directionLeft = 0;
    directionTop = 0;

    constructor(_left, _top, _isFlip, _duration, _isAKirbyProjectile) {
        super(_left, _top, _isFlip, "spark", _duration, _isAKirbyProjectile);

        do {
            this.directionTop = GetRandomInt(-1, 2);
            this.directionLeft = GetRandomInt(-1, 2);
        } while (this.directionLeft == 0 && this.directionTop == 0);

        this.style.animation = "spark " + _duration + "ms steps(1)";

        this.intervalMove = setInterval(this.Move.bind(this), 10);
    }

    Move() {
        this.TranslateXRound(this.directionLeft);
        this.TranslateYRound(this.directionTop);
    }
}