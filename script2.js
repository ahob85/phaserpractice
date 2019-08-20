const Phaser = require("phaser");

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

let game = new Phaser.Game(config);
let platforms;
let player;
let cursors;
let gameOver = false;

function preload () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.spritesheet('ninja idle',
      'assets/Free Swordsman Character/Animations/Idle/Idle - Sprite Sheet.png',
      { frameWidth: 537, frameHeight: 531 }
  );
  this.load.spritesheet('ninja run',
      'assets/Free Swordsman Character/Animations/Run/Run - Sprite Sheet.png',
      { frameWidth: 540, frameHeight: 579 }
  );
}

function create() {
  // Create the background and platforms
  this.add.image(400, 300, 'sky');
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
  // Create the player
  player = this.physics.add.sprite(100, 9, 'ninja idle').setScale(0.25);
  player.body.setGravityY(300);
  player.setCollideWorldBounds(true);
  //createPlayerAnimations();
  this.anims.create(
  {
    key: 'idle',
    frames: this.anims.generateFrameNumbers('ninja idle', { start: 0, end: 11 }),
    frameRate: 15,
    repeat: -1
  });
  // Create collision physics between player and platforms
  this.physics.add.collider(player, platforms);
  // Create keyboard controls
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  // Poll keyboard controls
  if (cursors.left.isDown) {
    player.sprite.flipX;
    player.setVelocityX(-160);
    player.anims.play('run', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('idle', true);
  }
}

function createPlayerAnimations() {
  this.anims.create(
  {
    key: 'idle',
    frames: this.anims.generateFrameNumbers('ninja idle', { start: 0, end: 11 }),
    frameRate: 15,
    repeat: -1
  },
  {
    key: 'run',
    frames: this.anims.generateFrameNumbers('ninja run', { star: 0, end: 12 }),
    frameRate: 15,
    repeat: -1
  });
}
