class CannonBall extends Projectile {
    leftDirection = 0;
    topDirection = 0;

    constructor(_left, _top, _leftDirection, _topDirection) {
       super(_left, _top, false, "cannon_ball", CANNON_BALL_DURATION, false);
 
       this.leftDirection = _leftDirection;
       this.topDirection = _topDirection;

       this.intervalMove = setInterval(this.Move.bind(this), CANNON_BALL_SPEED);
    }

    Move() {
        this.TranslateXRound(this.leftDirection);
        this.TranslateYRound(this.topDirection);
        this.UpdateObjectStats();
    }
}