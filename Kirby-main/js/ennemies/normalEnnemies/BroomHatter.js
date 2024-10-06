class BroomHatter extends Ennemy {
    intervalAnimation = -1;

    direction = 1;
    speed = 15;

    movementForce = 20;
    movementCooldown = 400;
    canMove = true;

    hasLoaded = false;

    hasBeginMovement = false;

    constructor(_left, _top, _walkDirection, _speed) {
        super(_left, _top, 1, "broom_hatter");

        this.direction = _walkDirection;
        this.speed = _speed;

        this.intervalMovement = setInterval(this.Move.bind(this), this.speed);
        this.intervalAnimation = setInterval(this.AnimationManager.bind(this), 1);
    }

    Move() {
        if(!this.IsOnScreen() && !this.hasLoaded)
            return;
        if (!this.canMove)
            return;

        var movementFinalForce = this.direction * (this.movementForce / 10);
        this.hasLoaded = true;
        this.hasBeginMovement = true;

        // change walking direction when hitting environnement
        if (AreObjectsCollidingArray(this.element, this.transform.GetLeft() + movementFinalForce * Math.round(SCALE), this.transform.GetTop(), environnement)) {
            this.direction *= -1;
            FlipObject(this);
        }
        
        this.TranslateXRound(movementFinalForce);
        this.movementForce--;
        if (this.movementForce <= 0) {
            this.hasBeginMovement = false;
            this.canMove = false;
            setTimeout(this.MoveCooldown.bind(this), this.movementCooldown);
        }
    }

    MoveCooldown() {
        this.canMove = true;
        this.movementForce = 20;
    }

    AnimationManager() {
        if (this.hasBeginMovement) {
            this.style.animation = null;
            this.style.animation = "broom_hatter_move 400ms steps(1)";
        }
        else
            SetBackgroundImage(this, "../../../img/adventure/ennemies/broom_hatter/broom_hatter_00.png");
    }
}