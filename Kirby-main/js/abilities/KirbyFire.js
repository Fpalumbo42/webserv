class KirbyFire extends Kirby {
   constructor(_left, _top, _hasScrolling, _isFlip, _health) {
      super(_left, _top, _hasScrolling, _isFlip, _health);

      this.ability = E_Ability.FIRE;

      clearInterval(this.intervalSpawnInhalableParticle);
      this.intervalSpawnInhalableParticle = -1;
   }

   Attack() {
      this.isAttacking = 1;

      this.SpawnFire();
   }
   EndAttack() {
      this.isAttacking = 0;

      if (this.intervalInhale != -1) {
         clearInterval(this.intervalInhale);
         this.intervalInhale = -1;
      }

      DeleteAllObjWithClassName("fire");
   }

   SpawnFire() {
      // Position
      let left;
      if (!this.isFlip)
         left = (this.transform.GetLeft() + this.transform.GetWidth() / 2 + 10 * Math.round(SCALE));
      else
         left = (this.transform.GetLeft() + this.transform.GetWidth() / 2 - 25 * Math.round(SCALE));

      // Direction
      let direction = this.isFlip ? -1 : 1;

      var f = new Fire(left, this.transform.GetTop(), this.isFlip, direction, FIRE_DURATION, true);
   }

   ReadInputs() {
      if (this.isDead)
         return;

      // LEFT
      if (keyheld.left) {
         // Movement
         if (this.intervalMovementLeft == -1) {
            this.intervalMovementLeft = setInterval(this.MoveLeft.bind(this), MOVEMENT_SPEED);
         }

         // Flip
         if (!this.isFlip && !this.isInhaling) {
            FlipObject(this);
         }
      }
      else {
         this.EndMoveLeft();
      }

      // RIGHT
      if (keyheld.right) {
         // Movement
         if (this.intervalMovementRight == -1) {
            this.intervalMovementRight = setInterval(this.MoveRight.bind(this), MOVEMENT_SPEED);
         }

         // Flip
         if (this.isFlip && !this.isInhaling) {
            FlipObject(this);
         }
      }
      else
         this.EndMoveRight();

      // BOTH DIRECTION
      if (keyheld.right && keyheld.left) {
         this.EndMoveRight()
         this.EndMoveLeft();
      }

      // DOWN
      if (keyheld.down) {
         this.Crounch()
      }
      else
         this.isCrouching = 0;

      // UP
      if (keypressed.up) {
         this.TryOpenDoor();
      }

      // JUMP
      if (keypressed.jump) {
         if (this.isGrounded && !this.isCrouching) {
            this.Jump();
         }
      }
      if (keyheld.jump)
         timeHoldingJump++;
      if (timeHoldingJump > TIME_HOLDING_JUMP_MAX) timeHoldingJump = TIME_HOLDING_JUMP_MAX;

      // FLOAT
      if (keypressed.jump) {
         if (!this.isGrounded) {
            this.Float();
         }
      }

      // FLOAT JUMP
      if (keypressed.jump && this.isFloatJumping)
         this.isFloatJumping = 0;
      if (keypressed.jump || this.isFloatJumping) {
         if (this.isFloating) {
            this.FloatJump();
         }
      }

      // FIRE
      if (keypressed.attack && !this.isFloating) {
         this.SpawnFire();
         this.isAttacking = 1;
         this.intervalInhale = setInterval(this.Attack.bind(this), FIRE_SPAWN_RATE);
      }
      else if (keyup.attack) {
         this.EndAttack();
      }

      // EXPULSE AIR
      if (keypressed.attack && this.isFloating) {
         this.ExpulseAir();
      }

      // EXPULSE STAR
      if (keypressed.attack && this.isMouthfull) {
         this.ExpulseStar()
      }
      // INGEST
      if (keypressed.down && this.isMouthfull) {
         this.Ingest();
      }

      // REMOVE
      if (keypressed.remove) {
         this.RemoveAbility();
      }


      ClearInputs();
   }


   AnimationManager() {
      // DEATH
      if (this.isDead) {
         SetAnimation(this.spriteRenderer, "kirby_death_" + this.artstyle + " " + DEATH_DURATION + "ms", 16, 16)
         return;
      }
      else {
         // LIGHT FALL
         if (!this.isGrounded) {
            SetBackgroundImage(this.spriteRenderer, "./img/" + this.artstyle + "/kirby/kirby_jump_04.png");
         }
         // HARD FALL
         if (!this.isGrounded && this.timeSinceJumpEnded > 100) {
            SetBackgroundImage(this.spriteRenderer, "./img/" + this.artstyle + "/kirby/kirby_fall.png");
         }
         // IDLE
         if (this.isGrounded) {
            SetAnimation(this.spriteRenderer, "kirby_idle_" + this.artstyle + " 3000ms infinite", 16, 16);
         }
         // JUMP
         if (this.jumpForce > 2 && !this.isGrounded) {
            SetBackgroundImage(this.spriteRenderer, "./img/" + this.artstyle + "/kirby/kirby_jump_00.png");
         }
         // JUMP ROLL
         if (this.jumpForce <= 2 && !this.isGrounded) {
            SetAnimation(this.spriteRenderer, "kirby_jump_roll_" + this.artstyle + " 150ms", 16, 16);
         }
         // WALK
         if ((this.isWalkingLeft || this.isWalkingRight) && this.isGrounded)
            SetAnimation(this.spriteRenderer, "kirby_walk_" + this.artstyle + " 800ms infinite", 16, 16);
         // CROUNCH
         if (this.isCrouching) {
            SetBackgroundImage(this.spriteRenderer, "./img/" + this.artstyle + "/kirby/kirby_crounch.png");
         }
         // ATTACK
         if (this.isAttacking) {
            SetAnimation(this.spriteRenderer, "kirby_fire_attack_" + this.artstyle + " 100ms infinite", 16, 16);
            this.EndMoveLeft();
            this.EndMoveRight();
         }
         // FLOAT
         if (this.isFloating) {
            SetAnimation(this.spriteRenderer, "kirby_float_idle_" + this.artstyle + " 1000ms infinite", 24, 24);
         }
         // FLOAT JUMP
         if (this.isFloatJumping) {
            SetBackgroundImage(this.spriteRenderer, "./img/" + this.artstyle + "/kirby/kirby_float_00.png");
            this.spriteRenderer.style.animation = "kirby_float_jump_" + this.artstyle + " 600ms infinite";
            this.spriteRenderer.style.animationPlayState = "running";
         }
         // EXPULSE AIR
         if (this.isExpulsingAir) {
            SetBackgroundImage(this.spriteRenderer, "./img/" + this.artstyle + "/kirby/kirby_expulse_air.png");
         }
         // MOUTHFULL
         if (this.isMouthfull && !(this.isWalkingLeft || this.isWalkingRight)) {
            SetBackgroundImage(this.spriteRenderer, "./img/" + this.artstyle + "/kirby/kirby_mouthfull_idle_00.png");
         }
         // MOUTHFULL WALK
         if (this.isMouthfull && (this.isWalkingLeft || this.isWalkingRight)) {
            SetAnimation(this.spriteRenderer, "kirby_mouthfull_walk_" + this.artstyle + " 500ms infinite", 24, 24);
            this.spriteRenderer.style.animationDuration = this.artstyle == E_ArtStyle.Dreamland ? "500ms" : "1000ms";
         }
      }
   }
}