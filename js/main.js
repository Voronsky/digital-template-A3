'use strict';

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update});

var player;
var ground;
var platform;
var background;
var keys = Phaser.Keyboard;
var jump;
var map; // Map from the Tiled editor
var layer; //Layers from the maptiles

function preload() {
    game.load.image('darkbg','assets/background_by_sapphireitrenore.png');
    game.load.image('ground','assets/platform_black.png');
    game.load.audio('music',['assets/audio/Bonobo-Stay_The_Same_(Instrumental).mp3']);
    game.load.audio('jump',['assets/audio/mario_jump.mp3']);
    game.load.spritesheet('dude','assets/dude.png',32,48);

}

function create() {
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //background = game.add.tileSprite(0,0,1037,720,'darkbg');
    game.world.setBounds(0,0,1037,720);
    background = game.add.tileSprite(0, 0, game.world.width, game.cache.getImage('darkbg').height,'darkbg');
    var music = game.add.audio('music');
    music.volume = 0.3;
    music.loop = true;
    music.play();
    jump = game.add.audio('jump');
    
  
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
	background.tilePosition.x -= 1;
    }
    else if(game.input.keyboard.isDown(keys.LEFT))
    {
	player.body.velocity.x = -175;
	player.animations.play('left');
	background.tilePosition.x += 1;
    }
    else
    {
	player.animations.stop();
	player.frame = 4;
//	background.tilePosition.x = 0;
    }
    
    //Jumping
    if(game.input.keyboard.isDown(keys.UP) && player.body.touching.down)
    {
	jump.volume = 0.4;
	jump.play();
	player.body.velocity.y = -425;
    }
}
