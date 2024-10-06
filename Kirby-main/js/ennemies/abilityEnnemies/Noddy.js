class Noddy extends EnnemyAbility {
    constructor(_left, _top, _health, _elem){
        super(_left, _top, 3, "noddy");

        this.ability = E_Ability.SLEEP;
    }
}