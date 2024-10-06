class HotHead extends EnnemyAbility {
    attackDuration = 500;
    attackCooldown = 4000;

    isAttacking = false;

    constructor(_left, _top, _health, _elem) {
        super(_left, _top, 3, "hot_head");

        this.ability = E_Ability.FIRE;

        setTimeout(this.AttackCooldown.bind(this), 1000);
        this.intervalAttack = setInterval(this.Attack.bind(this), 50);

        this.intervalAnimationManager = setInterval(this.AnimationManager.bind(this), 1);
    }

    Attack() {
        if (this.isAttacking)
            var f = new Fire(this.transform.GetLeft(), this.transform.GetTop(), !this.isFlip, -1, FIRE_DURATION, false);
    }

    AttackCooldown() {
        this.isAttacking = this.isAttacking == true ? false : true;
        if (this.isAttacking)
            setTimeout(this.AttackCooldown.bind(this), this.attackDuration);
        else
            setTimeout(this.AttackCooldown.bind(this), this.attackCooldown);
    }

    AnimationManager() {
        if (!this.isAttacking) {
            SetAnimation(this, "hot_head_idle 500ms infinite", 16, 16);
        }
        else {
            SetAnimation(this, "hot_head_attack 100ms infinite", 16, 16);
        }
    }
}