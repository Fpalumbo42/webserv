var dededeHealthPoints = [];

InitUIDedede();

function InitUIDedede() {
   var dedede_UI = document.getElementById("dedede_UI");

   var hp_left = 200;

   // Health points
   for (let i = 0; i < dedede.maxHealth; i++) {
      var hp = document.createElement("div");
      hp.className = "dedede_health_point";

      hp.style.left = hp_left + "px";

      dededeHealthPoints.push(hp);
      dedede_UI.parentNode.insertBefore(hp, dedede_UI);

      hp_left += 8;
   }
}

function RemoveDededeHealthPoint() {
   if (dededeHealthPoints.length <= 0)
      return;

   var hp = dededeHealthPoints.pop();
   hp.remove();
}