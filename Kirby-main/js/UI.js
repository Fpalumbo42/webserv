class UI extends Object {
   #hpLeft = 28;
   #hpOffset = 12;

   constructor() {
      super(0, 218, document.getElementById("UI"));

      this.Init();
   }

   Init() {
      var kirbyUI = document.getElementById("kirby_UI");

      // Health points
      for (let i = 0; i < KIRBY_MAX_HEALTH; i++) {
         var hp = document.createElement("div");
         hp.className = "kirby_health_point";

         hp.style.left = this.#hpLeft + "%";

         kirbyHealthPoints.push(hp);
         kirbyUI.parentNode.insertBefore(hp, kirbyUI);

         this.#hpLeft += this.#hpOffset;
      }
   }

   ChangeAbility(ability) {
      var kirbyUI = document.getElementById("kirby_UI");
      kirbyUI.style.backgroundImage = "url(../img/adventure/UI/" + ability + ".png)";
   }


   RemoveHealthPoint() {
      if (kirbyHealthPoints.length <= 0)
         return;

      this.#hpLeft -= this.#hpOffset;

      var hp = kirbyHealthPoints.pop();
      hp.remove();
   }

   RemoveAllHealthPoint() {
      if (kirbyHealthPoints.length <= 0)
         return;

      while (kirbyHealthPoints.length > 0) {
         this.RemoveHealthPoint();
      }

      this.#hpLeft = 28;
   }

   AddAmountHealthPoint(amount) {
      for (let i = 0; i < amount; i++) {
         this.AddHealthPoint();
      }
   }

   AddHealthPoint() {
      var kirbyUI = document.getElementById("kirby_UI");

      var hp = document.createElement("div");
      hp.className = "kirby_health_point";
      hp.style.left = this.#hpLeft + "%";

      this.#hpLeft += this.#hpOffset;

      kirbyHealthPoints.push(hp);
      kirbyUI.parentNode.insertBefore(hp, kirbyUI);
   }
}

var kirbyHealthPoints = [];