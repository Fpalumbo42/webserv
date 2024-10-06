class OneWayPlatform extends Object {
   constructor(_left, _top) {
      var elem = CreateAndInsertElement("one_way_platform");

      super(_left, _top, elem);

      oneWayPlatforms.push(this);
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
      index = environnement.indexOf(this);
      if (index !== -1) {
         environnement.splice(index, 1);
      }
      index = oneWayPlatforms.indexOf(this);
      if (index !== -1) {
         oneWayPlatforms.splice(index, 1);
      }

      if (this.intervalUpdateStats != -1) { clearInterval(this.intervalUpdateStats); this.intervalUpdateStats = -1; } // Prevent memory leaks
   }
}