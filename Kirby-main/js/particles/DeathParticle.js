class DeathParticle extends Particle {
    constructor(_obj) {
        super(_obj.transform.GetLeft(), _obj.transform.GetTop(), false, "death_particle", DEATH_PARTICLE_DURATION);

        this.style.animation = "death_particle_adventure " + DEATH_PARTICLE_DURATION + "ms";
    }
}
