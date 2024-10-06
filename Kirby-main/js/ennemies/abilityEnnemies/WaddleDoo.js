class WaddleDoo extends EnnemyAbility {
    attackDuration = 1000;
    attackCooldown = 4000;

    beamDirectionLeft = 0;
    beamDirectionTop = -1;
    rotationSpeed = 0.1;
    beamLength = 60;

    isAttacking = false;

    constructor(_left, _top, _health, _elem) {
        super(_left, _top, 3, "waddle_doo");

        this.ability = E_Ability.BEAM;

        setTimeout(this.AttackCooldown.bind(this), 1000);
        this.intervalAttack = setInterval(this.Attack.bind(this), 50);

        this.intervalAnimationManager = setInterval(this.AnimationManager.bind(this), 1);
    }

    Attack() {
        if (!this.isAttacking) {
            this.beamDirectionLeft = 0;
            this.beamDirectionTop = -1;
            return;
        }

        // Vector rotation
        let tmp_left = this.beamDirectionLeft;
        if (this.isFlip) {
            this.beamDirectionLeft = this.beamDirectionLeft * Math.cos(this.rotationSpeed) - this.beamDirectionTop * Math.sin(this.rotationSpeed);
            this.beamDirectionTop = tmp_left * Math.sin(this.rotationSpeed) + this.beamDirectionTop * Math.cos(this.rotationSpeed);
        }
        else {
            this.beamDirectionLeft = this.beamDirectionLeft * Math.cos(-this.rotationSpeed) - this.beamDirectionTop * Math.sin(-this.rotationSpeed);
            this.beamDirectionTop = tmp_left * Math.sin(-this.rotationSpeed) + this.beamDirectionTop * Math.cos(-this.rotationSpeed);
        }

        this.ShootBeam();

    }
    ShootBeam() {
        if (!this.isAttacking)
            return;

        // Position
        let left;
        if (this.isFlip)
            left = (this.transform.GetLeft() + this.transform.GetWidth() / 2 + 10 * Math.round(SCALE));
        else
            left = (this.transform.GetLeft() + this.transform.GetWidth() / 2 - 18 * Math.round(SCALE));

        var b = new Beam(left, this.transform.GetTop(), this.beamDirectionLeft, this.beamDirectionTop, this.beamLength, false);
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
            SetAnimation(this, "waddle_doo_idle 500ms infinite", 16, 16);
        }
        else {
            SetAnimation(this, "waddle_doo_attack 500ms infinite", 16, 16);
        }
    }
}
