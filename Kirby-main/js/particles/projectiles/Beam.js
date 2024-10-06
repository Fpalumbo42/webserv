class Beam extends Projectile {
   directionLeft = 0;
   directionTop = 0;
   force = 5;

   constructor(_left, _top, _directionLeft, _directionTop, _duration, _isAKirbyProjectile) {
      super(_left, _top, false, "beam", _duration, _isAKirbyProjectile);

      this.directionLeft = _directionLeft;
      this.directionTop = _directionTop;

      this.intervalMove = setInterval(this.Move.bind(this), 10);
   }

   Move() {
      this.style.left = ParseInt(this.element, "left") + this.directionLeft * (this.force * Math.round(SCALE)) + "px";
      this.style.top = ParseInt(this.element, "top") + this.directionTop * (this.force * Math.round(SCALE)) + "px";
      this.UpdateObjectStats();
   }
}