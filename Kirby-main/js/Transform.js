/*
   - Concrete -
   Used by Object
   It keep track of coord of objects
*/
class Transform {
   #left = 0;
   #top = 0;
   #width = 0;
   #height = 0;

   constructor(_left, _top, _width, _height) {
      this.#left = _left;
      this.#top = _top;
      this.#width = _width;
      this.#height = _height;
   }

   // UPDATE
   UpdateObjectStats(object) {
      this.#left = ParseInt(object.element, "left");
      this.#top = ParseInt(object.element, "top");
      this.#width = ParseInt(object.element, "width");
      this.#height = ParseInt(object.element, "height");
   }

   // GETTER - SETTER
   GetLeft() { return this.#left; }
   GetTop() { return this.#top; }
   GetWidth() { return this.#width; }
   GetHeight() { return this.#height; }
}