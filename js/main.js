'use strict';

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update});

var player;
var ground;
var percentDone = 0;
var platform;
var enemies;
var flowers;
var grudgeBar;
var background;
var keys = Phaser.Keyboard;
var jump;
var map; // Map from the Tiled editor
var layer; //Layers from the maptiles
var scoreText;

function preload() {
    game.load.image('darkbg','assets/background_by_sapphireitrenore.png');
    game.load.image('grudgeBar','assets/grudge_bar.png');
    game.load.image('ground','assets/platform_black.png');
    game.load.image('flower','assets/flower.png');
    game.load.audio('music',['assets/audio/Bonobo-Stay_The_Same_(Instrumental).mp3']);
    game.load.audio('jump',['assets/audio/mario_jump.mp3']);
    game.load.spritesheet('dude','assets/dude.png',32,48);
    game.load.spritesheet('enemy','assets/baddie.png',32,32);
    game.load.tilemap('map','assets/world.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tiles/tiles3.png');

}

function create() {
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //background = game.add.tileSprite(0,0,1037,720,'darkbg');
    game.world.setBounds(0,0,5404,920);
    background = game.add.tileSprite(0, 0, game.world.width, game.cache.getImage('darkbg').height,'darkbg');
    map = game.add.tilemap('map');
    map.addTilesetImage('tiles3','tiles');
    layer = map.createLayer('foreground');

    map.setCollisionBetween(0,200);

    var music = game.add.audio('music');
    music.volume = 0.3;
    music.loop = true;
    music.play();
    jump = game.add.audio('jump');
    
  
    //Enabling physics on ground and spawning them
    platform = game.add.group();
    platform.enableBody = true;
    ground = platform.create(0, game.world.height - 10,'ground');
    ground.scale.setTo(15,5);
    ground.body.immovable = true;

    //Enemy group creation
    enemies = game.add.group();
    createEnemy();
    
    //Spawning flowers
    flowers = game.add.group();
    flowers.enableBody = true;
    createFlower();
    //making the player
    player = game.add.sprite(32,game.world.height - 150,'dude');
    game.physics.arcade.enable(player);
    player.animations.add('left',[0,1,2,3],10,true);
    player.animations.add('right',[5,6,7,8],10,true);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;
    

    game.camera.follow(player);
    
    //ENemy movements
    game.time.events.loop(Phaser.Timer.SECOND, enemyMove, this);
    scoreText = game.add.text(0,0,'Grudge: ', {fontSize: '32px', fill: '#ffff'});
    scoreText.fixedToCamera = true;
    grudgeBar = game.add.image(100,1,'grudgeBar');
    grudgeBar.fixedToCamera = true;
    grudgeBar.width = 177;
    //grudgeBar.initialWidth = 177; //Original pixel image width
   
}

function update() {

    game.physics.arcade.collide(player, platform);
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(enemies, platform);
    game.physics.arcade.collide(enemies, layer);
    game.physics.arcade.collide(flowers, layer, collisionHandler,null,this);
    game.physics.arcade.collide(player, flowers, collectFlower,null,this);
    game.physics.arcade.collide(player, enemies, enemyAttack, null, this);
    changeWorld(grudgeBar.width, enemies);

    player.body.velocity.x = 0;

    //grudgeBar.width = percentDone*grudgeBar.initialWidth;
    //percentDone+=0.01;
     var xMove = getSpeed(grudgeBar.width);
    //playerMove(grudgeBar);
    if(game.input.keyboard.isDown(keys.RIGHT))
    {
	player.body.velocity.x = xMove;
	player.animations.play('right');
	background.tilePosition.x -= 0.20;
    }
    else if(game.input.keyboard.isDown(keys.LEFT))
    {
	player.body.velocity.x = -(xMove);
	player.animations.play('left');
	background.tilePosition.x += 0.20;
    }
    else
    {
	player.animations.stop();
	player.frame = 4;
//	background.tilePosition.x = 0;
    }
    
    //Jumping
    if(game.input.keyboard.isDown(keys.UP))
    {
	jump.volume = 0.4;
	jump.play();
	player.body.velocity.y = -375;
    }

    

    /*if(game.input.keyboard.isDown(keys.RIGHT))
    {
	player.body.velocity.x = 175;
	player.animations.play('right');
	background.tilePosition.x -= 0.20;
    }
    else if(game.input.keyboard.isDown(keys.LEFT))
    {
	player.body.velocity.x = -175;
	player.animations.play('left');
	background.tilePosition.x += 0.20;
    }
    else
    {
	player.animations.stop();
	player.frame = 4;
//	background.tilePosition.x = 0;
    }
    
    //Jumping
    if(game.input.keyboard.isDown(keys.UP))
    {
	jump.volume = 0.4;
	jump.play();
	player.body.velocity.y = -445;
    }*/
}

