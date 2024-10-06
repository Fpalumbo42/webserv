class Star extends Projectile {
   direction = 0;

   constructor(_left, _top, _isFlip, _direction, _duration) {
      super(_left, _top, _isFlip, "star", _duration, true);

      this.direction = _direction;

      this.intervalMove = setInterval(this.Move.bind(this), STAR_SPEED);
   }

   Move() {
      // Collision
      if (AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop(), environnement)
         || AreObjectsCollidingArray(this.element, this.transform.GetLeft(), this.transform.GetTop(), ennemies)
         || this.transform.GetLeft() <= 0 || this.transform.GetLeft() >= background.transform.GetWidth() * SCALE) {
         clearInterval(this.intervalMove);
         this.intervalMove = -1;

         setTimeout(this.Delete.bind(this), 50);
         return;
      }

      // Movement
      this.TranslateXRound(this.direction);
   }
}