class BuzzyBrut extends Ennemy {
   direction = 1;
   speed = 15;

   maxYMovementAmplitude = 10;
   currentYMovementAmplitude = 0;
   yDirection = 1;

   hasLoaded = false;

   constructor(_left, _top, _moveDirection, _speed) {
      super(_left, _top, 1, "buzzy_brut");

      this.direction = _moveDirection;
      this.speed = _speed;

      this.intervalMovement = setInterval(this.Move.bind(this), this.speed);

      // Flying
      if (this.intervalGravity != -1) {
         clearInterval(this.intervalGravity);
      }
   }

   Move() {
      if(!this.IsOnScreen() && !this.hasLoaded)
         return;

      this.hasLoaded = true;
      this.TranslateXRound(this.direction);

      this.currentYMovementAmplitude += this.yDirection;
      if (Math.abs(this.currentYMovementAmplitude) > this.maxYMovementAmplitude)
         this.yDirection *= -1;
      this.TranslateYRound(this.yDirection);
   }   
}