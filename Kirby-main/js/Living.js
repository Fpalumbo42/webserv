/*
   - Abstract -
   Class used mainly for ennemies and player.
   It will apply gravity and can be used to damage (and kill) the object
*/
class Living extends Object {
   currentHealth;
   maxHealth;

   #oldTransform = new Transform();

   isMovingLeft = 0;
   isMovingRight = 0;
   isMovingUp = 0;
   isMovingDown = 0;

   direction = new Vector2();
   velocity = 0;

   isGrounded = 0;
   isFlip = 0;

   intervalGravity = -1;

   constructor(_left, _top, _element, _maxHealth) {
      super(_left, _top, _element);

      this.maxHealth = _maxHealth;
      this.currentHealth = _maxHealth;

      this.isLiving = 1;

      if (this.intervalGravity != -1) {
         clearInterval(this.intervalGravity);
      }
      this.intervalGravity = setInterval(this.ApplyGravity.bind(this), GRAVITY_FORCE);
   }

   TakeDamage(_amount) {
      this.currentHealth -= _amount;

      if (this.currentHealth <= 0)
         this.Death();
   }

   Death() { this.Delete(); }

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
      originalScales.delete(this);

      if (this.intervalUpdateStats != -1) { clearInterval(this.intervalUpdateStats); this.intervalUpdateStats = -1; } // Prevent memory leaks
      if (this.intervalGravity != -1) { clearInterval(this.intervalGravity); this.intervalGravity = -1; }
   }

   ApplyGravity() {
      var left = ParseInt(this.element, "left");
      var top = ParseInt(this.element, "top");
      var height = ParseInt(this.element, "height");

      // Apply gravity
      if (top + height < ParseInt(game, "height") &&
         (!AreObjectsCollidingArray(this.element, left, top + SCALE, blocks) &&
            !AreObjectsCollidingArray(this.element, left, top + SCALE, environnement))
      ) {
         this.TranslateY(1);
         this.isGrounded = 0;
      }
      else {
         this.isGrounded = 1;
      }
   }

   /*UpdateObjectStats() {
      // Set oldTransform
      this.#oldTransform.left = this.transform.left;
      this.#oldTransform.top = this.transform.top;
      this.#oldTransform.width = this.transform.width;
      this.#oldTransform.height = this.transform.height;

      // Set transform
      this.transform.left = ParseInt(this.element, "left");
      this.transform.top = ParseInt(this.element, "top");
      this.transform.width = ParseInt(this.element, "width");
      this.transform.height = ParseInt(this.element, "height");

      // Velocity
      this.velocity = Vector2.GetDistance2(this.#oldTransform.left, this.#oldTransform.top, this.transform.left, this.transform.top);

      // Direction
      this.direction.x = this.transform.left - this.#oldTransform.left;
      this.direction.y = this.transform.top - this.#oldTransform.top;
   }*/
}