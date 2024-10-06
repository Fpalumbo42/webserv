const E_Ability = {
   NORMAL: "normal",
   CUTTER: "cutter",
   FIRE: "fire",
   BEAM: "beam",
   SWORD: "sword",
   SPARK: "spark",
   STONE: "stone",
   ICE: "ice",
   SLEEP: "sleep"
}

class Kirby extends Living {
   artstyle = E_ArtStyle.ADVENTURE;

   ability = E_Ability.NORMAL;

   spriteRenderer;

   collisionMaskExclusion = ["background", "door", "expulse_air", "UI"];

   isJumping = 0;
   isCrouching = 0;
   isAttacking = 0;
   isWalkingLeft = 0;
   isWalkingRight = 0;
   isInhaling = 0;
   isInhalingAnObject = 0;
   isFloating = 0;
   isFloatJumping = 0;
   isExpulsingAir = 0;
   isMouthfull = 0;
   isDead = 0;
   isInvincible = 0;
   isBlinking = 0;
   isTryingToJump = 0;
   isAttacking = 0;
   attackHasEnded = 1;

   intervalMovementRight = -1;
   intervalMovementLeft = -1;
   intervalInhale = -1;
   intervalMoveTowardsHorizontal = -1;
   intervalMoveTowardsVertical = -1;
   intervalInvincibilityBlink = -1;
   intervalSpawnInhalableParticle = -1;
   intervalReadInput = -1;
   intervalAnimationManager = -1;
   intervalDamageDetection = -1;
   intervalDamageCounterBlow = -1;

   hasScrolling = 0;

   jumpForce = 0;
   timeSinceJumpEnded = 0;
   timeAirborn = 0;

   #damageCounterBlowForce = DAMAGE_COUNTER_BLOW_FORCE;

   constructor(_left, _top, _hasScrolling, _isFlip, _currentHealth) {
      super(_left, _top, document.getElementById("kirby"), KIRBY_MAX_HEALTH);

      this.hasScrolling = _hasScrolling;

      this.isFlip = _isFlip;
      this.currentHealth = _currentHealth;

      this.spriteRenderer = new Object(0, 0, CreateElementWithId("kirby_sprite_renderer"));
      this.element.insertBefore(this.spriteRenderer.element, this.element.firstChild);

      // Interval
      if (this.intervalReadInput != -1) { clearInterval(this.intervalReadInput); }
      this.intervalReadInput = setInterval(this.ReadInputs.bind(this), 1);
      if (this.intervalAnimationManager != -1) { clearInterval(this.intervalAnimationManager); }
      this.intervalAnimationManager = setInterval(this.AnimationManager.bind(this), 1);
      if (this.intervalDamageDetection != -1) { clearInterval(this.intervalDamageDetection); }
      this.intervalDamageDetection = setInterval(this.#DamageDetection.bind(this), 1);
   }

   #Damage() {
      if (this.isInvincible)
         return;

      // Decrement health
      this.currentHealth--;
      ui.RemoveHealthPoint();

      // Chech Death
      if (this.currentHealth <= 0)
         this.#Death();

      // Screen Shake
      //dShakeScreen();

      // Invincibility
      this.isInvincible = 1;
      setTimeout(this.#EndInvicible.bind(this), INVINCIBILITY_TIMER);

      // Blinking
      this.#Blink(true);
   }
   #EndInvicible() {
      this.isInvincible = 0;
   }
   #Blink(blink) {
      if (!this.isInvincible || this.isDead) {
         this.style.display = "block";
         return;
      }

      this.style.display = blink ? "none" : "block";
      setTimeout(this.#Blink.bind(this), 20, !blink);
   }

   Heal(amount) {
      this.currentHealth += amount;
      if (this.currentHealth > this.maxHealth)
         this.currentHealth = this.maxHealth;

      ui.RemoveAllHealthPoint();
      ui.AddAmountHealthPoint(this.currentHealth);
   }
   #Death() {
      this.currentHealth = this.maxHealth;

      this.isDead = 1;
      setTimeout(this.#EndDeath.bind(this), DEATH_DURATION);
   }
   #EndDeath() {
      this.isDead = 0;

