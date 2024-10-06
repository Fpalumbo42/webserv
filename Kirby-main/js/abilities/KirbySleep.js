class KirbySleep extends Kirby {
    constructor(_left, _top, _hasScrolling, _isFlip, _health) {
        super(_left, _top, _hasScrolling, _isFlip, _health);

        this.ability = E_Ability.SLEEP;

        clearInterval(this.intervalSpawnInhalableParticle);
        this.intervalSpawnInhalableParticle = -1;
        clearInterval(this.intervalAnimationManager);
        this.intervalAnimationManager = -1;
        clearInterval(this.intervalReadInput);
        this.intervalReadInput = -1;

        SetAnimation(this.spriteRenderer, "kirby_sleep_idle_" + this.artstyle + " " + SLEEP_DURATION + "ms", 16, 16);
        setTimeout(this.RemoveAbility.bind(this), SLEEP_DURATION);
    }
}