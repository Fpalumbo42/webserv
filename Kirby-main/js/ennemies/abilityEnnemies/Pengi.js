class Pengi extends EnnemyAbility {
   attackDuration = 500;
   attackCooldown = 4000;

   isAttacking = false;

   constructor(_left, _top, _health, _elem) {
      super(_left, _top, 3, "pengi");

      this.ability = E_Ability.ICE;

      setTimeout(this.AttackCooldown.bind(this), 1000);
      this.intervalAttack = setInterval(this.Attack.bind(this), 50);

      this.intervalAnimationManager = setInterval(this.AnimationManager.bind(this), 1);
   }

   Attack() {
      if (this.isAttacking)
         var i = new Ice(this.transform.GetLeft() + this.transform.GetWidth() / 2 - 45 * Math.round(SCALE), this.transform.GetTop(), !this.isFlip, -1, FIRE_DURATION, false);
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
         SetAnimation(this, "pengi_idle 500ms infinite", 16, 16);
      }
      else {
         SetAnimation(this, "pengi_attack 100ms infinite", 16, 16);
      }
   }

}