      window.location.reload();
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
         timeSinceKeypressedLeft = 0;
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
      else {
         this.EndMoveRight();
         timeSinceKeypressedRight = 0;
      }

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

      // INHALE
      if (keypressed.attack && !this.isFloating && !this.isMouthfull && this.intervalInhale == -1) {
         this.intervalInhale = setInterval(this.#Inhale.bind(this), 1);
      }
      else if ((keyup.attack && this.isInhaling && !this.isMouthfull && !this.isInhalingAnObject)) {
         this.#EndInhale();
      }

      // EXPULSE AIR
      if (keypressed.attack && this.isFloating) {
         this.ExpulseAir();
      }

      // EXPULSE STAR
      if (keypressed.attack && this.isMouthfull) {
         this.#ExpulseStar()
      }
      // INGEST
      if (keypressed.down && this.isMouthfull) {
         this.#Ingest();
      }

      timeSinceKeypressedLeft++;
      timeSinceKeypressedRight++;

      ClearInputs();
   }

   MoveLeft() {
      // Can't move if crounching
      if (this.isCrouching)
         return;

      // Move
      if (this.transform.GetLeft() > 0 &&
         !AreObjectsCollidingArray(this.element, this.transform.GetLeft() - 1 * SCALE, this.transform.GetTop(), environnement)
         && !AreObjectsCollidingArray(this.element, this.transform.GetLeft() - 1 * SCALE, this.transform.GetTop(), blocks) // collisions
         && CanKirbyMoveToTheLeft()) // for scrolling
         this.TranslateXRound(-1);

      // Bool
      this.isWalkingLeft = 1;
   }
   EndMoveLeft() {
      if (this.intervalMovementLeft != -1) {
         clearInterval(this.intervalMovementLeft);
         this.intervalMovementLeft = -1;
         this.isWalkingLeft = 0;
      }
   }

   MoveRight() {
      if (this.isCrouching)
         return;

      if (this.transform.GetLeft() + this.transform.GetWidth() < ParseInt(game, "width") &&
         !AreObjectsCollidingArray(this.element, this.transform.GetLeft() + 1 * SCALE, this.transform.GetTop(), environnement)
         && !AreObjectsCollidingArray(this.element, this.transform.GetLeft() + 1 * SCALE, this.transform.GetTop(), blocks)
         && CanKirbyMoveToTheRight()) // for scrolling
         this.TranslateXRound(1);

      this.isWalkingRight = 1;
   }
   EndMoveRight() {
      if (this.intervalMovementRight != -1) {
         clearInterval(this.intervalMovementRight);
         this.intervalMovementRight = -1;
         this.isWalkingRight = 0;
      }
   }

   Crounch() {
      if (!this.isGrounded)
         return;

      this.isCrouching = 1;
      this.isWalkingLeft = 0;
      this.isWalkingRight = 0;
   }

