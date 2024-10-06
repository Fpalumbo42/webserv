const keypressed = {
   left: 0,
   right: 0,
   down: 0,
   up: 0,
   jump: 0,
   attack: 0,
   remove: 0
}

const keyheld = {
   left: 0,
   right: 0,
   down: 0,
   up: 0,
   jump: 0,
   attack: 0,
   remove: 0
}

const keyup = {
   left: 0,
   right: 0,
   down: 0,
   up: 0,
   jump: 0,
   attack: 0,
   remove: 0
}

function ClearInputs() {
   keypressed.left = 0;
   keypressed.right = 0;
   keypressed.down = 0;
   keypressed.up = 0;
   keypressed.jump = 0;
   keypressed.attack = 0;
   keypressed.remove = 0;

   keyup.left = 0;
   keyup.right = 0;
   keyup.down = 0;
   keyup.up = 0;
   keyup.jump = 0;
   keyup.attack = 0;
   keyup.remove = 0;
}

// KEYDOWN
document.addEventListener("keydown", event => {
   // LEFT
   if (event.key == LEFT_ARROW_KEY || event.key == Q_KEY) {
      if ((!keyheld.left && !keypressed.left))
         keypressed.left = 1;
      keyheld.left = 1;
      keyup.left = 0;
   }
   // RIGHT
   if (event.key == RIGHT_ARROW_KEY || event.key == D_KEY) {
      if ((!keyheld.right && !keypressed.right))
         keypressed.right = 1;
      keyheld.right = 1;
      keyup.right = 0;
   }

   // DOWN
   if (event.key == DOWN_ARROW_KEY || event.key == S_KEY) {
      if ((!keyheld.down && !keypressed.down))
         keypressed.down = 1;
      keyheld.down = 1;
      keyup.down = 0;
   }

   // UP
   if (event.key == UP_ARROW_KEY || event.key == Z_KEY) {
      if ((!keyheld.up && !keypressed.up))
         keypressed.up = 1;
      keyheld.up = 1;
      keyup.up = 0;
   }

   // ATTACK
   if (event.key == C_KEY) {
      if ((!keyheld.attack && !keypressed.attack))
         keypressed.attack = 1;
      keyheld.attack = 1;
      keyup.attack = 0;
   }

   // REMOVE
   if (event.key == X_KEY) {
      if ((!keyheld.remove && !keypressed.remove))
         keypressed.remove = 1;
      keyheld.remove = 1;
      keyup.remove = 0;
   }

   // JUMP
   if (event.key == SPACE_BAR_KEY) {
      if ((!keyheld.jump && !keypressed.jump))
         keypressed.jump = 1;
      keyheld.jump = 1;
      keyup.jump = 0;
   }
   //DebugInput();
});

// KEYUP
document.addEventListener("keyup", event => {
   // LEFT
   if (event.key == LEFT_ARROW_KEY || event.key == Q_KEY) {
      keypressed.left = 0;
      keyheld.left = 0;
      keyup.left = 1;
   }

   // RIGHT
   if (event.key == RIGHT_ARROW_KEY || event.key == D_KEY) {
      keypressed.right = 0;
      keyheld.right = 0;
      keyup.right = 1;
   }

   // DOWN
   if (event.key == DOWN_ARROW_KEY || event.key == S_KEY) {
      keypressed.down = 0;
      keyheld.down = 0;
      keyup.down = 1;
   }

   // UP
   if (event.key == UP_ARROW_KEY || event.key == Z_KEY) {
      keypressed.up = 0;
      keyheld.up = 0;
      keyup.up = 1;
   }

   // ATTACK
   if (event.key == C_KEY) {
      keypressed.attack = 0;
      keyheld.attack = 0;
      keyup.attack = 1;
   }

   // REMOVE
   if (event.key == X_KEY) {
      keypressed.remove = 0;
      keyheld.remove = 0;
      keyup.remove = 1;
   }

   // JUMP
   if (event.key == SPACE_BAR_KEY) {
      keypressed.jump = 0;
      keyheld.jump = 0;
      keyup.jump = 1;
   }

   //DebugInput();
});

function DebugInput() {
   console.log("keydown_left " + keypressed.left);
   console.log("keydown_right " + keypressed.right);
   console.log("keydown_down " + keypressed.down);
   console.log("keydown_up " + keypressed.up);
   console.log("keydown_attack " + keypressed.attack);
   console.log("keydown_remove " + keypressed.remove);
   console.log("keydown_jump " + keypressed.jump);
}