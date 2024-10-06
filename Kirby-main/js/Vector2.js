class Vector2 {
   x = 0;
   y = 0;

   constructor(x, y) {
      this.x = x;
      this.y = y;
   }

   static GetDistance(vector_a, vector_b) {
      return Math.sqrt(Math.pow(vector_b.x - vector_a.x, 2) + Math.pow(vector_b.y - vector_a.y, 2));
   }

   static GetDistance2(a_x, a_y, b_x, b_y) {
      return Math.sqrt(Math.pow(b_x - a_x, 2) + Math.pow(b_y - a_y, 2));
   }
}