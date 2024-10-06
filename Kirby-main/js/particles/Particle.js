/*
    - Abstract -
    Used for making particles (objects who are meant to disappear a short time after they're instanciated)
*/
class Particle extends Object {
    constructor(_left, _top, _isFlip, _className, _timeDuration) {
        super(_left, _top, CreateElement(_className));

        // Flip
        if (_isFlip)
            this.style.transform = this.style.transform + " scaleX(-1)";

        // Insertion
        kirby.element.parentNode.insertBefore(this.element, kirby.element);

        // Scaling
        RescaleObject(this.element);

        // Destruction
        setTimeout(this.Delete.bind(this), _timeDuration);
    }
}