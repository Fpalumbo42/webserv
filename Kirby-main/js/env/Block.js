/*
   - Concrete -
   An object that can be inhaled be Kirby. Nothing much.
*/
class Block extends Object {
   constructor(_left, _top) {
      var elem = CreateAndInsertElement("block");

      super(_left, _top, elem);

      blocks.push(this);
      environnement.push(this);
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
      index = blocks.indexOf(this);
      if (index !== -1) {
         blocks.splice(index, 1);
      }
      index = environnement.indexOf(this);
      if (index !== -1) {
         environnement.splice(index, 1);
      }

      if (this.intervalUpdateStats != -1) { clearInterval(this.intervalUpdateStats); this.intervalUpdateStats = -1; } // Prevent memory leaks
   }
}