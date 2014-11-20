/* jshint esnext: true */
var j5 = require('johnny-five'),
    _  = require('lodash');

var board = new j5.Board();

var greenLeds = [11, 12, 13];
var greenButton = 8;

var redLeds = [5, 6 ,7];
var redButton = 9;

var piezoPos = 3;

var game = {};
var maxLevel = 2; // 2 * 0.05 = 40 stages
var blinkInterval = 600; // ms between led flashing

var greenScore = 0;
var redScore = 0;

var gameStarted = false;

board.on("ready", function(){
  game.green = greenLeds.map(l => new j5.Led(l));
  game.bg = new j5.Button(greenButton);

  game.red = redLeds.map(l => new j5.Led(l));
  game.br = new j5.Button(redButton);

  game.piezo = new j5.Piezo(piezoPos);

  game.temp = {};

  game.bg.on('hit', function(){
    if(!gameStarted) return;
    if(checkMatchingLights()){
      greenScore++;
    } else {
      greenScore-=2;
    }
  });

  game.br.on('hit', function(){
    if(!gameStarted) return;
    if(checkMatchingLights()) {
      redScore++;
    } else {
      redScore-=2;
    }
  });

  // start game
  initGame();

});

function initGame(){
  greenScore = 0;
  redScore = 0;

  blinkAll(game.green);
  blinkAll(game.red);

  playStartSong();

  board.wait(3500, function(){
    game.green.map(l => l.stop());
    game.red.map(l => l.stop());
    startGame();
  });
}

function startGame(){
  var level = 0;
  gameStarted = true;

  var gameInterval = setInterval(function() {
    lightsOff(game.green, game.red);

    if(level > maxLevel){
      clearInterval(gameInterval);
      return showWinner();
    }

    // sample the array. as the game progresses, it's more likely that 2 leds will light
    var toLightGreen = sample(game.green, 1 + Math.round(Math.random() * level));
    var toLightRed = sample(game.red, 1 + Math.round(Math.random() * level));

    // saving the indexes of the leds to light
    game.temp.green = toLightGreen.indexes;
    game.temp.red = toLightRed.indexes;

    // sample array contains the leds objects
    lightsOn(toLightGreen.sample, toLightRed.sample);
    beep();

    level += 0.05;

  }, blinkInterval);
}

function showWinner(){
  lightsOff(game.green, game.red);
  gameStarted = false;
  console.log('GAME OVER. Red:', redScore, 'Green:', greenScore);

  playWinnerSong();

  if(redScore > greenScore){
    blinkAll(game.red);
  } else if(greenScore > redScore){
    blinkAll(game.green);
  } else {
    blinkAll(game.green);
    blinkAll(game.red);
  }

  board.wait(8000, function(){
    lightsOff(game.green, game.red);
    initGame();
  });

}

// Sound --------
function playStartSong(){
  game.piezo.noTone();
  game.piezo.play({
    tempo: 200,
    song: [
      [ "g5", 1 ],
      [ null, 1 ],
      [ "c4", 1 ],
      [ null, 1 ],
      [ "c5", 1 ],
      [ null, 1 ],
      [ "c4", 1 ],
      [ null, 1 ],
      [ "c6", 2 ],
      [ null, 1 ]
    ]
  });
}

function beep(){
  game.piezo.noTone();
  game.piezo.frequency(523, 250);
}

function playWinnerSong(){
  game.piezo.noTone();
  game.piezo.play({
    tempo: 200,
    song: [
      [ "c6", 1 ],
      [ null, 1 ],
      [ "c5", 1 ],
      [ null, 1 ],
      [ "c4", 1 ],
      [ null, 1 ],
      [ "g4", 1 ],
      [ null, 1 ],
      [ "c6", 2 ],
      [ null, 1 ]
    ]
  });
}

// Utils -------

function checkMatchingLights(){
  return _.intersection(game.temp.green, game.temp.red).length;
}

/**
  Sample will retrieve `numElements` elements out of an `array`, randomly.
  Will return not only the elements but also its indexes.

  @returns Object {sample: [element1, element5], indexes:[1, 5]}
**/
function sample(array, numElements){
  var ret = {
    sample: [],
    indexes: []
  },
    arraySize = array.length;

  for (var i = 0; i < numElements; i++) {
    var pos;
    do {
      pos = Math.floor(Math.random() * arraySize);
    } while(ret.indexes.indexOf(pos) !== -1);

    ret.sample.push(array[pos]);
    ret.indexes.push(pos);
  }

  return ret;
}

function lightsOn(...arrays){
  arrays.forEach(function(array){
    array = _.isArray(array) ? array : [array];
    array.forEach(led => led.on());
  });
}

function lightsOff(...arrays){
  arrays.forEach(function(array){
    array = _.isArray(array) ? array : [array];
    array.forEach(led => led.off());
  });
}

function blinkAll(array, ms){
  array = _.isArray(array) ? array : [array];
  array.forEach(led => led.blink(ms || 500));
}