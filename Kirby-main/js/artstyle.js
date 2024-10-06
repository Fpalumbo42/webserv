const E_ArtStyle = {
   DREAMLAND: "dream_land",
   ADVENTURE: "adventure",
   NIGHTMARE: "nightmare"
}

function ChangeArtstyle(newArtstyle) {
   // Get all divs
   var elems = document.querySelectorAll("div");

   for (let i = 0; i < elems.length; i++) {
      const element = elems[i];

      switch (newArtstyle) {
         case Dreamland:
            //SetBackgroundImage(element.style.backgroundImage);
            break;
         case Adventure:
            break;
         default:
            break;
      }
   }

}