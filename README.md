# Colpick RemiX
Photoshop-like jQuery Color Picker plugin with various skins and layouts, touch, and responsive. <br>

# IMPORTANT
<b> This is still a beta version, and may contain bugs! </b>

### Changes from Beta 3 to Beta 4
1. Merged all parameters of all "callback functions" (onLoaded, onBeforeShow, etc...) in a single object. 
(IMPORTANT: With this change is necessary to change the way to obtain the single parameters from this functions, I will explain later how to do).
2. Now you can abort onDestroy by simply return false.
3. Removed cancelDestroy function.
4. [FIX] Setted default return values for getColor function.
5. Cleanup and bugfix.


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
