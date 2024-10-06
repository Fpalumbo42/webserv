class KirbyNeedle extends Kirby {
   constructor(_left, _top, _hasScrolling) {
      super(_left, _top, _hasScrolling);

      clearInterval(this.intervalSpawnInhalableParticle);
      this.intervalSpawnInhalableParticle = -1;
   }

   Attack() {
      if (this.isAttacking)
         return;

      this.isAttacking = 1;
      this.attackHasEnded = 0;
      SetBackgroundImage(this, "../../img/" + this.artstyle + "/abilities/kirby_needle/kirby_needle_00.png");

     setTimeout(this.Attack2.bind(this), 20);
   }
   Attack2() {
      SetBackgroundImage(this, "../../img/" + this.artstyle + "/abilities/kirby_needle/kirby_needle_01.png");

      setTimeout(this.Attack3.bind(this), 20);
   }
   Attack3() {
      SetBackgroundImage(this, "../../img/" + this.artstyle + "/abilities/kirby_needle/kirby_needle_02.png");
      TranslateX(this, -2);
      TranslateY(this, -3);

      setTimeout(this.Attack4.bind(this), 20);
   }
   Attack4() {
      SetBackgroundImage(this, "../../img/" + this.artstyle + "/abilities/kirby_needle/kirby_needle_03.png");

      setTimeout(this.Attack5.bind(this), 20);
   }
   Attack5() {
      SetBackgroundImage(this, "../../img/" + this.artstyle + "/abilities/kirby_needle/kirby_needle_04.png");
      TranslateX(this, -8);
      TranslateY(this, -20);

      setTimeout(this.Attack6.bind(this), 20);
   }
   Attack6() {
      SetBackgroundImage(this, "../../img/" + this.artstyle + "/abilities/kirby_needle/kirby_needle_05.png");

      setTimeout(this.Attack7.bind(this), 50);
   }
   Attack7() {
      SetBackgroundImage(this, "../../img/" + this.artstyle + "/abilities/kirby_needle/kirby_needle_06.png");
      TranslateX(this, 4);
      TranslateY(this, 4);

      setTimeout(this.Attack8.bind(this), 20);
   }   
   Attack8() {
      SetBackgroundImage(this, "../../img/" + this.artstyle + "/abilities/kirby_needle/kirby_needle_07.png");

      this.attackHasEnded = 1;
   }


   EndAttack() {
      if (!this.attackHasEnded)
         setTimeout(this.EndAttack.bind(this), 1);

      this.isAttacking = 0;
      SetObjectDimensions(this, 16, 16);
      TranslateX(this, 8);
      TranslateY(this, 20);
   }

   ReadInputs() {
      if (this.isDead)
         return;

      // LEFT
      if (keyheld.left && !this.isAttacking) {
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
      if (keyheld.right && !this.isAttacking) {
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
            this.isTryingToJump = 1;
            jumpForce = JUMP_FORCE;
         }
      }
      if (keyheld.jump)
         timeHoldingJump++;
      else if (keyup.jump || timeHoldingJump > 30) timeHoldingJump = 10;

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

      // ATTACK
      if (keyheld.attack) {
         this.Attack();
      } else if (keyup.attack) {
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

      ClearInputs();
   }

   AnimationManager() {
      // DEATH
      if (this.isDead) {
         this.style.animation = "kirby_death_" + this.artstyle + " " + DEATH_DURATION + "ms";
      }
      else {
         // FALL
         if (!this.isGrounded && !this.isAttacking) {
            SetBackgroundImage(this, "./img/" + this.artstyle + "/kirby/kirby_fall.png");
         }
         // IDLE
         if (this.isGrounded && !this.isAttacking) {
            SetBackgroundImage(this, "./img/" + this.artstyle + "/kirby/kirby_idle.png");
         }
         // JUMP
         if (this.isJumping && !this.isGrounded) {
            SetBackgroundImage(this, "./img/" + this.artstyle + "/kirby/kirby_jump.png");
         }
         // WALK
         if ((this.isWalkingLeft || this.isWalkingRight) && this.isGrounded)
            this.style.animation = "kirby_walk_" + this.artstyle + " 1000ms infinite";
         // CROUNCH
         if (this.isCrouching && !this.isAttacking) {
            SetBackgroundImage(this, "./img/" + this.artstyle + "/kirby/kirby_crounch.png");
         }
         // FLOAT
         if (this.isFloating) {
            this.style.animation = "kirby_float_idle_" + this.artstyle + " 1000ms infinite";
            SetObjectDimensions(this, 24, 24);
         }
         // FLOAT JUMP
         if (this.isFloatJumping) {
            SetBackgroundImage(this, "./img/" + this.artstyle + "/kirby/kirby_float_00.png");
            this.style.animation = "kirby_float_jump_" + this.artstyle + " 600ms infinite";
            this.style.animationPlayState = "running";
         }
         // EXPULSE AIR
         if (this.isExpulsingAir) {
            SetBackgroundImage(this, "./img/" + this.artstyle + "/kirby/kirby_expulse_air.png");
            SetObjectDimensions(this, 24, 24);
         }
         // MOUTHFULL
         if (this.isMouthfull && !(this.isWalkingLeft || this.isWalkingRight)) {
            SetBackgroundImage(this, "./img/" + this.artstyle + "/kirby/kirby_mouthfull_idle_00.png");
         }
         // MOUTHFULL WALK
         if (this.isMouthfull && (this.isWalkingLeft || this.isWalkingRight)) {
            this.style.animation = "kirby_mouthfull_walk_" + this.artstyle + " 500ms infinite";
            this.style.animationDuration = this.artstyle == E_ArtStyle.Dreamland ? "500ms" : "1000ms";
         }
      }
   }
}