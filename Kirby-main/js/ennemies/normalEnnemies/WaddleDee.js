class WaddleDee extends Ennemy {
    direction = 1;
    speed = 15;

    hasLoaded = false;

    constructor(_left, _top, _walkDirection, _speed) {
        super(_left, _top, 1, "waddle_dee");

        this.direction = _walkDirection;
        this.speed = _speed;

        this.intervalMovement = setInterval(this.Move.bind(this), this.speed);
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
}