class EnnemyInvincible extends Ennemy {
    constructor(_left, _top, _className) {
        super(_left, _top, 1, _className);
        
        this.isInvincible = 1;

        clearInterval(this.intervalDamageDetection);
        this.intervalDamageDetection = -1;
    }
}