class Sparky extends EnnemyAbility {
   attackCooldown = 3000;
   attackDuration = 1000;
   movementCooldown = 1500;
   movementDuration = 300;

   isAttacking = false;
   isMoving = false;

   movementDirection = 1;

   constructor(_left, _top, _health, _elem) {
      super(_left, _top, 3, "sparky");

      this.ability = E_Ability.SPARK;

      setTimeout(this.AttackCooldown.bind(this), this.attackCooldown);
      this.intervalAttack = setInterval(this.Attack.bind(this), SPARK_SPAWN_RATE);

      this.intervalAnimationManager = setInterval(this.AnimationManager.bind(this), 1);

      setTimeout(this.MoveCooldown.bind(this), this.movementCooldown);
      this.intervalMovement = setInterval(this.Move.bind(this), 1);
   }

   Move() {
      if (this.isMoving) {
         this.movementDirection = GetRandomInt(-1, 2);
         this.TranslateXRound(1 * this.movementDirection);
      }
   }

   MoveCooldown() {
      this.isMoving = this.isMoving == true ? false : true;
      if (this.isMoving)
         setTimeout(this.MoveCooldown.bind(this), this.movementDuration);
      else
         setTimeout(this.MoveCooldown.bind(this), this.movementCooldown);
   }

   Attack() {
      if (this.isAttacking)
         var s = new Spark(this.transform.GetLeft(), this.transform.GetTop(), this.isFlip, SPARK_DURATION, false);
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
         SetAnimation(this, "sparky_idle 500ms infinite", 16, 16);
      }
      else {
         SetAnimation(this, "sparky_attack 100ms infinite", 16, 16);
      }
   }
}