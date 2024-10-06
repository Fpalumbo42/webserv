class SpriteRenderer {
   element;
   style;

   transform;

   constructor(_parentElement) {
      this.element = CreateElement("none");
      _parentElement.insertBefore(this.element, _parentElement.firstChild);
      this.style = this.element.style;

      this.transform = new Transform();
   }

   SetBackgroundImage(imgUrl) {
      SetBackgroundImage(this, imgUrl);
   }
}