var j5 = require('johnny-five'),
    _ = require('lodash');
var board = new j5.Board();
var greenLeds = [11, 12, 13];
var greenButton = 8;
var redLeds = [5, 6, 7];
var redButton = 9;
var piezoPos = 3;
var game = {};
var maxLevel = 2;
var blinkInterval = 600;
var greenScore = 0;
var redScore = 0;
var gameStarted = false;
board.on("ready", function() {
  game.green = greenLeds.map((function(l) {
    return new j5.Led(l);
  }));
  game.bg = new j5.Button(greenButton);
  game.red = redLeds.map((function(l) {
    return new j5.Led(l);
  }));
  game.br = new j5.Button(redButton);
  game.piezo = new j5.Piezo(piezoPos);
  game.temp = {};
  game.bg.on('hit', function() {
    if (!gameStarted)
      return;
    if (checkMatchingLights()) {
      greenScore++;
    } else {
      greenScore -= 2;
    }
  });
  game.br.on('hit', function() {
    if (!gameStarted)
      return;
    if (checkMatchingLights()) {
      redScore++;
    } else {
      redScore -= 2;
    }
  });
  initGame();
});
function initGame() {
  greenScore = 0;
  redScore = 0;
  blinkAll(game.green);
  blinkAll(game.red);
  playStartSong();
  board.wait(3500, function() {
    game.green.map((function(l) {
      return l.stop();
    }));
    game.red.map((function(l) {
      return l.stop();
    }));
    startGame();
  });
}
function startGame() {
  var level = 0;
  gameStarted = true;
  var gameInterval = setInterval(function() {
    lightsOff(game.green, game.red);
    if (level > maxLevel) {
      clearInterval(gameInterval);
      return showWinner();
    }
    var toLightGreen = sample(game.green, 1 + Math.round(Math.random() * level));
    var toLightRed = sample(game.red, 1 + Math.round(Math.random() * level));
    game.temp.green = toLightGreen.indexes;
    game.temp.red = toLightRed.indexes;
    lightsOn(toLightGreen.sample, toLightRed.sample);
    beep();
    level += 0.05;
  }, blinkInterval);
}
function showWinner() {
  lightsOff(game.green, game.red);
  gameStarted = false;
  console.log('GAME OVER. Red:', redScore, 'Green:', greenScore);
  playWinnerSong();
  if (redScore > greenScore) {
    blinkAll(game.red);
  } else if (greenScore > redScore) {
    blinkAll(game.green);
  } else {
    blinkAll(game.green);
    blinkAll(game.red);
  }
  board.wait(8000, function() {
    lightsOff(game.green, game.red);
    initGame();
  });
}
function playStartSong() {
  game.piezo.noTone();
  game.piezo.play({
    tempo: 200,
    song: [["g5", 1], [null, 1], ["c4", 1], [null, 1], ["c5", 1], [null, 1], ["c4", 1], [null, 1], ["c6", 2], [null, 1]]
  });
}
function beep() {
  game.piezo.noTone();
  game.piezo.frequency(523, 300);
}
function playWinnerSong() {
  game.piezo.noTone();
  game.piezo.play({
    tempo: 200,
    song: [["c6", 1], [null, 1], ["c5", 1], [null, 1], ["c4", 1], [null, 1], ["g4", 1], [null, 1], ["g5", 2], [null, 1]]
  });
}
function checkMatchingLights() {
  return _.intersection(game.temp.green, game.temp.red).length;
}
function sample(array, numElements) {
  var ret = {
    sample: [],
    indexes: []
  },
      arraySize = array.length;
  for (var i = 0; i < numElements; i++) {
    var pos = Math.floor(Math.random() * arraySize);
    ret.sample.push(array[pos]);
    ret.indexes.push(pos);
  }
  return ret;
}
function lightsOn() {
  for (var arrays = [],
      $__0 = 0; $__0 < arguments.length; $__0++)
    arrays[$__0] = arguments[$__0];
  arrays.forEach(function(array) {
    array = _.isArray(array) ? array : [array];
    array.forEach((function(led) {
      return led.on();
    }));
  });
}
function lightsOff() {
  for (var arrays = [],
      $__1 = 0; $__1 < arguments.length; $__1++)
    arrays[$__1] = arguments[$__1];
  arrays.forEach(function(array) {
    array = _.isArray(array) ? array : [array];
    array.forEach((function(led) {
      return led.off();
    }));
  });
}
function blinkAll(array, ms) {
  array = _.isArray(array) ? array : [array];
  array.forEach((function(led) {
    return led.blink(ms || 500);
  }));
}
