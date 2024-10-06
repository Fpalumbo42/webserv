class PoppyJr extends Ennemy {
    intervalWalk = -1;
    direction = 1;
    speed = 15;

    maxJumpForce = 25;
    currentJumpForce = 25;

    #gravity = 20

    hasLoaded = false;

    constructor(_left, _top, _walkDirection, _speed) {
        super(_left, _top, 1, "poppy_jr");

        this.direction = _walkDirection;
        this.speed = _speed;

        this.intervalMovement = setInterval(this.Move.bind(this), this.speed);

        if (this.intervalGravity != -1) { 
            clearInterval(this.intervalGravity);
            this.intervalGravity = setInterval(this.ApplyGravity.bind(this), this.#gravity); }
    }

    Move() {
        if(!this.IsOnScreen() && !this.hasLoaded)
            return;

        this.hasLoaded = true;

        // change walking direction when hitting environnement
        if (AreObjectsCollidingArray(this.element, this.transform.GetLeft() + this.direction * SCALE, this.transform.GetTop(), environnement)) {
            this.direction *= -1;
            FlipObject(this);
        }

        this.TranslateXRound(this.direction);
    }

    ApplyGravity() {
        var left = ParseInt(this.element, "left");
        var top = ParseInt(this.element, "top");
        var height = ParseInt(this.element, "height");
        var jumpForce = this.currentJumpForce;

        // Apply gravity
        if (top - jumpForce + height < ParseInt(game, "height") &&
           (!AreObjectsCollidingArray(this.element, left, top - jumpForce + SCALE, blocks) &&
              !AreObjectsCollidingArray(this.element, left, top - jumpForce + SCALE, environnement))
        ) {
           this.TranslateY(1 - this.currentJumpForce / 10);
           this.isGrounded = 0;
           this.currentJumpForce--;
        }
        else {
            this.isGrounded = 1;
            this.currentJumpForce = this.maxJumpForce;
        }
     }
}