class Dedede extends Living {
   element = document.getElementById("dedede");
   style = document.getElementById("dedede").style;

   artstyle = E_Artstyle.DREAMLAND;

   isFlip = 0;
   isJumping = 0;
   isStartingToJump = 0;
   isInhaling = 0;
   isInhalingAnObject = 0;
   isWalking = 0;
   isDiving = 0;
   isHammerSwingging = 0;
   isHurt = 0;

   jumpForce = DEDEDE_JUMP_FORCE;
   destinationJump;

   constructor(_left, _top) {
      super(10);

      this.transform.left = _left;
      this.transform.top = _top;
      this.style.left = _left + "px";
      this.style.top = _top + "px";

      //setTimeout(this.StartJump.bind(this), 1000);
      //setTimeout(this.StartInhale.bind(this), 1000);
      //setTimeout(this.StartInhale.bind(this), 1000);

      setInterval(this.AnimationManager.bind(this), 1);
      setInterval(this.ApplyGravity.bind(this), 1);
      setInterval(DededeSpawnInhaleParticle, PARTICLE_SPAWN_RATE * 4);
   }

   StartInhale() {
      this.isInhaling = 1;

      intervalDededeInhale = setInterval(this.Inhale.bind(this), 1);
   }
   Inhale() {
      // Set collision box to find any object to can be inhale
      var collisionBox = {
         width: 30 * SCALE, height: 16 * SCALE,
         left: this.isFlip ? this.left + 30 * SCALE : this.left - 30 * SCALE, top: this.top
      };

      // Find kirby to inhale
      if (AreObjectsColliding3(collisionBox.left, collisionBox.top, collisionBox.width, collisionBox.height, kirby.element)) {
         this.isInhalingAnObject = 1;

         if (intervalDededeInhaleKirby == -1)
            intervalDededeInhaleKirby = setInterval(this.InhaleKirby.bind(this), 30);
      }
   }
   InhaleKirby() {
      // Clear Interval
      clearInterval(intervalDededeInhale);
      intervalDededeInhale = -1;

      // X
      if (kirby.transform.left < this.transform.left + this.transform.width / 2)
         TranslateX(kirby, 1);
      else if (this.transform.left > this.transform.left + this.transform.width / 2)
         TranslateX(kirby, -1);

      // Y
      if (kirby.transform.top < this.transform.top + this.transform.height / 2)
         TranslateY(kirby, 1);
      else if (kirby.transform.top > this.transform.top + this.transform.height / 2)
         TranslateY(kirby, -1);
   }

   StartJump() {
      this.destinationJump = kirby.transform.left;

      this.isStartingToJump = 1;
      setTimeout(this.StartJump1.bind(this), 200);
   }
   StartJump1() {
      this.isStartingToJump = 0;
      this.isJumping = 1;

      intervalDededeJump = setInterval(this.Jump.bind(this), DEDEDE_JUMP_SPEED);
      intervalDededeMoveLeft = setInterval(this.MoveLeft.bind(this), DEDEDE_SPEED, false);
   }
   Jump() {
      TranslateY(this, -(this.jumpForce / 10))
      this.jumpForce--;

      // End Jump
      if (AreObjectsCollidingArray(this.element, this.transform.left, this.transform.top + 1 * SCALE, environnement)
         && this.jumpForce <= 0) {
         // Clear interval
         clearInterval(intervalDededeJump);
         clearInterval(intervalDededeMoveLeft);
         intervalDededeJump = -1;
         intervalDededeMoveLeft = -1;

         // Bool
         this.isStartingToJump = 1;
         this.isJumping = 0;

         // Inhalable star
         SpawnInhalableStar(this.transform.left - 30 * SCALE, this.transform.top + this.transform.height / 2);
         SpawnInhalableStar(this.transform.left + this.transform.width / 2 + 30 * SCALE, this.transform.top + this.transform.height / 2);

         setTimeout(this.EndJump.bind(this), 800);
      }
   }
   EndJump() {
      this.isStartingToJump = 0;
   }

   HammerSlam() {

   }
   MoveLeft(isWalking) {
      this.isWalking = isWalking;

      // Move
      if (this.transform.left > 0 &&
         !AreObjectsCollidingArray(this.element, this.transform.left - 1, this.transform.top, environnement)) {
         TranslateX(this, -1);
      }

      // Flip
      if (this.isFlip)
         FlipObject(this);
   }
   MoveRight() {
      this.isWalking = 1;

      // Move
      if (this.transform.left + this.transform.width < ParseInt(game, "width") &&
         !AreObjectsCollidingArray(this.element, this.transform.left + 1, this.transform.top, environnement)) {
         TranslateX(this, 1);
      }

      // Flip
      if (!this.isFlip)
         FlipObject(this);
   }

   ApplyGravity() {
      var left = ParseInt(this.element, "left");
      var top = ParseInt(this.element, "top");
      var height = ParseInt(this.element, "height");

      if (top + height < ParseInt(game, "height") &&
         (!AreObjectsCollidingArray(this.element, left, top + 1 * SCALE, blocks) &&
            !AreObjectsCollidingArray(this.element, left, top + 1 * SCALE, environnement))) {
         this.style.top = (top + 1 * SCALE) + "px";
      }
   }

   AnimationManager() {
      // INHALE
      if (this.isInhaling) {
         SetBackgroundImage(this, "../img/" + this.artstyle + "/dedede/dedede_inhale.png");
      }
      // WALK
      else if (this.isWalking) {
         this.style.animation = "dedede_walk_" + this.artstyle + " 1000ms infinite";
      }
      // START JUMP
      else if (this.isStartingToJump) {
         SetBackgroundImage(this, "../img/" + this.artstyle + "/dedede/dedede_crounch.png");
      }
      // JUMP
      else if (this.isJumping) {
         SetBackgroundImage(this, "../img/" + this.artstyle + "/dedede/dedede_jump.png");
      }
      // DIVE
      else if (this.isDiving) {
         SetBackgroundImage(this, "../img/" + this.artstyle + "/dedede/dedede_trip.png");
      }
      // HURT
      else if (this.isHurt) {
         SetBackgroundImage(this, "../img/" + this.artstyle + "/dedede/dedede_chockbar.png");
      }
      // IDLE
      else {
         this.style.animation = "dedede_idle_" + this.artstyle + " 1000ms infinite";
      }
   }
}

var intervalDededeJump = -1;
var intervalDededeMoveLeft = -1;
var intervalDededeInhale = -1;
var intervalDededeInhaleKirby = -1;

function IsKirbyAtTheLeftOfDedede() {
   return (kirby.left < dedede.left);
}

