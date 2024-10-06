/*
   - Concrete -
   A door is used for changing html pages, when Kirby is near it and the player pressed the UpKey
*/
class Door extends Object {
   destination;

   constructor(_left, _top, _destination) {
      var elem = CreateAndInsertElementWithId("door");

      super(_left, _top, elem);

      this.destination = _destination;

      doors.push(this);
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
      index = doors.indexOf(this);
      if (index !== -1) {
         doors.splice(index, 1);
      }

      if (this.intervalUpdateStats != -1) { clearInterval(this.intervalUpdateStats); this.intervalUpdateStats = -1; } // Prevent memory leaks
   }
}