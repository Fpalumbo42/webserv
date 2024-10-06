class ExpulseAirParticle extends Projectile {
    direction = 0;

    constructor() {
        // Position
        let left, top, dir;
        if (!kirby.isFlip) {
            left = (kirby.transform.GetLeft() + kirby.transform.GetWidth() / 2 + 10 * Math.round(SCALE));
            dir = 1;
        } else {
            left = (kirby.transform.GetLeft() + kirby.transform.GetWidth() / 2 - 30 * Math.round(SCALE));
            dir = -1;
        }
        top = kirby.transform.GetTop() + kirby.transform.GetHeight() / 3;

        super(left, top, kirby.isFlip, "expulse_air", 200, true);

        this.direction = dir;
        this.intervalMove = setInterval(this.Move.bind(this), 20);
    }

    Move() {
        this.TranslateXRound(this.direction);
    }
}