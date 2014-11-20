zap
===

A 1v1 speed and coordination game for Arduino.

![Zap](https://raw.githubusercontent.com/ruiramos/zap/master/zap.jpg)

Two players compete in a board of 2 x 3 leds using a button each. The objective is to press the button when (at least) two leds on the same position light up. The rounds get harder and, in the end, the winning player is revealed by the blinking leds and a wonderful song. All great fun!

One day I'll actually include the actual schematics for this to work in your Arduino, should you be interested. Anyway it's not hard to get from the source code!

It uses [Johnny Five](https://github.com/rwaldron/johnny-five) , a Firmata based framework, to communicate with the Arduino. Also loadash and traceur because.

# Installing, running...
0. Upload the StandardFirmata firmware to your Arduino
1. npm install
2. traceur --out zap.js --script es6-zap.js
3. node zap.js
4. Enjoy