//Creates enemies
function createEnemy() {
   for (var i=0; i<15; i++) {
       var enemy = enemies.create(game.world.randomX, randomHeight(), 'enemy');
       game.physics.arcade.enable(enemy);
       enemy.body.gravity.y = 400;
       enemy.body.bounce.y = 0.2;
       enemy.animations.add('left',[0,1], 10, true);
       enemy.animations.add('right',[2,3],10,true);
       enemy.body.collideWorldBounds = true;
   }
}

//Adds movements for the enemies
function enemyMove() {
    enemies.forEach(function(enemy) {

	var x = Math.round(Math.random());
	if(x == 1)
	{
	    /*if(enemy.body.touching.down)
	    {
		enemy.body.velocity.y = -400;
	    }*/
	    enemy.animations.play('left');
	    enemy.body.velocity.x = -100;
	
	}
	if(x == 0)
	{
	    /*if(enemy.body.touching.down)
	    {
		enemy.body.velocity.y = -400;
	    }*/
	    enemy.animations.play('right');
	    enemy.body.velocity.x = 100;
	}
    }, this);
}

//Creates flowers
function createFlower() {
    for(var i = 0; i<30; i++) {
	flowers.create(game.rnd.integerInRange(100,5000), game.rnd.integerInRange(300,600), 'flower');
	
    }
}
function playerMove(grudgeBar) {
    
    var xMove = getSpeed(grudgeBar);
    if(game.input.keyboard.isDown(keys.RIGHT))
    {
	player.body.velocity.x = xMove;
	player.animations.play('right');
	background.tilePosition.x -= 0.20;
    }
    else if(game.input.keyboard.isDown(keys.LEFT))
    {
	player.body.velocity.x = -(xMove);
	player.animations.play('left');
	background.tilePosition.x += 0.20;
    }
    else
    {
	player.animations.stop();
	player.frame = 4;
//	background.tilePosition.x = 0;
    }
    
    //Jumping
    if(game.input.keyboard.isDown(keys.UP))
    {
	jump.volume = 0.4;
	jump.play();
	player.body.velocity.y = -375;
    }

}

function getSpeed(x) {
    var moveVelocity = 0;
    if(x > Math.round(grudgeBar.width*0.7)) {
	return moveVelocity = 80;
	}
    if(x <= Math.round(grudgeBar.width*0.6)) {
	return moveVelocity = 145;
    }
    if(x <= 0) {

	return moveVelocity = 215;
    }
}
function collisionHandler(flowers){
    flower.kill();
    flower.reset(game.rnd.integerInRange(100,5000), game.rnd.integerInRanger(300,650));
}

//Collects the flowers
function collectFlower(player, flowers) {
    flowers.kill();
    percentDone += 0.1;
    var grudgeOrigWidth = 177;
    if(grudgeBar.width > 0) 
    {
	grudgeBar.width -=10;
//	grudgeBar.width = parseInt(grudgeOrigWidth - (percentDone*grudgeOrigWidth));
    }else {
	grudgeBar.visible = false;
	}
    /*`if(grudgeBar.width <= 0) {
	grudgeBar.width = 0;
	//grudgeBar.width = 0;
	//percentDone = 0;
	//changeWorld();
    } */
    //return grudgeBar.width;
    

}

function changeWorld(grudgeBar, enemies) {
    if(Math.round(grudgeBar.width) <= 0) {
	enemies.destroy(true);
    }
}
function enemyAttack(player, enemies) {
    var grudgeOrigWidth = 177;
    if ( grudgeBar.width < grudgeOrigWidth)
    {
	
	//player.body.velocity.x = -400;
	grudgeBar.width += 10;
	//grudgeBar.width += parseInt(0.1*grudgeOrigWidth);
    }
    if(player.body.touching.left) {
	player.body.center.x = 100;
    }
    if (player.body.touching.right) {
	player.body.center.x = -100;
    }
    if (player.body.touching.down) {
	player.body.velocity.y = -300;
	player.body.velocity.x = -300;
    }
    //return grudgeBar.width;
    
}

//generates a random y in the value greater than the floor
function randomHeight() {
    var width = 800;
    return Math.random()*(width - (game.world.height - 150) + 150);
}
