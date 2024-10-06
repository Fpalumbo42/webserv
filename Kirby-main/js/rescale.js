var originalScales = new Map();
var originalSpriteRendererScales = new Map();

function ScaleAll() {
   for (let i = 0; i < objects.length; i++) {
      // deep copy
      let transform = new Transform(ParseInt(objects[i].element, "left"), ParseInt(objects[i].element, "top"), ParseInt(objects[i].element, "width"), ParseInt(objects[i].element, "height"));
      originalScales.set(objects[i].element, transform);

      objects[i].style.width = ParseInt(objects[i].element, "width") * SCALE + "px";
      objects[i].style.height = ParseInt(objects[i].element, "height") * SCALE + "px";
      objects[i].style.left = ParseInt(objects[i].element, "left") * SCALE + "px";
      objects[i].style.top = ParseInt(objects[i].element, "top") * SCALE + "px";
      objects[i].UpdateObjectStats();
   }
}

function RescaleAll() {
   // recalculeted the scale
   oldScale = SCALE;
   SCALE = window.innerHeight / HEIGHT;
   SetGameWidthHeight();

   for (let i = 0; i < objects.length; i++) {
      if (originalScales.get(objects[i].element)) {
         objects[i].style.width = originalScales.get(objects[i].element).GetWidth() * SCALE + "px";
         objects[i].style.height = originalScales.get(objects[i].element).GetHeight() * SCALE + "px";
         if (objects[i].isLiving) {
            objects[i].style.left = objects[i].transform.GetLeft() / oldScale * SCALE + "px";
            objects[i].style.top = objects[i].transform.GetTop() / oldScale * SCALE + "px";
         }
         else {
            objects[i].style.left = originalScales.get(objects[i].element).GetLeft() * SCALE + "px";
            objects[i].style.top = originalScales.get(objects[i].element).GetTop() * SCALE + "px";
         }
      } else {
         objects[i].style.width = ParseInt(objects[i].element, "width") * SCALE + "px";
         objects[i].style.height = ParseInt(objects[i].element, "height") * SCALE + "px";
         objects[i].style.left = ParseInt(objects[i].element, "left") * SCALE + "px";
         objects[i].style.top = ParseInt(objects[i].element, "top") * SCALE + "px";
      }
      objects[i].UpdateObjectStats();
   }
}

function RescaleObject(obj) {
   obj.style.width = ParseInt(obj, "width") * SCALE + "px";
   obj.style.height = ParseInt(obj, "height") * SCALE + "px";
}

addEvent(window, "resize", RescaleAll);

ScaleAll();