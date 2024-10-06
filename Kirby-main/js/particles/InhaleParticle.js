class InhaleParticle extends Particle {
   intervalMoveLeft = -1;
   intervalMoveTop = -1;

   constructor() {
      // Position
      let left, random;
      // X
      if (!kirby.isFlip)
         left = (kirby.transform.GetLeft() + kirby.transform.GetWidth() / 2 + 30 * Math.round(SCALE));
      else
         left = (kirby.transform.GetLeft() + kirby.transform.GetWidth() / 2 - 30 * Math.round(SCALE));
      // Y
      random = GetRandomInt(kirby.transform.GetTop(), kirby.transform.GetTop() + kirby.transform.GetHeight());

      super(left, random, false, "particle", 600);

      // Intervals
      this.intervalMoveLeft = setInterval(this.MoveTowardsKirbyLeft.bind(this), PARTICLE_SPEED);
      this.intervalMoveTop = setInterval(this.MoveTowardsKirbyTop.bind(this), PARTICLE_SPEED * 3)
   }

   MoveTowardsKirbyLeft() {
      // X
      if (this.transform.left < kirby.transform.GetLeft() + kirby.transform.GetWidth() / 2)
         this.TranslateXRound(1);
      else if (this.transform.left > kirby.transform.GetLeft() + kirby.transform.GetWidth() / 2)
         this.TranslateXRound(-1);
      else
         this.Delete();
   }

   MoveTowardsKirbyTop() {
      // Y
      if (this.transform.top < kirby.transform.GetTop() + kirby.transform.GetHeight() / 2) {
         this.TranslateYRound(1);
      }
      else if (this.transform.top > kirby.transform.GetTop() + kirby.transform.GetHeight() / 2) {
         this.TranslateYRound(-1);
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

      let index = objects.indexOf(this);
      if (index !== -1) {
         objects.splice(index, 1);
      }

      clearInterval(this.intervalUpdateStats); // Prevent memory leaks
      clearInterval(this.intervalMoveLeft);
      clearInterval(this.intervalMoveTop);
   }
}
