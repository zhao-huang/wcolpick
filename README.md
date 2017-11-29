# Colpick RemiX
Photoshop-like jQuery Color Picker plugin with various skins and layouts, touch, and responsive. <br>

# IMPORTANT
<b> This is still a beta version, and may contain bugs! </b>

### Changes from Beta 2 to Beta 3
1. Alpha channel support: Completed!
2. Now is possible to cancel destruction of color picker by calling "cancelDestroy" function.
3. Renamed getCurrentColpickColor in getColpickColor: now it can returns also the new color, and is possible to request also "rgb" and "hex" colors.
4. Replaced parseInt with Math.round, where it was possible, to improve performance (see this: https://jsperf.com/math-floor-vs-math-round-vs-parseint/55).
5. [FIX] Now, internally, the code works only with alpha values between 0 and 1.
6. [FIX] Fixed 2 bugs that allowed to set an alpha value, though alpha was disabled.
7. Cleanup and other various bugfix.


### Screenshot of "Beta version"
![beta2](https://user-images.githubusercontent.com/32025549/33090850-a8b8208a-cef5-11e7-8e8c-c1b7565d049b.png)

You can try the beta version here: <a href="https://colpick-remix-beta.herokuapp.com/">https://colpick-remix-beta.herokuapp.com</a> <br><br>


### Latest stable release
Download link: <a href="https://github.com/firestormxyz/colpick-remix/releases/latest">https://github.com/firestormxyz/colpick-remix/releases/latest</a> <br><br>

### Requirements
This plugin requires jQuery 1.7.0 or later. <br>
Last version of jQuery (if you need it): <a href="https://code.jquery.com/jquery-3.2.1.min.js">https://code.jquery.com/jquery-3.2.1.min.js</a> <br><br><br>


### License
Copyright (C) 2017 Salvatore Peluso <br>
Dual licensed under GPL v3.0 and MIT licenses. <br>
(Based on Jose Vargas' Color Picker)
