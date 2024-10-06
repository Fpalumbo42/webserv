const E_Ennemy = {
    NONE: "none",
    WADDLE_DEE: "waddle_dee",
    HOT_HEAD: "hot_head",
    SIR_KIBBLE: "sir_kibble",
    WADDLE_DOO: "waddle_doo",
    SPARKY: "sparky",
    PENGI: "pengi",
    NODDY: "noddy"
}

class Ennemy extends Living {
    isInvincible = 0;

    intervalMovement = -1;
    intervalDamageDetection = -1;
    intervalAnimationManager = -1;

    canFallOffPlatform = true;

    constructor(_left, _top, _health, _className) {
        super(_left, _top, CreateElement(_className), _health);

        // Insertion
        game.insertBefore(this.element, game.element);
        // Add ennemy to ennemies array
        ennemies.push(this);

        this.intervalDamageDetection = setInterval(this.DamageDetection.bind(this), 5);
    }

    Death() {
        new DeathParticle(this);
        this.Delete();
    }

    Delete() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        if (this.style) {
            this.style = null;
        }

        let index = objects.indexOf(this);
        if (index !== -1) {
            objects.splice(index, 1);
        }
        index = ennemies.indexOf(this);
        if (index !== -1) {
            ennemies.splice(index, 1);
        }

        if (this.intervalUpdateStats != -1) { clearInterval(this.intervalUpdateStats); this.intervalUpdateStats = -1; }// Prevent memory leaks
        if (this.intervalDamageDetection != -1) { clearInterval(this.intervalDamageDetection); this.intervalDamageDetection = -1; }
        if (this.intervalGravity != -1) { clearInterval(this.intervalGravity); this.intervalGravity = -1; }
        if (this.intervalAttack != -1) { clearInterval(this.intervalAttack); this.intervalAttack = -1; }
        if (this.intervalMovement != -1) { clearInterval(this.intervalMovement); this.intervalMovement = -1; }
        if (this.intervalAnimationManager != -1) { clearInterval(this.intervalAnimationManager); this.intervalAnimationManager = -1; }
    }

    DamageDetection() {
        if (AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop(), kirby_projectiles)) {
            this.TakeDamage(1);
        }
    }
}