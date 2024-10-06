/*
    - Abstract -
    A particle who is meant to move and deal damage to Living objects
*/
class Projectile extends Particle {
    intervalMove = -1;

    constructor(_left, _top, _isFlip, _className, _timeDuration, _isAKirbyProjectile) {
        super(_left, _top, _isFlip, _className, _timeDuration);

        // Add to projectile array
        if (_isAKirbyProjectile)
            kirby_projectiles.push(this);
        else
            ennemies_projectiles.push(this);
    }

    Delete() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        if (this.style) {
            this.style = null;
        }

        let index = kirby_projectiles.indexOf(this);
        if (index !== -1) {
            kirby_projectiles.splice(index, 1);
        }
        index = ennemies_projectiles.indexOf(this);
        if (index !== -1) {
            ennemies_projectiles.splice(index, 1);
        }
        index = objects.indexOf(this);
        if (index !== -1) {
            objects.splice(index, 1);
        }

        if (this.intervalUpdateStats != -1) { clearInterval(this.intervalUpdateStats); this.intervalUpdateStats = -1; }
        if (this.intervalMove != -1) { clearInterval(this.intervalMove); this.intervalMove = -1; }
    }

    Move() { }
}