const HEIGHT = 250;
const WIDTH = 500;

const LEFT_LIMIT = 0;
const RIGHT_LIMIT = 1000;

const KIRBY_HEIGHT = 16;
const KIRBY_WIDTH = 16;

const LEFT_ARROW_KEY = "ArrowLeft";
const RIGHT_ARROW_KEY = "ArrowRight";
const DOWN_ARROW_KEY = "ArrowDown";
const UP_ARROW_KEY = "ArrowUp";
const Q_KEY = "q";
const D_KEY = "d";
const S_KEY = "s";
const Z_KEY = "z";
const SPACE_BAR_KEY = " ";
const C_KEY = "c";
const X_KEY = "x";

const GRAVITY_FORCE = 10; //  plus élevé == moins puissante
var KIRBY_GRAVITY = GRAVITY_FORCE;
const MOVEMENT_SPEED = 10; //  plus élevé == moins puissante
const JUMP_FORCE = 30;
const TIME_HOLDING_JUMP_MIN = 8;
const TIME_HOLDING_JUMP_MAX = 50;
const FLOAT_JUMP_FORCE = 18;
const DAMAGE_COUNTER_BLOW_FORCE = 35;
const DAMAGE_COUNTER_BLOW_SPEED = 2;

const PARTICLE_SPAWN_RATE = 100;
const PARTICLE_SPEED = 20;
const DEATH_PARTICLE_DURATION = 200;
const COPY_ABILITY_PARTICLE_DURATION = 150;

const INVINCIBILITY_TIMER = 1000;
const DEATH_DURATION = 1000;

const DEDEDE_SPEED = 15;
const DEDEDE_JUMP_SPEED = 10;
const DEDEDE_JUMP_FORCE = 60;

const STAR_DURATION = 400;
const STAR_SPEED = 5;
const SPARK_DURATION = 200;
const SPARK_SPAWN_RATE = 50;
const CUTTER_DURATION = 3000;
const FIRE_DURATION = 300;
const FIRE_SPAWN_RATE = 200;
const ICE_DURATION = 300;
const ICE_SPAWN_RATE = 200;
const SLEEP_DURATION = 5000;
const CANNON_BALL_DURATION = 5000;
const CANNON_BALL_SPEED = 16;

const KIRBY_MAX_HEALTH = 6;

var SCALE = window.innerHeight / HEIGHT;
