/*
Colpick REMIX - Color Picker

Copyright (C) 2017 Salvatore Peluso (Firestorm): fire-space.weebly.com
Dual licensed under GPL v3.0 and MIT licenses.

Based on Jose Vargas' Color Picker (https://github.com/josedvq/colpick-jQuery-Color-Picker) licensed under GPL and MIT license.

Description, how to use, and examples: fire-space.weebly.com/colpick-remix

Last Edit: 2017/10/06 22:07
*/



(function ($) {
	var colpickRmx = function () {
		var
			tpl = '<div class="colpickRmx"><div class="colpickRmx_color"><div class="colpickRmx_color_overlay1"><div class="colpickRmx_color_overlay2"><div class="colpickRmx_selector_outer"><div class="colpickRmx_selector_inner"></div></div></div></div></div><div class="colpickRmx_hue"><div class="colpickRmx_hue_arrs"><div class="colpickRmx_hue_larr"></div><div class="colpickRmx_hue_rarr"></div></div></div><div class="colpickRmx_new_color"></div><div class="colpickRmx_current_color"></div><div class="colpickRmx_hex_field"><div class="colpickRmx_field_letter">#</div><input type="text" maxlength="6" size="6" /></div><div class="colpickRmx_rgb_r colpickRmx_field"><div class="colpickRmx_field_letter">R</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_rgb_g colpickRmx_field"><div class="colpickRmx_field_letter">G</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_rgb_b colpickRmx_field"><div class="colpickRmx_field_letter">B</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_hsb_h colpickRmx_field"><div class="colpickRmx_field_letter">H</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_hsb_s colpickRmx_field"><div class="colpickRmx_field_letter">S</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_hsb_b colpickRmx_field"><div class="colpickRmx_field_letter">B</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_submit"></div></div>',
			defaults = {
				flat: true, //If is "true", the color picker is displayed regardless.
				showEvent: 'click', //The event that shows the color picker (if flat is set to "true", this property is useless).
				variant: 'standard', //There are 3 variants: standard, small, extra-large.
				layout: 'full', //There are 3 types of layouts: full, rgbhex, hex.
				submit: true, //The 3 layouts have 2 sub-layouts for each: with submit button or without.
				submitText: 'OK', //Text of the submit button.
				colorScheme: 'light--full', //There are 4 types of color schemes: light, dark, light--full, dark--full.
				lightArrows: false, //ONLY FOR LIGHT COLOR SCHEME! Set the hue's arrows color to a light color (ex. white).
				color: '222222', //Default Selected Color: Visible in almost all themes.
				livePreview: true, //If is "true", the color is updated immediately when changing a parameter.
				polyfill: false, //If true, the color picker is only activated when no native browser behavior is available.
				onLoaded: function() {},
				onBeforeShow: function() {},
				onShow: function () {},
				onHide: function () {},
				onDestroy: function () {},
				onChange: function () {},
				onSubmit: function () {},

				//VALUES BELOW, ARE DEPENDING FROM CSS (DON'T CHANGE IT WITHOUT CHANGING CSS VALUES)
				height: 225, //Standard Version!
				sHeight: 150, //Small Version!
				xlHeight: 300 //Extra Large Version!
			},
			//Fill the inputs of the plugin
			fillRGBFields = function  (hsb, cal) {
				var rgb = hsbToRgb(hsb);
				$(cal).data('colpickRmx').fields
					.eq(1).val(rgb.r).end()
					.eq(2).val(rgb.g).end()
					.eq(3).val(rgb.b).end();
			},
			fillHSBFields = function  (hsb, cal) {
				$(cal).data('colpickRmx').fields
					.eq(4).val(Math.round(hsb.h)).end()
					.eq(5).val(Math.round(hsb.s)).end()
					.eq(6).val(Math.round(hsb.b)).end();
			},
			fillHexFields = function (hsb, cal) {
				$(cal).data('colpickRmx').fields.eq(0).val(hsbToHex(hsb));
			},
			//Set the round selector position
			setSelector = function (hsb, cal) {
				$(cal).data('colpickRmx').selector.css('backgroundColor', '#' + hsbToHex({h: hsb.h, s: 100, b: 100}));

				//Switching between the 3 variants
				switch ($(cal).data('colpickRmx').variant) {
					case 'small':
						$(cal).data('colpickRmx').selectorIndic.css({
							left: parseInt($(cal).data('colpickRmx').sHeight * hsb.s/100, 10),
							top: parseInt($(cal).data('colpickRmx').sHeight * (100-hsb.b)/100, 10)
						});
						break;
					case 'extra-large':
						$(cal).data('colpickRmx').selectorIndic.css({
							left: parseInt($(cal).data('colpickRmx').xlHeight * hsb.s/100, 10),
							top: parseInt($(cal).data('colpickRmx').xlHeight * (100-hsb.b)/100, 10)
						});
						break;
					default: //default -> standard
						$(cal).data('colpickRmx').selectorIndic.css({
							left: parseInt($(cal).data('colpickRmx').height * hsb.s/100, 10),
							top: parseInt($(cal).data('colpickRmx').height * (100-hsb.b)/100, 10)
						});
						break;
				}
			},
			//Set the hue selector position
			setHue = function (hsb, cal) {

				//Switching between the 3 variants
				switch ($(cal).data('colpickRmx').variant) {
					case 'small':
						$(cal).data('colpickRmx').hue.css('top', parseInt($(cal).data('colpickRmx').sHeight - $(cal).data('colpickRmx').sHeight * hsb.h/360, 10));
						break;
					case 'extra-large':
						$(cal).data('colpickRmx').hue.css('top', parseInt($(cal).data('colpickRmx').xlHeight - $(cal).data('colpickRmx').xlHeight * hsb.h/360, 10));
						break;
					default: //default -> standard
						$(cal).data('colpickRmx').hue.css('top', parseInt($(cal).data('colpickRmx').height - $(cal).data('colpickRmx').height * hsb.h/360, 10));
						break;
				}
			},
			//Set current and new colors
			setCurrentColor = function (hsb, cal) {
				$(cal).data('colpickRmx').currentColor.css('backgroundColor', '#' + hsbToHex(hsb));
			},
			setNewColor = function (hsb, cal) {
				$(cal).data('colpickRmx').newColor.css('backgroundColor', '#' + hsbToHex(hsb));
			},
			//Called when the new color is changed
			change = function (ev) {
				var cal = $(this).parent().parent(), col;
				if (this.parentNode.className.indexOf('_hex') > 0) {
					cal.data('colpickRmx').color = col = hexToHsb(fixHex(this.value));
					fillRGBFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
				} else if (this.parentNode.className.indexOf('_hsb') > 0) {
					cal.data('colpickRmx').color = col = fixHSB({
						h: parseInt(cal.data('colpickRmx').fields.eq(4).val(), 10),
						s: parseInt(cal.data('colpickRmx').fields.eq(5).val(), 10),
						b: parseInt(cal.data('colpickRmx').fields.eq(6).val(), 10)
					});
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
				} else {
					cal.data('colpickRmx').color = col = rgbToHsb(fixRGB({
						r: parseInt(cal.data('colpickRmx').fields.eq(1).val(), 10),
						g: parseInt(cal.data('colpickRmx').fields.eq(2).val(), 10),
						b: parseInt(cal.data('colpickRmx').fields.eq(3).val(), 10)
					}));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
				}
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
				cal.data('colpickRmx').onChange.apply(cal.parent(), [col, hsbToHex(col), hsbToRgb(col), cal.data('colpickRmx').el, 0]);
			},
			//Change style on blur and on focus of inputs
			blur = function (ev) {
				$(this).parent().removeClass('colpickRmx_focus');
			},
			focus = function () {
				$(this).parent().parent().data('colpickRmx').fields.parent().removeClass('colpickRmx_focus');
				$(this).parent().addClass('colpickRmx_focus');
			},
			//Increment/decrement arrows functions
			downIncrement = function (ev) {
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var field = $(this).parent().find('input').focus();
				var current = {
					el: $(this).parent().addClass('colpickRmx_slider'),
					max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
					y: ev.pageY,
					field: field,
					val: parseInt(field.val(), 10),
					preview: $(this).parent().parent().data('colpickRmx').livePreview
				};
				$(document).mouseup(current, upIncrement);
				$(document).mousemove(current, moveIncrement);
			},
			moveIncrement = function (ev) {
				ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val - ev.pageY + ev.data.y, 10))));
				if (ev.data.preview) {
					change.apply(ev.data.field.get(0), [true]);
				}
				return false;
			},
			upIncrement = function (ev) {
				change.apply(ev.data.field.get(0), [true]);
				ev.data.el.removeClass('colpickRmx_slider').find('input').focus();
				$(document).off('mouseup', upIncrement);
				$(document).off('mousemove', moveIncrement);
				return false;
			},
			//Hue slider functions
			downHue = function (ev) {
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var current = {
					cal: $(this).parent(),
					y: $(this).offset().top
				};
				$(document).on('mouseup touchend',current,upHue);
				$(document).on('mousemove touchmove',current,moveHue);

				var pageY = ((ev.type == 'touchstart') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY );

				//Switching between the 3 variants
				switch (current.cal.data('colpickRmx').variant) {
					case 'small':
						change.apply(
							current.cal.data('colpickRmx')
							.fields.eq(4).val(parseInt(360*(current.cal.data('colpickRmx').sHeight - (pageY - current.y))/current.cal.data('colpickRmx').sHeight, 10))
								.get(0),
							[current.cal.data('colpickRmx').livePreview]
						);
						break;
					case 'extra-large':
						change.apply(
							current.cal.data('colpickRmx')
							.fields.eq(4).val(parseInt(360*(current.cal.data('colpickRmx').xlHeight - (pageY - current.y))/current.cal.data('colpickRmx').xlHeight, 10))
								.get(0),
							[current.cal.data('colpickRmx').livePreview]
						);
						break;
					default: //default -> standard
						change.apply(
							current.cal.data('colpickRmx')
							.fields.eq(4).val(parseInt(360*(current.cal.data('colpickRmx').height - (pageY - current.y))/current.cal.data('colpickRmx').height, 10))
								.get(0),
							[current.cal.data('colpickRmx').livePreview]
						);
						break;
				}

				return false;
			},
			moveHue = function (ev) {
				var pageY = ((ev.type == 'touchmove') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY );

				//Switching between the 3 variants
				switch (ev.data.cal.data('colpickRmx').variant) {
					case 'small':
						change.apply(
							ev.data.cal.data('colpickRmx')
							.fields.eq(4).val(parseInt(360*(ev.data.cal.data('colpickRmx').sHeight - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').sHeight,(pageY - ev.data.y))))/ev.data.cal.data('colpickRmx').sHeight, 10))
								.get(0),
							[ev.data.preview]
						);
						break;
					case 'extra-large':
						change.apply(
							ev.data.cal.data('colpickRmx')
							.fields.eq(4).val(parseInt(360*(ev.data.cal.data('colpickRmx').xlHeight - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').xlHeight,(pageY - ev.data.y))))/ev.data.cal.data('colpickRmx').xlHeight, 10))
								.get(0),
							[ev.data.preview]
						);
						break;
					default: //default -> standard
						change.apply(
							ev.data.cal.data('colpickRmx')
							.fields.eq(4).val(parseInt(360*(ev.data.cal.data('colpickRmx').height - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').height,(pageY - ev.data.y))))/ev.data.cal.data('colpickRmx').height, 10))
								.get(0),
							[ev.data.preview]
						);
						break;
				}

				return false;
			},
			upHue = function (ev) {
				fillRGBFields(ev.data.cal.data('colpickRmx').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colpickRmx').color, ev.data.cal.get(0));
				$(document).off('mouseup touchend',upHue);
				$(document).off('mousemove touchmove',moveHue);
				return false;
			},
			//Color selector functions
			downSelector = function (ev) {
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset()
				};
				current.preview = current.cal.data('colpickRmx').livePreview;

				$(document).on('mouseup touchend',current,upSelector);
				$(document).on('mousemove touchmove',current,moveSelector);

				var pageX,pageY;
				if(ev.type == 'touchstart') {
					pageX = ev.originalEvent.changedTouches[0].pageX;
					pageY = ev.originalEvent.changedTouches[0].pageY;
				} else {
					pageX = ev.pageX;
					pageY = ev.pageY;
				}

				//Switching between the 3 variants
				switch (current.cal.data('colpickRmx').variant) {
					case 'small':
						change.apply(
							current.cal.data('colpickRmx').fields
							.eq(6).val(parseInt(100*(current.cal.data('colpickRmx').sHeight - (pageY - current.pos.top))/current.cal.data('colpickRmx').sHeight, 10)).end()
							.eq(5).val(parseInt(100*(pageX - current.pos.left)/current.cal.data('colpickRmx').sHeight, 10))
							.get(0),
							[current.preview]
						);
						break;
					case 'extra-large':
						change.apply(
							current.cal.data('colpickRmx').fields
							.eq(6).val(parseInt(100*(current.cal.data('colpickRmx').xlHeight - (pageY - current.pos.top))/current.cal.data('colpickRmx').xlHeight, 10)).end()
							.eq(5).val(parseInt(100*(pageX - current.pos.left)/current.cal.data('colpickRmx').xlHeight, 10))
							.get(0),
							[current.preview]
						);
						break;
					default: //default -> standard
						change.apply(
							current.cal.data('colpickRmx').fields
							.eq(6).val(parseInt(100*(current.cal.data('colpickRmx').height - (pageY - current.pos.top))/current.cal.data('colpickRmx').height, 10)).end()
							.eq(5).val(parseInt(100*(pageX - current.pos.left)/current.cal.data('colpickRmx').height, 10))
							.get(0),
							[current.preview]
						);
						break;
				}

				return false;
			},
			moveSelector = function (ev) {
				var pageX,pageY;
				if(ev.type == 'touchmove') {
					pageX = ev.originalEvent.changedTouches[0].pageX;
					pageY = ev.originalEvent.changedTouches[0].pageY;
				} else {
					pageX = ev.pageX;
					pageY = ev.pageY;
				}

				//Switching between the 3 variants
				switch (ev.data.cal.data('colpickRmx').variant) {
					case 'small':
						change.apply(
							ev.data.cal.data('colpickRmx').fields
							.eq(6).val(parseInt(100*(ev.data.cal.data('colpickRmx').sHeight - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').sHeight,(pageY - ev.data.pos.top))))/ev.data.cal.data('colpickRmx').sHeight, 10)).end()
							.eq(5).val(parseInt(100*(Math.max(0,Math.min(ev.data.cal.data('colpickRmx').sHeight,(pageX - ev.data.pos.left))))/ev.data.cal.data('colpickRmx').sHeight, 10))
							.get(0),
							[ev.data.preview]
						);
						break;
					case 'extra-large':
						change.apply(
							ev.data.cal.data('colpickRmx').fields
							.eq(6).val(parseInt(100*(ev.data.cal.data('colpickRmx').xlHeight - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').xlHeight,(pageY - ev.data.pos.top))))/ev.data.cal.data('colpickRmx').xlHeight, 10)).end()
							.eq(5).val(parseInt(100*(Math.max(0,Math.min(ev.data.cal.data('colpickRmx').xlHeight,(pageX - ev.data.pos.left))))/ev.data.cal.data('colpickRmx').xlHeight, 10))
							.get(0),
							[ev.data.preview]
						);
						break;
					default: //default -> standard
						change.apply(
							ev.data.cal.data('colpickRmx').fields
							.eq(6).val(parseInt(100*(ev.data.cal.data('colpickRmx').height - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').height,(pageY - ev.data.pos.top))))/ev.data.cal.data('colpickRmx').height, 10)).end()
							.eq(5).val(parseInt(100*(Math.max(0,Math.min(ev.data.cal.data('colpickRmx').height,(pageX - ev.data.pos.left))))/ev.data.cal.data('colpickRmx').height, 10))
							.get(0),
							[ev.data.preview]
						);
						break;
				}

				return false;
			},
			upSelector = function (ev) {
				fillRGBFields(ev.data.cal.data('colpickRmx').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colpickRmx').color, ev.data.cal.get(0));
				$(document).off('mouseup touchend',upSelector);
				$(document).off('mousemove touchmove',moveSelector);
				return false;
			},
			//Submit button
			clickSubmit = function (ev) {
				var cal = $(this).parent();
				var col = cal.data('colpickRmx').color;
				cal.data('colpickRmx').origColor = col;
				setCurrentColor(col, cal.get(0));
				cal.data('colpickRmx').onSubmit(col, hsbToHex(col), hsbToRgb(col), cal.data('colpickRmx').el);
			},
			//Show/hide the color picker
			show = function (ev) {
				if(ev) {
					// Prevent the trigger of any direct parent
					ev.stopPropagation();
				}
				var cal = $('#' + $(this).data('colpickRmxId'));

				//Trying to access to a variable (e.g. height)
				try { var temp = cal.data('colpickRmx').height; }
				catch (e) {
					//If an error is generated: abort showing!
					//window.alert("Failed to show color picker! Probably it was destroyed!"); //If you want to show this error message, uncomment this line.
					return;
				}

				if (ev && !cal.data('colpickRmx').polyfill) {
					ev.preventDefault();
				}
				cal.data('colpickRmx').onBeforeShow.apply(this, [cal.get(0), cal.data('colpickRmx').el]);

				//Position the color picker
				var pos = $(this).position();
				var top = pos.top + this.offsetHeight;
				var left = pos.left;
				//Fix if the color picker is showing outside of viewport
				if (outOfViewportHeight(cal, $(this), this) && $(this).offset().top - $(window).scrollTop() >= cal.outerHeight()){
					top -= (cal.outerHeight() + this.offsetHeight);
				}
				if (outOfViewportWidth(cal, $(this), this) && $(this).offset().left - $(window).scrollLeft() + this.offsetWidth >= cal.outerWidth()){
					left -= (cal.outerWidth() - this.offsetWidth);
				}
				//Apply the result
				cal.css({left: left + 'px', top: top + 'px'});

				if (cal.data('colpickRmx').onShow.apply(this, [cal.get(0), cal.data('colpickRmx').el]) != false) {
					cal.show();
				}
				//Hide when user clicks outside
				$('html').mousedown({cal:cal}, hide);
				cal.mousedown(function(ev){ev.stopPropagation();})
			},
			hide = function (ev) {
				var cal = $('#' + $(this).data('colpickRmxId'));
				if (ev) {
						cal = ev.data.cal;
				}
				if (cal.data('colpickRmx').onHide.apply(this, [cal.get(0), cal.data('colpickRmx').el]) != false) {
					cal.hide();
				}
				$('html').off('mousedown', hide);
			},
			//Detect if the color picker is out of viewport
			outOfViewportHeight = function (cal, wrapEl, domEl) {
				var calViewTop = wrapEl.offset().top - $(window).scrollTop() + domEl.offsetHeight; //Top of the color picker in viewport
				var calHeight = cal.outerHeight(); //Height of the color picker
				var viewHeight = $(window).height(); //Viewport height
				return (calViewTop + calHeight > viewHeight);
			},
			outOfViewportWidth = function (cal, wrapEl, domEl){
				var calViewLeft = wrapEl.offset().left - $(window).scrollLeft(); //Left of the color picker in viewport
				var calWidth = cal.outerWidth(); //Width of the color picker
				var viewWidth = $(window).width(); //Viewport width
				return (calViewLeft + calWidth > viewWidth);
			},
			//Fix the values if the user enters a negative or high value
			fixHSB = function (hsb) {
				return {
					h: Math.min(360, Math.max(0, hsb.h)),
					s: Math.min(100, Math.max(0, hsb.s)),
					b: Math.min(100, Math.max(0, hsb.b))
				};
			},
			fixRGB = function (rgb) {
				return {
					r: Math.min(255, Math.max(0, rgb.r)),
					g: Math.min(255, Math.max(0, rgb.g)),
					b: Math.min(255, Math.max(0, rgb.b))
				};
			},
			fixHex = function (hex) {
				var len = 6 - hex.length;
				if (len > 0) {
					var o = [];
					for (var i=0; i<len; i++) {
						o.push('0');
					}
					o.push(hex);
					hex = o.join('');
				}
				return hex;
			},
			getUniqueID = (function () {
				var cnt = parseInt(Math.random() * 10000);
				return function () {
					cnt += 1;
					return cnt;
				};
			})(),
			restoreOriginal = function () {
				var cal = $(this).parent();
				var col = cal.data('colpickRmx').origColor;
				cal.data('colpickRmx').color = col;
				fillRGBFields(col, cal.get(0));
				fillHexFields(col, cal.get(0));
				fillHSBFields(col, cal.get(0));
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
				cal.data('colpickRmx').onChange.apply(cal.parent(), [col, hsbToHex(col), hsbToRgb(col), cal.data('colpickRmx').el, 0]);
			};
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt||{});
				//Set color
				if (typeof opt.color == 'string') {
					opt.color = hexToHsb(opt.color);
				} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
					opt.color = rgbToHsb(opt.color);
				} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
					opt.color = fixHSB(opt.color);
				} else {
					return this;
				}

				//For each selected DOM element
				return this.each(function () {
					//If the element does not have an ID
					if (!$(this).data('colpickRmxId')) {
						var options = $.extend({}, opt);
						options.origColor = opt.color;

						// Set polyfill
						if (typeof opt.polyfill == 'function') {
								options.polyfill = opt.polyfill(this);
						}
						//Input field operations
						options.input = $(this).is('input');
						//Polyfill fixes
						if (options.polyfill && options.input && this.type === "color") {
								return;
						}

						//Generate and assign a random ID
						var id = 'colorpicker_' + getUniqueID();
						$(this).data('colpickRmxId', id);
						//Set the tpl's ID and get the HTML
						var cal = $(tpl).attr('id', id);

						//Switching between the 3 variants
						switch (options.variant) {
							case 'small': //Add class according to layout (small)
								cal.addClass('colpickRmx_s');
								cal.addClass('colpickRmx_s_'+options.layout+(options.submit?'':' colpickRmx_s_'+options.layout+'_ns'));
								break;
							case 'extra-large': //Add class according to layout (extra-large)
								cal.addClass('colpickRmx_xl');
								cal.addClass('colpickRmx_xl_'+options.layout+(options.submit?'':' colpickRmx_xl_'+options.layout+'_ns'));
								break;
							default: //Add class according to layout (default -> standard)
								cal.addClass('colpickRmx_'+options.layout+(options.submit?'':' colpickRmx_'+options.layout+'_ns'));
								break;
						}

						//Loading color scheme
						if(options.colorScheme.toLowerCase().indexOf('light') == 0 || options.colorScheme.toLowerCase().indexOf('dark') == 0){
							if(options.colorScheme.toLowerCase().indexOf('light') == 0){
								//All light color schemes start with "light"
								cal.addClass('colpickRmx_light'); //Loading default light color scheme
								if(options.colorScheme != 'light') {
									cal.addClass('colpickRmx_'+options.colorScheme); //Loading light-based color scheme
									/*
									INFO: You can implements light-based color schemes, in css, naming them: light--[name]
									*/
								}
							} else {
								//All dark color schemes start with "dark"
								cal.addClass('colpickRmx_dark'); //Loading default dark color scheme
								if(options.colorScheme != 'dark') {
									cal.addClass('colpickRmx_'+options.colorScheme); //Loading dark-based color scheme
									/*
									INFO: You can implements dark-based color schemes, in css, naming them: dark--[name]
									*/
								}
							}
						} else { //If the scheme does not starts with light or dark
							cal.addClass('colpickRmx_light'); //Loading default color scheme for all (light)
							cal.addClass('colpickRmx_'+options.colorScheme); //Loading the strange color scheme
						}
						//Set the hue's arrows color to a light color, if requested
						if(options.lightArrows) {
							cal.addClass('colpickRmx_lightHueArrs');
						}
						//Setup submit button
						cal.find('div.colpickRmx_submit').html(options.submitText).click(clickSubmit);
						//Setup input fields
						options.fields = cal.find('input').change(change).blur(blur).focus(focus);
						cal.find('div.colpickRmx_field_arrs').mousedown(downIncrement).end().find('div.colpickRmx_current_color').click(restoreOriginal);
						//Setup hue selector
						options.selector = cal.find('div.colpickRmx_color').on('mousedown touchstart',downSelector);
						options.selectorIndic = options.selector.find('div.colpickRmx_selector_outer');
						//Store parts of the plugin
						options.el = this;
						options.hue = cal.find('div.colpickRmx_hue_arrs');
						var huebar = options.hue.parent();
						//Paint the hue bar
						var UA = navigator.userAgent.toLowerCase();
						var isIE = navigator.appName === 'Microsoft Internet Explorer';
						var IEver = isIE ? parseFloat( UA.match( /msie ([0-9]{1,}[\.0-9]{0,})/ )[1] ) : 0;
						var ngIE = ( isIE && IEver < 10 );
						var stops = ['#ff0000','#ff0080','#ff00ff','#8000ff','#0000ff','#0080ff','#00ffff','#00ff80','#00ff00','#80ff00','#ffff00','#ff8000','#ff0000'];
						if(ngIE) {
							var i, div;
							for(i=0; i<=11; i++) {
								div = $('<div></div>').attr('style','height:8.333333%; filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+', endColorstr='+stops[i+1]+'); -ms-filter: "progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+', endColorstr='+stops[i+1]+')";');
								huebar.append(div);
							}
						} else {
							var stopList = stops.join(',');
							huebar.attr('style','background:-webkit-linear-gradient(top,'+stopList+'); background: -o-linear-gradient(top,'+stopList+'); background: -ms-linear-gradient(top,'+stopList+'); background:-moz-linear-gradient(top,'+stopList+'); -webkit-linear-gradient(top,'+stopList+'); background:linear-gradient(to bottom,'+stopList+'); ');
						}
						cal.find('div.colpickRmx_hue').on('mousedown touchstart',downHue);
						options.newColor = cal.find('div.colpickRmx_new_color');
						options.currentColor = cal.find('div.colpickRmx_current_color');
						//Store options and fill with default color
						cal.data('colpickRmx', options);
						fillRGBFields(options.color, cal.get(0));
						fillHSBFields(options.color, cal.get(0));
						fillHexFields(options.color, cal.get(0));
						setHue(options.color, cal.get(0));
						setSelector(options.color, cal.get(0));
						setCurrentColor(options.color, cal.get(0));
						setNewColor(options.color, cal.get(0));
						//Append to parent if flat=false, else show in place
						if (options.flat) {
							cal.appendTo(this).show();
							cal.css({
								position: 'relative',
								display: 'block'
							});
						} else {
							cal.appendTo($(this).parent());
							$(this).on(options.showEvent, show);
							cal.css({
								position:'absolute'
							});
						}
						//Loading completed
						cal.data('colpickRmx').onLoaded.apply(cal.parent(), [cal.get(0), cal.data('colpickRmx').el]);
					}
				});
			},
			//Shows the picker
			showPicker: function() {
				return this.each( function () {
					if ($(this).data('colpickRmxId')) {
						show.apply(this);
					}
				});
			},
			//Hides the picker
			hidePicker: function() {
				return this.each( function () {
					if ($(this).data('colpickRmxId')) {
						hide.apply(this);
					}
				});
			},
			//Sets a color as new and current (default)
			setColor: function(col, setCurrent) {
				if (col != undefined) {
					setCurrent = (typeof setCurrent === "undefined") ? 1 : setCurrent;
					if (typeof col == 'string') {
						col = hexToHsb(col);
					} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
						col = rgbToHsb(col);
					} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
						col = fixHSB(col);
					} else {
						return this;
					}
					return this.each(function(){
						if ($(this).data('colpickRmxId')) {
							var cal = $('#' + $(this).data('colpickRmxId'));
							cal.data('colpickRmx').color = col;
							cal.data('colpickRmx').origColor = col;
							fillRGBFields(col, cal.get(0));
							fillHSBFields(col, cal.get(0));
							fillHexFields(col, cal.get(0));
							setHue(col, cal.get(0));
							setSelector(col, cal.get(0));
							setNewColor(col, cal.get(0));
							cal.data('colpickRmx').onChange.apply(cal.parent(), [col, hsbToHex(col), hsbToRgb(col), cal.data('colpickRmx').el, 1]);
							if(setCurrent) {
								setCurrentColor(col, cal.get(0));
							}
						}
					});
				}
			},
			destroy: function() {
				var cal = $('#' + $(this).data('colpickRmxId'));
				cal.data('colpickRmx').onDestroy(cal.get(0), cal.data('colpickRmx').el);
				$('html').off('mousedown', hide);
				//Destroying picker
				cal.remove();
			},
			getCurrentColor: function() {
				var cal = $('#' + $(this).data('colpickRmxId'));
				return cal.data('colpickRmx').origColor;
			}
		};
	}();
	//Color space convertions
	var hexToRgb = function (hex) {
		hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
		return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
	};
	var hexToHsb = function (hex) {
		return rgbToHsb(hexToRgb(hex));
	};
	var rgbToHsb = function (rgb) {
		var hsb = {h: 0, s: 0, b: 0};
		var min = Math.min(rgb.r, rgb.g, rgb.b);
		var max = Math.max(rgb.r, rgb.g, rgb.b);
		var delta = max - min;
		hsb.b = max;
		hsb.s = max != 0 ? 255 * delta / max : 0;
		if (hsb.s != 0) {
			if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta;
			else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
			else hsb.h = 4 + (rgb.r - rgb.g) / delta;
		} else hsb.h = -1;
		hsb.h *= 60;
		if (hsb.h < 0) hsb.h += 360;
		hsb.s *= 100/255;
		hsb.b *= 100/255;
		return hsb;
	};
	var hsbToRgb = function (hsb) {
		var rgb = {};
		var h = hsb.h;
		var s = hsb.s*255/100;
		var v = hsb.b*255/100;
		if(s == 0) {
			rgb.r = rgb.g = rgb.b = v;
		} else {
			var t1 = v;
			var t2 = (255-s)*v/255;
			var t3 = (t1-t2)*(h%60)/60;
			if(h==360) h = 0;
			if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
			else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
			else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
			else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
			else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
			else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
			else {rgb.r=0; rgb.g=0;	rgb.b=0}
		}
		return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
	};
	var rgbToHex = function (rgb) {
		var hex = [
			rgb.r.toString(16),
			rgb.g.toString(16),
			rgb.b.toString(16)
		];
		$.each(hex, function (nr, val) {
			if (val.length == 1) {
				hex[nr] = '0' + val;
			}
		});
		return hex.join('');
	};
	var hsbToHex = function (hsb) {
		return rgbToHex(hsbToRgb(hsb));
	};
	$.fn.extend({
		newColpick: colpickRmx.init,
		hideColpick: colpickRmx.hidePicker,
		showColpick: colpickRmx.showPicker,
		destroyColpick: colpickRmx.destroy,
		setColpickColor: colpickRmx.setColor,
		getCurrentColpickColor: colpickRmx.getCurrentColor
	});
	$.extend({
		colpickRmx:{
			rgbToHex: rgbToHex,
			rgbToHsb: rgbToHsb,
			hsbToHex: hsbToHex,
			hsbToRgb: hsbToRgb,
			hexToHsb: hexToHsb,
			hexToRgb: hexToRgb
		}
	});
})(jQuery);
