function ParseInt(element, property) {
   return parseInt(window.getComputedStyle(element).getPropertyValue(property));
}

function GetRandomInt(min, max) {
   const minCeiled = Math.ceil(min);
   const maxFloored = Math.floor(max);
   return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}
function GetRandomFloat(min, max) {
   return Math.random() * (max - min) + min;
}

function SetBackgroundImage(object, imgUrl) {
   object.style.backgroundImage = "url(" + imgUrl + ")";
   object.style.animation = null;

   SetObjectDimensions(object, GetImageWidth(imgUrl), GetImageHeight(imgUrl));
}

function SetAnimation(object, animation, width, height) {
   object.style.animation = null;
   object.style.animation = animation + " steps(1)";
   SetObjectDimensions(object, width, height);
}

function RemoveElement(element) {
   element.remove();
}

function SetObjectDimensions(object, width, height) {
   object.style.width = width * SCALE + "px";
   object.style.height = height * SCALE + "px";
}

function SetObjectHeight(object, height) {
   object.style.height = height * SCALE + "px";
}

function SetObjectWidth(object, width) {
   object.style.width = width * SCALE + "px";
}

function TranslateX(object, distance) {
   var object_left = object.element ? ParseInt(object.element, "left") : ParseInt(object, "left");

   object.style.left = (object_left + distance * SCALE) + "px";
}
function TranslateXRound(object, distance) {
   var object_left = object.element ? ParseInt(object.element, "left") : ParseInt(object, "left");

   object.style.left = (object_left + distance * Math.round(SCALE)) + "px";
}

function TranslateY(object, distance) {
   var object_top = object.element ? ParseInt(object.element, "top") : ParseInt(object, "top");

   object.style.top = (object_top + distance * SCALE) + "px";
}
function TranslateYRound(object, distance) {
   var object_top = object.element ? ParseInt(object.element, "top") : ParseInt(object, "top");

   object.style.top = (object_top + distance * Math.round(SCALE)) + "px";
}

function FlipObject(object) {
   if (object.isFlip) {
      object.style.transform = "";
      object.isFlip = 0;
   }
   else {
      object.style.transform = object.style.transform + " scaleX(-1)";
      object.isFlip = 1;
   }
}

var addEvent = function (object, type, callback) {
   if (object == null || typeof (object) == 'undefined') return;
   if (object.addEventListener) {
      object.addEventListener(type, callback, false);
   } else if (object.attachEvent) {
      object.attachEvent("on" + type, callback);
   } else {
      object["on" + type] = callback;
   }
};

function GetImageWidth(imageSrc) {
   const newImg = new Image();
   newImg.src = imageSrc;
   return (newImg.width);
}

function GetImageHeight(imageSrc) {
   const newImg = new Image();
   newImg.src = imageSrc;
   return (newImg.height);
}

function DeleteAllObjWithClassName(className) {
   var particles = document.getElementsByClassName(className);

   for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].remove();
   }
}

// Return an element
function CreateElement(className) {
   var element = document.createElement("div");
   element.className = className;

   return element;
}

function CreateElementWithId(idName) {
   var element = document.createElement("div");
   element.id = idName;

   return element;
}

// Return an element
function CreateAndInsertElement(className) {
   var element = document.createElement("div");
   element.className = className;
   let kirb = document.getElementById("kirby");
   kirb.parentNode.insertBefore(element, kirb);

   return element;
}

// Return an element
function CreateAndInsertElementWithId(className, idName) {
   var element = document.createElement("div");
   element.className = className;
   element.id = idName;
   let kirb = document.getElementById("kirby");
   kirb.parentNode.insertBefore(element, kirb);

   return element;
}
/*
function ClearInterval(object, interval) {
   if (interval != -1) {
      clearInterval(object[interval]);
      object[interval] = -1;
   }
}*/

function ShakeScreen() {
   const body = document.querySelector('body');

   body.style.animation = null;
   body.style.animation = "shake 0.5s steps(1) infinite";
   body.style.animationPlayState = 'running';
}
 