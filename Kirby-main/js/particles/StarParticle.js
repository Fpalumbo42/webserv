class StarParticle extends Particle {
    constructor() {
        let randomLeft, randomTop, left, top;

        do {
            randomLeft = GetRandomInt(-1, 2);
            randomTop = GetRandomInt(-1, 2);
        } while (randomLeft == 0 && randomTop == 0); // at least one must be diff than 0, if not the star will not be seen

        left = (kirby.transform.GetLeft() + (kirby.transform.GetWidth() / 2 + (24 * randomLeft) * Math.round(SCALE)));
        top = (kirby.transform.GetTop() + (kirby.transform.GetHeight() / 2 + (24 * randomTop) * Math.round(SCALE)));

        canSpawnStar = 0;

        super(left, top, false, "little_star", STAR_DURATION);
    }
}