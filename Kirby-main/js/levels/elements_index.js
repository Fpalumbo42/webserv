var objects = [];
var kirby;

// ENV
var environnement = [];
var ground = new Platform(0, 215, "ground");

// ARTSTYLE
var artstyle = E_ArtStyle.Dreamland;

// BLOCKS
var blocks = [];
var block00 = new Block(50, 200);
var block01 = new Block(80, 200);

var platform = new Platform(180, 130, "platform_wood_00");

// ONE-WAY PLATFORM
var oneWayPlatforms = [];
var oneWayPlatform00 = new OneWayPlatform(400, 150);

// BACKGROUND
var background = new Background(0, -50, "background");
var foreground = new Background(0, 120, "foreground");
var secondground = new Background(0, 185, "secondground");
var thirdground = new Background(0, 0, "thirdground");

// ENNEMIES
var ennemies = [];

var gordo00 = new Gordo(300, 150);
var shotzo00 = new ShotzoHorizontal(200, 180);
var shotzo01 = new ShotzoVertical(200, 50);
var waddleDee00 = new WaddleDee(300, 194, -1, 20);
var broomHatter00 = new BroomHatter(700, 194, -1, 20);
var buzzyBrut00 = new BuzzyBrut(700, 100, -1, 18);
var twizzy00 = new Twizzy(650, 120, 18);
var poppyJr00 = new PoppyJr(330, 194, -1, 18);
var coner00 = new Coner(330, 194, -1, 20);
var hotHead00 = new HotHead(350, 194);
//var sirKibble00 = new SirKibble(400, 194);
var waddleDoo00 = new WaddleDoo(450, 194);
var sparky00 = new Sparky(500, 194);
//var pengi00 = new Pengi(550, 194);
var noddy00 = new Noddy(600, 194);

// ITEMS
var items = [];

var drink00 = new Drink(200, 194);
var tomato00 = new Tomato(170, 194);

// DOOR
//var doors = [];
//var dededeDoor = new Door(186, 192, "dedede_battle.html");

// CONTROLS
var controls = document.getElementById("controls");

// STARS
var inhalable_stars = [];

// PROJECTILES
var kirby_projectiles = [];
var ennemies_projectiles = [];

// UI
var ui = new UI();

kirby = new Kirby(244, 192, true, false, KIRBY_MAX_HEALTH);

const intervalScrollingVerticalArray = {
   intervalEnvironnement: 0,
   intervalEnnemies: 0,
   intervalForeground: 0,
   intervalSecondground: 0,
   intervalThirdground: 0,
   intervalBackground: 0
};

setInterval(ScrollingArrayHorizontal, MOVEMENT_SPEED, ennemies_projectiles);
setInterval(ScrollingArrayVertical, KIRBY_GRAVITY, ennemies_projectiles);
setInterval(ScrollingArrayHorizontal, MOVEMENT_SPEED, items);
setInterval(ScrollingArrayVertical, KIRBY_GRAVITY, items);
setInterval(ScrollingArrayHorizontal, MOVEMENT_SPEED, environnement);
setInterval(ScrollingArrayHorizontal, MOVEMENT_SPEED, ennemies);
intervalScrollingVerticalArray.intervalEnvironnement = setInterval(ScrollingArrayVertical, KIRBY_GRAVITY, environnement);
intervalScrollingVerticalArray.intervalEnnemies = setInterval(ScrollingArrayVertical, KIRBY_GRAVITY, ennemies);
setInterval(ScrollingHorizontal, MOVEMENT_SPEED * 2, background);
intervalScrollingVerticalArray.intervalBackground = setInterval(ScrollingVertical, KIRBY_GRAVITY * 2, background);
setInterval(ScrollingHorizontal, MOVEMENT_SPEED * 1.5, foreground);
setInterval(ScrollingHorizontal, MOVEMENT_SPEED * 1.75, secondground);
setInterval(ScrollingHorizontal, MOVEMENT_SPEED * 1.90, thirdground);
setInterval(ScrollingHorizontal, MOVEMENT_SPEED, dededeDoor);
setInterval(ScrollingHorizontal, MOVEMENT_SPEED, controls);
intervalScrollingVerticalArray.intervalForeground = setInterval(ScrollingVertical, KIRBY_GRAVITY, foreground);
intervalScrollingVerticalArray.intervalSecondground = setInterval(ScrollingVertical, KIRBY_GRAVITY, secondground);
intervalScrollingVerticalArray.intervalThirdground = setInterval(ScrollingVertical, KIRBY_GRAVITY, thirdground);
setInterval(ScrollingVertical, KIRBY_GRAVITY, dededeDoor);
setInterval(ScrollingVertical, KIRBY_GRAVITY, controls);
