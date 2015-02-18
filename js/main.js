'use strict';

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update});

var player;
var ground;
var platform;
var background;
var keys = Phaser.Keyboard;
var map; // Map from the Tiled editor
var layer; //Layers from the maptiles

function preload() {
    game.load.image('darkbg','assets/background_by_sapphireitrenore.png');
    game.load.image('ground','assets/platform_black.png');
    game.load.spritesheet('dude','assets/dude.png',32,48);

}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    background = game.add.tileSprite(0,0,1037,720,'darkbg');
    
  
    //Enabling physics on ground and spawning them
    platform = game.add.group();
    platform.enableBody = true;
    ground = platform.create(0, game.world.height - 10,'ground');
    ground.scale.setTo(9,5);
    ground.body.immovable = true;

    //making the player
    player = game.add.sprite(32,game.world.height - 150,'dude');
    game.physics.arcade.enable(player);
    player.animations.add('left',[0,1,2,3],10,true);
    player.animations.add('right',[5,6,7,8],10,true);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;
    

    game.camera.follow(player);
    
}

function update() {
    game.physics.arcade.collide(player, platform);
    //game.physics.arcade.collide(player, layer);
    
    player.body.velocity.x = 0;
    if(game.input.keyboard.isDown(keys.RIGHT))
    {
	player.body.velocity.x = 175;
	player.animations.play('right');
    }
    else if(game.input.keyboard.isDown(keys.LEFT))
    {
	player.body.velocity.x = -175;
	player.animations.play('left');
    }
    else
    {
	player.animations.stop();
	player.frame = 4;
    }
    
    //Jumping
    if(game.input.keyboard.isDown(keys.UP) && player.body.touching.down)
    {
	player.body.velocity.y = -425;
    }
}
