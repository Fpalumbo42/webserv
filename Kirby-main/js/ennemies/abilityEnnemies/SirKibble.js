class SirKibble extends EnnemyAbility {
    attackCooldown = 2000;
    attackDuration = 20;

    isAttacking = false;
    isChargingAttack = true;

    constructor(_left, _top, _health, _elem) {
        super(_left, _top, 3, "sir_kibble");

        this.ability = E_Ability.CUTTER;

        this.intervalAnimationManager = setInterval(this.AnimationManager.bind(this), 1);

        this.intervalAttack = setTimeout(this.Attack.bind(this), this.attackCooldown);
    }

    EndAttack2() {
        this.isAttacking = false;

        this.intervalAttack = setTimeout(this.Attack.bind(this), this.attackCooldown);
    }
    EndAttack() {
        this.isAttacking = true;
        this.isChargingAttack = false;

        let c = new Cutter(this.transform.GetLeft(), this.transform.GetTop(), this.isFlip, !this.isFlip, false);

        this.intervalAttack = setTimeout(this.EndAttack2.bind(this), 400);
    }
    Attack() {
        this.isChargingAttack = true;
        this.intervalAttack = setTimeout(this.EndAttack.bind(this), 400);
    }

    AnimationManager() {
        if (this.isAttacking) {
            SetBackgroundImage(this, "../../../img/adventure/ennemies/sir_kibble/sir_kibble_03.png");
        }
        if (this.isChargingAttack) {
            SetBackgroundImage(this, "../../../img/adventure/ennemies/sir_kibble/sir_kibble_02.png");
        }
        if (!this.isAttacking && !this.isChargingAttack) {
            SetAnimation(this, "sir_kibble_idle 500ms infinite", 16, 16);
        }
    }
}