   TryOpenDoor() {
      // 
      if (AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop(), doors)) {
         let door = ReturnObjectInsideCollisionBox(this.transform.GetLeft(), this.transform.GetTop(), this.transform.GetWidth(), this.transform.GetHeight(), doors)
         window.location.href = door.destination;
      }
   }

   Jump() {
      if (this.isJumping)
         return;
      if (this.isFloating)
         return;

      // Bool
      this.isJumping = 1;
      this.jumpForce = JUMP_FORCE;
      this.timeSinceJumpEnded = 0;
   }

   #Inhale() {
      if (this.isExpulsingAir || this.isInhaling || this.isMouthfull)
         return;

      this.spriteRenderer.TranslateY(-8);

      // Bool
      this.isInhaling = 1;
      this.isAttacking = 1;

      // Inhale particles
      if (this.intervalSpawnInhalableParticle == -1)
         this.intervalSpawnInhalableParticle = setInterval(this.SpawnInhaleParticle.bind(this), PARTICLE_SPAWN_RATE);

      // Set collision box to find any object to can be inhale
      var collisionBox = {
         width: 30 * SCALE, height: 16 * SCALE,
         left: this.isFlip ? this.transform.GetLeft() - 30 * SCALE : this.transform.GetLeft() + 30 * SCALE, top: this.transform.GetTop()
      };
      // Find object to inhale
      var objectInsideCollisionBox = ReturnObjectInsideCollisionBox(
         collisionBox.left, collisionBox.top, collisionBox.width, collisionBox.height, blocks);
      if (objectInsideCollisionBox == null)
         objectInsideCollisionBox = ReturnObjectInsideCollisionBox(
            collisionBox.left, collisionBox.top, collisionBox.width, collisionBox.height, inhalable_stars);
      if (objectInsideCollisionBox == null)
         objectInsideCollisionBox = ReturnObjectInsideCollisionBox(
            collisionBox.left, collisionBox.top, collisionBox.width, collisionBox.height, ennemies);
      // Move object towards kirby
      if (objectInsideCollisionBox && this.intervalMoveTowardsHorizontal == -1 && !objectInsideCollisionBox.isInvincible) {
         this.isInhalingAnObject = 1;
         this.isInvincible = 1;
         this.intervalMoveTowardsHorizontal = setInterval(this.#MoveTowardsKirbyHorizontaly.bind(this), 20, objectInsideCollisionBox);
         this.intervalMoveTowardsVertical = setInterval(this.#MoveTowardsKirbyVerticaly.bind(this), 30, objectInsideCollisionBox);
      }
   }
   SpawnInhaleParticle() {
      var i = new InhaleParticle();
   }
   #EndInhale() {
      // Bool
      this.isAttacking = 0;
      this.isInhaling = 0;
      this.isInhalingAnObject = 0;

      if (!this.isMouthfull)
         this.spriteRenderer.TranslateYRound(8);
      this.style.position = "relative";

      // Clear interval
      if (this.intervalSpawnInhalableParticle != -1) {
         clearInterval(this.intervalSpawnInhalableParticle);
         this.intervalSpawnInhalableParticle = -1;
      }

      // Delete particles
      DeleteAllObjWithClassName("particle");

      // Clear Interval
      if (this.intervalInhale != -1) {
         clearInterval(this.intervalInhale);
         this.intervalInhale = -1;
      }
   }

   #Mouthfull() {
      // Bool
      this.isMouthfull = 1;
      this.isInhaling = 0;

      this.#EndInhale();
   }
   #ExpulseStar() {
      if (!this.isMouthfull)
         return;

      this.isMouthfull = 0;

      let left = !this.isFlip ? this.transform.GetLeft() + this.transform.GetWidth() / 2 + 20 * SCALE : this.transform.GetLeft() + this.transform.GetWidth() / 2 - 20 * SCALE
      var s = !this.isFlip ? new Star(left, this.transform.GetTop(), this.isFlip, 1, 10000) : new Star(left, this.transform.GetTop(), this.isFlip, -1, 10000);

      this.spriteRenderer.TranslateYRound(8);
   }
   #Ingest() {
      if (!this.isMouthfull)
         return;

      // Bool
      this.isMouthfull = 0;
      this.isAttacking = 0;
      this.isInhaling = 0;
      this.isInhalingAnObject = 0;

      this.spriteRenderer.TranslateYRound(8);

      // Copy Ability
      this.#ChangeAbility(this.ability);
   }

   Float() {
      if (this.isGrounded || this.isMouthfull)
         return;

      // Bool
      this.isFloating = 1;
      this.isJumping = 0;
      this.jumpForce = 0;

      // Reset Interval
      if (this.intervalGravity != -1) {
         KIRBY_GRAVITY = GRAVITY_FORCE * 2;

         clearInterval(this.intervalGravity);
         this.intervalGravity = setInterval(this.ApplyGravity.bind(this), KIRBY_GRAVITY);
      }
   }

   FloatJump() {
      if (!this.isFloating)
         return;

      this.jumpForce = FLOAT_JUMP_FORCE;
   }

   ExpulseAir() {
      if (!this.isFloating)
         return;

      // Bool
      this.isFloating = 0;
      this.isFloatJumping = 0;
      this.isExpulsingAir = 1;

      new ExpulseAirParticle();

      setTimeout(this.#EndExpulseAir.bind(this), 200);
   }
   #EndExpulseAir() {
      this.isExpulsingAir = 0;
      this.timeSinceJumpEnded = 0;

      if (this.intervalGravity != -1) {
         KIRBY_GRAVITY = GRAVITY_FORCE;

         clearInterval(this.intervalGravity);
         this.intervalGravity = setInterval(this.ApplyGravity.bind(this), KIRBY_GRAVITY);
      }
   }

   #DamageCounterBlow(direction) {
      let forceX = direction.x * (this.#damageCounterBlowForce / 10)
      let forceY = direction.y * (this.#damageCounterBlowForce / 10)
   
      // Check for end
      if (this.#damageCounterBlowForce <= 0 ) {
         clearInterval(this.intervalDamageCounterBlow);
         this.intervalDamageCounterBlow = -1;
         this.#damageCounterBlowForce = DAMAGE_COUNTER_BLOW_FORCE;
         return;
      }

      // Translate
      if (!AreObjectsCollidingArray(this.element, this.transform.GetLeft() + forceX * SCALE, this.transform.GetTop() + forceY * SCALE, environnement)
      && !AreObjectsCollidingArray(this.element, this.transform.GetLeft() + forceX * SCALE, this.transform.GetTop() + forceY * SCALE, blocks)) {
         TranslateX(this, forceX);
         TranslateY(this, forceY);
      }

      this.#damageCounterBlowForce -= 5;
   }
   #DamageDetection() {
      if (this.isInvincible)
         return;

      if (AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop(), ennemies)
         || AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop(), ennemies_projectiles)) {
         
         // Damage Counter Blow
         if (AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop(), ennemies)) {
            this.intervalDamageCounterBlow = setInterval(this.#DamageCounterBlow.bind(this), DAMAGE_COUNTER_BLOW_SPEED, WhichSideWasHit(this, ReturnObjectInsideCollisionBox(this.transform.GetLeft(), this.transform.GetTop(), this.transform.GetWidth(), this.transform.GetHeight(), ennemies)));
         }else if (AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop(), ennemies_projectiles))
            this.intervalDamageCounterBlow = setInterval(this.#DamageCounterBlow.bind(this), DAMAGE_COUNTER_BLOW_SPEED, WhichSideWasHit(this, ReturnObjectInsideCollisionBox(this.transform.GetLeft(), this.transform.GetTop(), this.transform.GetWidth(), this.transform.GetHeight(), ennemies_projectiles)));

         this.#Damage();
      }
   }

   #MoveTowardsKirbyHorizontaly(object) {
      // X
      if (object.transform.GetLeft() < this.transform.GetLeft())
         object.TranslateX(1);
      else if (object.transform.GetLeft() > this.transform.GetLeft() + this.transform.GetWidth())
         object.TranslateX(-1);
      else {
         if (object.ability)
            this.ability = object.ability;

         object.Delete();

         clearInterval(this.intervalMoveTowardsHorizontal);
         clearInterval(this.intervalMoveTowardsVertical);
         this.intervalMoveTowardsHorizontal = -1;
         this.intercalMoveTowardsVertical = -1;
         this.isInhalingAnObject = 0;
         this.isInvincible = 0;
         this.#Mouthfull();
      }
   }

   #MoveTowardsKirbyVerticaly(object) {
      // Y
      if (object.transform.GetTop() < this.transform.GetTop())
         object.TranslateY(1);
      else if (object.transform.GetTop() > this.transform.GetTop())
         object.TranslateY(-1);
   }

   #ChangeAbility(ability) {
      if (ability != E_Ability.NORMAL) {
         this.spriteRenderer.Delete()
         this.spriteRenderer = null;
         this.#ClearAllIntervals();
         CopyAbilityParticle.SpawnMultiple(7, 80);
         //ui.ChangeAbility(ability);
      }

      switch (ability) {
         case E_Ability.FIRE:
            kirby = new KirbyFire(this.transform.GetLeft(), this.transform.GetTop(), this.hasScrolling, this.isFlip, this.currentHealth);
            break;
         case E_Ability.CUTTER:
            kirby = new KirbyCutter(this.transform.GetLeft(), this.transform.GetTop(), this.hasScrolling, this.isFlip, this.currentHealth);
            break;
         case E_Ability.BEAM:
            kirby = new KirbyBeam(this.transform.GetLeft(), this.transform.GetTop(), this.hasScrolling, this.isFlip, this.currentHealth);
            break;
         case E_Ability.ICE:
            kirby = new KirbyIce(this.transform.GetLeft(), this.transform.GetTop(), this.hasScrolling, this.isFlip, this.currentHealth);
            break;
         case E_Ability.SPARK:
            kirby = new KirbySpark(this.transform.GetLeft(), this.transform.GetTop(), this.hasScrolling, this.isFlip, this.currentHealth);
            break;
         case E_Ability.SLEEP:
            kirby = new KirbySleep(this.transform.GetLeft(), this.transform.GetTop(), this.hasScrolling, this.isFlip, this.currentHealth);
            break;

         default:
            break;
      }
   }

   RemoveAbility() {
      if (this.ability == E_Ability.NORMAL)
         return;

      this.spriteRenderer.Delete()
      this.spriteRenderer = null;
      this.#ClearAllIntervals();
      kirby = new Kirby(this.transform.GetLeft(), this.transform.GetTop(), this.hasScrolling, this.isFlip, this.currentHealth);
      //ui.ChangeAbility(E_Ability.NORMAL);
   }

   ApplyGravity() {
      var left = ParseInt(this.element, "left");
      var top = ParseInt(this.element, "top");
      var height = ParseInt(this.element, "height");

      var finalJumpForce = 0;
      var gravity = 1.5;

      // Jump
      if (this.jumpForce > 0 && !this.isFloating) {
         if (timeHoldingJump < TIME_HOLDING_JUMP_MIN) timeHoldingJump = TIME_HOLDING_JUMP_MIN;

         finalJumpForce = -(this.jumpForce * (timeHoldingJump / 18) / 10);

         if (this.transform.GetTop() + finalJumpForce * SCALE > 0
            && !AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop() + finalJumpForce * SCALE, environnement)
            && !AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop() + finalJumpForce * SCALE, blocks)
            && CanKirbyMoveToTheTop())
            this.TranslateY(finalJumpForce);

         if (Math.abs(this.jumpForce) < 5)
            this.jumpForce -= 0.25;
         else
            this.jumpForce--;
      }

      // FloatJump
      if (this.jumpForce > 0 && this.isFloating) {
         finalJumpForce = -(this.jumpForce / 5);
         if (this.transform.GetTop() + finalJumpForce * SCALE > 0
            && !AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop() + finalJumpForce * SCALE, environnement)
            && !AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop() + finalJumpForce * SCALE, blocks)
            && CanKirbyMoveToTheTop())
            this.TranslateY(finalJumpForce);

         this.jumpForce--;
      }

      // Apply gravity
      if (top + height + SCALE * gravity < ParseInt(game, "height") &&
         !AreObjectsCollidingArray(kirby.element, left, top + SCALE * gravity, environnement)
         && !(AreObjectsCollidingArray(kirby.element, left, top + SCALE * gravity, oneWayPlatforms))
      ) { // for scrolling
         if (CanKirbyMoveToTheBottom())
            this.TranslateY(gravity);
         this.isGrounded = 0;
         canSpawnStar = 1;

         this.timeAirborn++;

         if (this.jumpForce <= 0)
            this.timeSinceJumpEnded++;
      }
      else {
         this.isJumping = 0;
         timeHoldingJump = 1;
         this.timeSinceJumpEnded = 0;

         this.isGrounded = 1;
         this.isMovingDown = 0;

         if (canSpawnStar && this.timeAirborn > 5)
            new StarParticle();

         this.timeAirborn = 0;
      }

      var direction = finalJumpForce + gravity;
      if (direction > 0) { this.isMovingDown = 1; this.isMovingUp = 0; }
      else if (direction < 0) { this.isMovingUp = 1; this.isMovingDown = 0; }
      else { this.isMovingUp = 0; this.isMovingDown = 0; }
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
         // INHALE
         if (this.isAttacking) {
            SetBackgroundImage(this.spriteRenderer, "./img/" + this.artstyle + "/kirby/kirby_inhale_01.png");
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

   Delete() {
      if (this.element) {
         this.element.remove();
         this.element = null;
      }
      if (this.style) {
         this.style = null;
      }

      this.spriteRenderer.Delete()
      this.spriteRenderer = null;

      let index = objects.indexOf(this);
      if (index !== -1) {
         objects.splice(index, 1);
      }
      originalScales.delete(this);

      this.#ClearAllIntervals();
   }

   #ClearAllIntervals() {
      if (this.intervalAnimationManager != -1) {
         clearInterval(this.intervalAnimationManager); this.intervalAnimationManager = -1;
      }
      if (this.intervalDamageDetection != -1) {
         clearInterval(this.intervalDamageDetection); this.intervalDamageDetection = -1;
      }
      if (this.intervalDamageCounterBlow != -1) {
         clearInterval(this.intervalDamageCounterBlow); this.intervalDamageCounterBlow = -1;
      }
      if (this.intervalGravity != -1) {
         clearInterval(this.intervalGravity); this.intervalGravity = -1;
      }
      if (this.intervalInhale != -1) {
         clearInterval(this.intervalInhale); this.intervalInhale = -1;
      }
      if (this.intervalInvincibilityBlink != -1) {
         clearInterval(this.intervalInvincibilityBlink); this.intervalInvincibilityBlink = -1;
      }
      if (this.intervalReadInput != -1) {
         clearInterval(this.intervalReadInput); this.intervalReadInput = -1;
      }
      if (this.intervalSpawnInhalableParticle != -1) {
         clearInterval(this.intervalSpawnInhalableParticle); this.intervalSpawnInhalableParticle = -1;
      }
      if (this.intercalMoveTowardsVertical != -1) {
         clearInterval(this.intercalMoveTowardsVertical); this.intercalMoveTowardsVertical = -1;
      }
      if (this.intervalMoveTowardsHorizontal != -1) {
         clearInterval(this.intervalMoveTowardsHorizontal); this.intervalMoveTowardsHorizontal = -1;
      }
      if (this.intervalMovementLeft != -1) {
         clearInterval(this.intervalMovementLeft); this.intervalMovementLeft = -1;
      }
      if (this.intervalMovementRight != -1) {
         clearInterval(this.intervalMovementRight); this.intervalMovementRight = -1;
      }
   }

   Debug() {
      console.log("isJumping : " + this.isJumping);
      console.log("intervalJump : " + this.intervalJump);
   }

}

