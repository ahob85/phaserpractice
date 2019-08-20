var config = {
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

var game = new Phaser.Game(config);
var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var bombs;
var gameOver = false;

function preload () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude',
      'assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
  );
}

function create () {
  // Create the background and platforms
  this.add.image(400, 300, 'sky');
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
  // Create the player
  player = this.physics.add.sprite(100, 450, 'dude');
  player.body.setGravityY(300);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
  // Create collision physics between player and platforms
  this.physics.add.collider(player, platforms);
  // Create collectable stars
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });
  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });
  // Create bouncing bomb enemies
  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  var hitBomb = function(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
  };
  this.physics.add.collider(player, bombs, hitBomb, null, this);
  // Create collision physics between stars and platforms
  this.physics.add.collider(stars, platforms);
  // Create overlap physics between stars and player
  var collectStar = function(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) :
                                 Phaser.Math.Between(0, 400);
      var bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  };
  this.physics.add.overlap(player, stars, collectStar, null, this);
  // Create keyboard controls
  cursors = this.input.keyboard.createCursorKeys();
  // Create score text object
  scoreText = this.add.text(16, 16, 'Score: 0',
  {
    fontsize: '32',
    fill: '#000'
  });

}

function update () {
  // Poll keyboard controls
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-530);
  }
}
