class Background extends Object {
   constructor(_left, _top, _id) {
      var elem = CreateAndInsertElementWithId("background", _id);

      super(_left, _top, elem);
   }
}