var bothDirectionArePressed = 0;

var timeHoldingJump = 1;
var timeSinceKeypressedLeft = 0;
var timeSinceKeypressedRight = 0;

var canSpawnStar = 0;

function IsKirbyInLeftSide() {
   return kirby.transform.GetLeft() <= ParseInt(game, "width") / 2;
}
function IsKirbyInRightSide() {
   return kirby.transform.GetLeft() >= ParseInt(game, "width") / 2;
}
function IsKirbyInTopSide() {
   return kirby.transform.GetTop() <= ParseInt(game, "height") / 2;
}
function IsKirbyInBottomSide() {
   return kirby.transform.GetTop() >= ParseInt(game, "height") / 2;
}
function CanKirbyMoveToTheLeft() {
   if (!kirby.hasScrolling)
      return true;
   return ((!IsKirbyInLeftSide() && kirby.isWalkingLeft) || background.transform.GetLeft() >= 0);
}
function CanKirbyMoveToTheRight() {
   if (!kirby.hasScrolling)
      return true;
   return !IsKirbyInRightSide() && kirby.isWalkingRight || background.transform.GetWidth() + background.transform.GetLeft() <= ParseInt(game, "width");
}
function CanKirbyMoveToTheTop() {
   if (!kirby.hasScrolling)
      return true;
   return ((!IsKirbyInTopSide()) || background.transform.GetTop() >= 0);
}
function CanKirbyMoveToTheBottom() {
   if (!kirby.hasScrolling)
      return true;
   return (!IsKirbyInBottomSide() && kirby.isMovingDown || background.transform.GetHeight() + background.transform.GetTop() <= ParseInt(game, "height"));
}

