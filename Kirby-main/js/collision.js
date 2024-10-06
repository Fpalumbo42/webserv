function AreObjectsColliding(element_a, element_b) {
   let a_left = ParseInt(element_a, "left");
   let b_left = ParseInt(element_b, "left");
   let a_top = ParseInt(element_a, "top");
   let b_top = ParseInt(element_b, "top");
   let a_width = ParseInt(element_a, "width");
   let a_height = ParseInt(element_a, "height");
   let b_width = ParseInt(element_b, "width");
   let b_height = ParseInt(element_b, "height");

   if ((a_left < b_left + b_width) &&
      (a_left + a_width > b_left) &&
      (a_top < b_top + b_height) &&
      (a_top + a_height > b_top))
      return true;
   return false;
}

function AreObjectsColliding2(a, a_left, a_top, b) {
   let a_width = ParseInt(a, "width");
   let a_height = ParseInt(a, "height");

   if ((a_left < b.transform.GetLeft() + b.transform.GetWidth()) &&
      (a_left + a_width > b.transform.GetLeft()) &&
      (a_top < b.transform.GetTop() + b.transform.GetHeight()) &&
      (a_top + a_height > b.transform.GetTop()))
      return true;
   return false;
}

function AreObjectsColliding3(a_left, a_top, a_width, a_height, b) {
   if ((a_left < b.transform.GetLeft() + b.transform.GetWidth()) &&
      (a_left + a_width > b.transform.GetLeft()) &&
      (a_top < b.transform.GetTop() + b.transform.GetHeight()) &&
      (a_top + a_height > b.transform.GetTop()))
      return true;
   return false;
}

function AreObjectsCollidingArray(a, a_left, a_top, array) {
   if (!array)
      return;

   for (let i = 0; i < array.length; i++) {
      var b = array[i];

      if (AreObjectsColliding2(a, a_left, a_top, b)) {
         return true;
      }
   }
   return false;
}

function IsThereAnElementAtPosition(left, top, collisionMaskExclusion) {
   let array = document.elementsFromPoint(left, top);
   let isInCollisionMaskExclusion;

   for (let i = 0; i < array.length; i++) {
      isInCollisionMaskExclusion = false;
      const element = array[i];

      // Ignore <game> and <html>
      if (element.id == "game" || element.tagName == "HTML")
         continue;

      for (let j = 0; j < collisionMaskExclusion.length; j++) {
         if (element.className == collisionMaskExclusion[j]) {
            isInCollisionMaskExclusion = true;
            break;
         }
      }
      if (!isInCollisionMaskExclusion)
         return true;
   }
   return false;
}


function ReturnElementAtPosition(left, top, collisionMaskExclusion) {
   let array = document.elementsFromPoint(left, top);
   let isInCollisionMaskExclusion;

   for (let i = 0; i < array.length; i++) {
      isInCollisionMaskExclusion = false;
      const element = array[i];

      // Ignore <game> and <html>
      if (element.id == "game" || element.tagName == "HTML")
         continue;

      for (let j = 0; j < collisionMaskExclusion.length; j++) {
         if (element.className == collisionMaskExclusion[j]) {
            isInCollisionMaskExclusion = true;
            break;
         }
      }
      if (!isInCollisionMaskExclusion)
         return element;
   }
   return null;
}

function IsThereAnObjectAtPositionColliding(element, left, top, collisionMaskExclusion) {
   if (IsThereAnElementAtPosition(left, top, collisionMaskExclusion)) {
      return AreObjectsColliding2(element, left, top, ReturnElementAtPosition(left, top, collisionMaskExclusion));
   }
   return false;
}

function ReturnObjectInsideCollisionBox(box_left, box_top, box_width, box_height, array) {
   for (let i = 0; i < array.length; i++) {
      const element = array[i];

      if (AreObjectsColliding3(box_left, box_top, box_width, box_height, element))
         return element;
   }
   return null;
}

function WhichSideWasHit(objectA, objectB) {
   let objectABottom = objectA.transform.GetTop() + objectA.transform.GetHeight();
   let objectBBottom = objectB.transform.GetTop() + objectB.transform.GetHeight();
   let objectARight = objectA.transform.GetLeft() + objectA.transform.GetWidth();
   let objectBRight = objectB.transform.GetLeft() + objectB.transform.GetWidth();

   let bottomCollision = objectBBottom - objectA.transform.GetTop();
   let topCollision = objectABottom - objectB.transform.GetTop();
   let leftCollision = objectARight - objectB.transform.GetLeft();
   let rightCollision = objectBRight - objectA.transform.GetLeft();

   if (topCollision < bottomCollision && topCollision < leftCollision && topCollision < rightCollision)
      return new Vector2(0, -1);
   if (bottomCollision < topCollision && bottomCollision < leftCollision && bottomCollision < rightCollision)
      return new Vector2(0, 1);
   if (leftCollision < rightCollision && leftCollision < topCollision && leftCollision < bottomCollision)
      return new Vector2(-1, 0);
   if (rightCollision < leftCollision && rightCollision < topCollision && rightCollision < bottomCollision)
      return new Vector2(0, 1);
}