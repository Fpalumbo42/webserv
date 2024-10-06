class CopyAbilityParticle extends Particle {
    constructor() {
        let left, top;
        left = (kirby.transform.GetLeft() + (kirby.transform.GetWidth() / 2 + (24 * GetRandomFloat(-1, 0.5)) * Math.round(SCALE)));
        top = (kirby.transform.GetTop() + (kirby.transform.GetHeight() / 2 + (24 * GetRandomFloat(-1, 0.5)) * Math.round(SCALE)));

        super(left, top, false, "copy_ability_particle", COPY_ABILITY_PARTICLE_DURATION);

        this.style.animation = "copy_ability_particle_adventure " + COPY_ABILITY_PARTICLE_DURATION + "ms";
    }

    static SpawnMultiple(n, timeout) {
        if (n <= 0)
            return;

        new CopyAbilityParticle();
        setTimeout(CopyAbilityParticle.SpawnMultiple, timeout, n - 1, timeout);
    }
}