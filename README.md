zap
===

A 1v1 speed and coordination game for Arduino.

Two players compete in a board of 2 x 3 leds using a button each. The objective is to press the button when (at least) two leds on the same position light up. The rounds get harder and, in the end, the winning player is revealed by the blinking leds and a wonderful song. All great fun!

One day I'll actually include the actual schematics for this to work in your Arduino, should you be interested. Anyway it's not hard to get from the source code!

It uses [https://github.com/rwaldron/johnny-five](Johnny Five), a Firmata based framework, to communicate with the Arduino. Also loadash and traceur because.

# Installing, running...
0. Upload the StandardFirmata firmware to your Arduino
1. npm install
2. traceur --out game.js --script es6-index.js
3. node game.js
4. Enjoy