/* 
   - Abstract -
   All objects that are on a page must unherit from this class
*/
class Object {
   element; // == document.getElementById()
   style;   // == document.getElementById().style

   transform;

   isLiving = 0;
   isFlip = false;

   constructor(_left, _top, _element) {
      this.element = _element;
      this.style = _element.style;

      this.style.left = _left + "px";
      this.style.top = _top + "px";

      objects.push(this);

      //this.spriteRenderer = new SpriteRenderer(this.element);

      this.transform = new Transform(0, 0, 0, 0);
      this.UpdateObjectStats();
   }

   // Must be call when removing an object, it prevents memory leaks
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
   }

   IsOnScreen() {
      return (this.transform.GetLeft() > 0 && this.transform.GetLeft() < window.innerWidth
      &&  this.transform.GetTop() > 0 && this.transform.GetTop() < window.innerHeight)
   }

   // TRANSLATE
   TranslateX(distance) {
      var object_left = ParseInt(this.element, "left");

      this.style.left = (object_left + distance * SCALE) + "px";
      this.UpdateObjectStats();
   }
   TranslateXRound(distance) {
      var object_left = ParseInt(this.element, "left");

      this.style.left = (object_left + distance * Math.round(SCALE)) + "px";
      this.UpdateObjectStats();
   }

   TranslateY(distance) {
      var object_top = ParseInt(this.element, "top");

      this.style.top = (object_top + distance * SCALE) + "px";
      this.UpdateObjectStats();
   }
   TranslateYRound(distance) {
      var object_top = ParseInt(this.element, "top");

      this.style.top = (object_top + distance * Math.round(SCALE)) + "px";
      this.UpdateObjectStats();
   }
   SetPosition(left, top) {
      this.style.left = (left) + "px";
      this.style.top = (top) + "px";
      this.UpdateObjectStats();
   }

   UpdateObjectStats() {
      // Set transform
      this.transform.UpdateObjectStats(this);
   }
}