/*
    - Concrete -
    An object on which Living object will collide with.
*/
class Platform extends Object {
    constructor(_left, _top, _className) {
        var elem = CreateAndInsertElement(_className);

        super(_left, _top, elem);

        environnement.push(this);
    }

    Delete() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        if (this.style) {
            this.style = null;
        }

        let index = objects.indexOf(this);
        if (index !== -1) {
            objects.splice(index, 1);
        }
        index = environnement.indexOf(this);
        if (index !== -1) {
            environnement.splice(index, 1);
        }

        if (this.intervalUpdateStats != -1) { clearInterval(this.intervalUpdateStats); this.intervalUpdateStats = -1; }// Prevent memory leaks
    }
}