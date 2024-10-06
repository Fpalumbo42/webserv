class Item extends Living {
   intervalDetectKirby = -1;

   healAmount = 0;

   constructor(_left, _top, _className) {
      super(_left, _top, CreateElement(_className), 0);

      // Insertion
      game.insertBefore(this.element, game.element);
      // Add ennemy to ennemies array
      items.push(this);

      this.intervalDetectKirby = setInterval(this.#DetectKirby.bind(this), 1);
   }

   #DetectKirby() {
      if (AreObjectsColliding(this.element, kirby.element)) {
         kirby.Heal(this.healAmount);
         this.Delete();
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
      index = items.indexOf(this);
      if (index !== -1) {
         items.splice(index, 1);
      }
      originalScales.delete(this);

      if (this.intervalUpdateStats != -1) { clearInterval(this.intervalUpdateStats); this.intervalUpdateStats = -1; } // Prevent memory leaks
      if (this.intervalGravity != -1) { clearInterval(this.intervalGravity); this.intervalGravity = -1; }
      if (this.intervalDetectKirby != -1) { clearInterval(this.intervalDetectKirby); this.intervalDetectKirby = -1; }
   }
}