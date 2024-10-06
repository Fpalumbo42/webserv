const background = {
   element: document.getElementById("background_dedede"),
   style: document.getElementById("background_dedede").style,

   left: 0,
   top: 0,
   width: ParseInt(document.getElementById("background_dedede"), "width")
};

var blocks = [];
var foreground;
var dedede = new Dedede(260, 152);
var ennemies = [dedede];
var dedede_door;
var inhalable_stars = [];

var ground = document.getElementById("ground");
var wallLeft = document.getElementById("wall_left");
var wallRight = document.getElementById("wall_right");
var environnement = [ground, wallLeft, wallRight];

const kirby = new Kirby(210, 164, false);
