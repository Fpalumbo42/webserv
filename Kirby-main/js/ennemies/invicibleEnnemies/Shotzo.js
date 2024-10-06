class Shotzo extends EnnemyInvincible {
    attackCooldown = 2000;
    recoilDuration = 15;
    recoilSpeed = 4;

    intervalAttack = -1;
    intervalRecoil = -1;

    topDirection = -1;
    leftDirection = -1;

    positionBeforeRecoil;

    constructor(_left, _top, _className) {
        super(_left, _top, _className);
        
        setTimeout(this.Attack.bind(this), this.attackCooldown);
    }

    Recoil() {
        if (this.recoilDuration < 0){
            clearInterval(this.intervalRecoil);
            this.intervalRecoil = -1;
            this.recoilDuration = 15;
            this.SetPosition(this.positionBeforeRecoil.x, this.positionBeforeRecoil.y);
            return;
        }
        
        TranslateX(this.element, -(this.leftDirection));
        TranslateY(this.element, -(this.topDirection));
    
        this.recoilDuration--;
    }

    Attack()
    {
        var p = new DeathParticle(this);
        var c = new CannonBall(this.transform.GetLeft(), this.transform.GetTop(), this.leftDirection, this.topDirection);

        setTimeout(this.Attack.bind(this), this.attackCooldown);

        this.positionBeforeRecoil = new Vector2(this.transform.GetLeft(), this.transform.GetTop());
        if (this.intervalRecoil != -1)
            clearInterval(this.intervalRecoil);
        this.intervalRecoil = setInterval(this.Recoil.bind(this), this.recoilSpeed);
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
        if (this.intervalRecoil != -1) { clearInterval(this.intervalRecoil); this.intervalRecoil = -1; }
        if (this.intervalAnimationManager != -1) { clearInterval(this.intervalAnimationManager); this.intervalAnimationManager = -1; }
    }

}