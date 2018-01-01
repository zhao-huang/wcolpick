/*
Colpick RemiX - Color Picker

Copyright (C) 2017-2018 Salvatore Peluso (Firestorm): https://github.com/firestormxyz
Dual licensed under GPL v3.0 and MIT licenses.
(Based on Jose Vargas' Color Picker)

Description, how to use, and examples: https://github.com/firestormxyz/colpick-remix

Last Edit: 2018/01/01 19:00
*/



(function ($) {
	var colpickRmx = function () {
		var
			tpl = '<div class="colpickRmx"><div class="colpickRmx_color"><div class="colpickRmx_color_overlay1"><div class="colpickRmx_color_overlay2"><div class="colpickRmx_selector_outer"><div class="colpickRmx_selector_inner"></div></div></div></div></div><div class="colpickRmx_hue"><div class="colpickRmx_hue_underlay"></div><div class="colpickRmx_hue_overlay"></div><div class="colpickRmx_hue_arrs"><div class="colpickRmx_hue_larr"></div><div class="colpickRmx_hue_rarr"></div></div></div><div class="colpickRmx_alpha"><div class="colpickRmx_alpha_underlay colpickRmx_checkerboards"></div><div class="colpickRmx_alpha_overlay"></div><div class="colpickRmx_alpha_arrs"><div class="colpickRmx_alpha_darr"></div><div class="colpickRmx_alpha_uarr"></div></div></div><div class="colpickRmx_hex_field"><div class="colpickRmx_field_letter">#</div><input type="text" maxlength="8" size="6" /></div><div class="colpickRmx_rgb_r colpickRmx_field"><div class="colpickRmx_field_letter">R</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_rgb_g colpickRmx_field"><div class="colpickRmx_field_letter">G</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_rgb_b colpickRmx_field"><div class="colpickRmx_field_letter">B</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_hsb_h colpickRmx_field"><div class="colpickRmx_field_letter">H</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_hsb_s colpickRmx_field"><div class="colpickRmx_field_letter">S</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_hsb_b colpickRmx_field"><div class="colpickRmx_field_letter">B</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_alpha_field colpickRmx_field"><div class="colpickRmx_field_letter">A</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_colors"><div class="colpickRmx_colors_underlay colpickRmx_checkerboards"></div><div class="colpickRmx_new_color"></div><div class="colpickRmx_current_color"></div></div><div class="colpickRmx_submit"><div class="colpickRmx_tear"></div></div></div>',
			defaults = {
				flat: true, //If is "true", the color picker is displayed regardless.
				showEvent: 'click', //The event that shows the color picker (N.B. If flat is set to "true", this property is useless).
				enableAlpha: true, //Enable or disable alpha channel.
				variant: 'standard', //There are 3 variants: standard, small, extra-large.
				layout: 'full', //There are 3 types of layouts: full, rgbhex, hex.
				colorScheme: 'light-full', //There are 4 types of color schemes: light, dark, light-full, dark-full.
				compactLayout: false, //Switch between Normal and Compact layout.
				submit: true, //The 3 layouts have 2 sub-layouts for each: with submit button or without.
				readonlyFields: false, //Setup the readonly attribute to all fields.
				readonlyHexField: false, //Setup the readonly attribute only to hex field (N.B. Only for "true" value).
				arrowsColor: 'default', //Change color scheme for arrows.
				checkersColor: 'default', //Change color scheme for checkerboards.
				colorSelOutline: true, //Show or hide color selector's outline.
				hueOutline: true, //Show or hide hue's outline.
				alphaOutline: true, //Show or hide alpha's outline.
				colorOutline: true, //Show or hide color's outline.
				border: 1, //Width, in pixel, of the external border.
				color: {h:0, s:0, b:20, a:1}, //Default selected color.
				livePreview: true, //If is "true", the color is updated immediately when changing a parameter.
				polyfill: false, //If "true", the color picker is only activated when no native browser behavior is available.
				position: 'auto', //Where to place the color picker: automatically or at the center of viewport.
				appendToBody: false, //If "true", force the color picker to append to body (N.B. Only for "non flat" version).
				onLoaded: function() {},
				onBeforeShow: function() {},
				onShow: function () {},
				onHide: function () {},
				onDestroy: function () {},
				onChange: function () {},
				onSubmit: function () {}
			},
			//Fill the inputs of the plugin
			fillRGBFields = function  (rgba, cal) {
				$(cal).data('colpickRmx').fields
					.eq(1).val(rgba.r).end()
					.eq(2).val(rgba.g).end()
					.eq(3).val(rgba.b).end();
			},
			fillHSBFields = function  (hsba, cal) {
				$(cal).data('colpickRmx').fields
					.eq(4).val(Math.round(hsba.h)).end()
					.eq(5).val(Math.round(hsba.s)).end()
					.eq(6).val(Math.round(hsba.b)).end();
			},
			fillAlphaField = function (hsba, cal) {
				$(cal).data('colpickRmx').fields.eq(7).val(Math.round(hsba.a*100)).end();
			},
			fillHexField = function (hex, cal) {
				if ($(cal).data('colpickRmx').enableAlpha) $(cal).data('colpickRmx').fields.eq(0).val(hex);
				else $(cal).data('colpickRmx').fields.eq(0).val(hex.substring(0,6));
			},
			//Set selector's color and selector's indicator position
			setSelectorPos = function (hsba, cal) {
				$(cal).data('colpickRmx').selectorIndic.css({
					left: Math.round($(cal).data('colpickRmx').size * hsba.s/100),
					top: Math.round($(cal).data('colpickRmx').size * (100-hsba.b)/100)
				});
			},
			setSelectorColor = function (hsba, cal) {
				if (isInternetExplorer()) { //Compatibility with IE 6-9
					var rgba = hsbaToRgba({h: Math.round(hsba.h), s: 100, b: 100, a: 255});
					$(cal).data('colpickRmx').selector.css('backgroundColor', 'rgb('+rgba.r+','+rgba.g+','+rgba.b+')');
				} else $(cal).data('colpickRmx').selector.css('backgroundColor', 'hsl('+Math.round(hsba.h)+','+100+'%,'+50+'%)');
			},
			//Set hue's arrows position
			setHuePos = function (hsba, cal) {
				$(cal).data('colpickRmx').hue.css('top', Math.round($(cal).data('colpickRmx').size - $(cal).data('colpickRmx').size * hsba.h/360));
			},
			//Set alpha bar color and alpha's arrows position
			setAlphaPos = function (hsba, cal) {
				if ($(cal).data('colpickRmx').enableAlpha) $(cal).data('colpickRmx').alpha.css('left', Math.round($(cal).data('colpickRmx').size * hsba.a));
			},
			setAlphaColor = function (rgba, cal) {
				if ($(cal).data('colpickRmx').enableAlpha) {
					if (isInternetExplorer()) { //Compatibility with IE 6-9
						var end = rgbaToHex(rgba).substring(0,6);
						$(cal).data('colpickRmx').alphaBar.attr('style','filter:progid:DXImageTransform.Microsoft.gradient(GradientType=1,startColorstr=0,endColorstr=#'+end+'); -ms-filter:"progid:DXImageTransform.Microsoft.gradient(GradientType=1,startColorstr=0,endColorstr=#'+end+')";');
					} else {
						var begin = 'rgba('+rgba.r+','+rgba.g+','+rgba.b+',0)', end = 'rgba('+rgba.r+','+rgba.g+','+rgba.b+',1)';
					} $(cal).data('colpickRmx').alphaBar.attr('style','background:-webkit-linear-gradient(left,'+begin+' 0%,'+end+' 100%); background:-moz-linear-gradient(left,'+begin+' 0%,'+end+' 100%); background:-ms-linear-gradient(left,'+begin+' 0%,'+end+' 100%); background:-o-linear-gradient(left,'+begin+' 0%,'+end+' 100%); background:linear-gradient(to right,'+begin+' 0%,'+end+' 100%);');
				}
			},
			//Set current and new colors
			setCurrentColor = function (rgba, cal) {
				$(cal).data('colpickRmx').currentColor.css('backgroundColor', 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+rgba.a+')');
			},
			setNewColor = function (rgba, cal) {
				$(cal).data('colpickRmx').newColor.css('backgroundColor', 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+rgba.a+')');
			},
			//Called when the new color is changed
			change = function () {
				var cal = $(this).parent().parent(), hsba, rgba, hex;
				if (this.parentNode.className.indexOf('_alpha') > 0) {
					hsba = {
						h: cal.data('colpickRmx').color.h,
						s: cal.data('colpickRmx').color.s,
						b: cal.data('colpickRmx').color.b,
						a: fixAlpha(cal.data('colpickRmx').fields.eq(7).val()/100)
					};
					rgba = hsbaToRgba(hsba);
					hex = rgbaToHex(rgba);
				} else if (this.parentNode.className.indexOf('_hex') > 0) {
					rgba = hexToRgba(adaptHex(cal.data('colpickRmx').fields.eq(0).val(), cal));
					hsba = rgbaToHsba(rgba);
					hex = rgbaToHex(rgba);
				} else if (this.parentNode.className.indexOf('_hsb') > 0) {
					hsba = fixHSBA({
						h: Math.round(cal.data('colpickRmx').fields.eq(4).val()),
						s: Math.round(cal.data('colpickRmx').fields.eq(5).val()),
						b: Math.round(cal.data('colpickRmx').fields.eq(6).val()),
						a: cal.data('colpickRmx').color.a
					});
					rgba = hsbaToRgba(hsba);
					hex = rgbaToHex(rgba);
				} else {
					rgba = fixRGBA({
						r: Math.round(cal.data('colpickRmx').fields.eq(1).val()),
						g: Math.round(cal.data('colpickRmx').fields.eq(2).val()),
						b: Math.round(cal.data('colpickRmx').fields.eq(3).val()),
						a: cal.data('colpickRmx').color.a
					});
					hsba = rgbaToHsba(rgba);
					hex = rgbaToHex(rgba);
				}
				//Store new color
				cal.data('colpickRmx').color = cloneHSBA(hsba, true);
				//Show new color
				setNewColor(rgba, cal.get(0));
				//Fill fields with new color
				fillHSBFields(hsba, cal.get(0));
				fillAlphaField(hsba, cal.get(0));
				fillRGBFields(rgba, cal.get(0));
				fillHexField(hex, cal.get(0));
				//Setup other elements with new color
				setSelectorPos(hsba, cal.get(0));
				setSelectorColor(hsba, cal.get(0));
				setHuePos(hsba, cal.get(0));
				setAlphaPos(hsba, cal.get(0));
				setAlphaColor(rgba, cal.get(0));
				//Fires onChange (bySetColor = false)
				var hsla = hsbaToHsla(hsba);
				cal.data('colpickRmx').onChange.apply(cal.parent(), [{bySetColor:false, colorDiv:cal.get(0), el:cal.data('colpickRmx').el, hex:hex.substring(0,6), hexa:hex, hsb:cloneHSBA(hsba, false), hsba:hsba, hsl:cloneHSLA(hsla, false), hsla:hsla, rgb:cloneRGBA(rgba, false), rgba:rgba}]);
			},
			//Change style on blur and on focus of inputs
			blur = function () {
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
					el: $(this).parent().addClass('colpickRmx_changing'),
					max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : (this.parentNode.className.indexOf('_alpha') > 0 ? 100 : 255)),
					y: ev.pageY,
					field: field,
					val: Math.round(field.val()),
					preview: $(this).parent().parent().data('colpickRmx').livePreview
				};
				$(document).mouseup(current, upIncrement);
				$(document).mousemove(current, moveIncrement);
			},
			moveIncrement = function (ev) {
				//livePreview = true: execute "change" function and update colors | livePreview = false: update only the single field value
				ev.data.field.val(Math.max(0, Math.min(ev.data.max, Math.round(ev.data.val - ev.pageY + ev.data.y))));
				if (ev.data.preview) change.apply(ev.data.field.get(0));
				return false;
			},
			upIncrement = function (ev) {
				//livePreview = true: do nothing | livePreview = false: execute "change" function and update colors
				if (!ev.data.preview) change.apply(ev.data.field.get(0));
				ev.data.el.removeClass('colpickRmx_changing').find('input').focus();
				$(document).off('mouseup', upIncrement);
				$(document).off('mousemove', moveIncrement);
				return false;
			},
			//Alpha slider functions
			downAlpha = function (ev) {
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var current = {
					cal: $(this).parent(),
					x: $(this).offset().left,
					preview: $(this).parent().data('colpickRmx').livePreview
				};
				$(document).on('mouseup touchend',current,upAlpha);
				$(document).on('mousemove touchmove',current,moveAlpha);
				//Update alpha value with selected value
				var pageX = ((ev.type == 'touchstart') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX);
				change.apply(
					current.cal.data('colpickRmx').fields
					.eq(7).val(Math.round(100*Math.max(0,Math.min(current.cal.data('colpickRmx').size,(pageX - current.x)))/current.cal.data('colpickRmx').size))
					.get(0)
				);
				return false;
			},
			moveAlpha = function (ev) {
				var pageX = ((ev.type == 'touchmove') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX);
				var alpha = Math.round(100*Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageX - ev.data.x)))/ev.data.cal.data('colpickRmx').size);
				//livePreview = true: execute "change" function and update colors | livePreview = false: update only alpha's arrows position
				if (ev.data.preview) change.apply(ev.data.cal.data('colpickRmx').fields.eq(7).val(alpha).get(0));
				else setAlphaPos({a:alpha/100}, ev.data.cal.get(0));
				return false;
			},
			upAlpha = function (ev) {
				//livePreview = true: do nothing | livePreview = false: execute "change" function and update colors
				if (!ev.data.preview) {
					var pageX = ((ev.type == 'touchend') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX);
					change.apply(
						ev.data.cal.data('colpickRmx').fields
						.eq(7).val(Math.round(100*Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageX - ev.data.x)))/ev.data.cal.data('colpickRmx').size))
						.get(0)
					);
				}
				$(document).off('mouseup touchend',upAlpha);
				$(document).off('mousemove touchmove',moveAlpha);
				return false;
			},
			//Hue slider functions
			downHue = function (ev) {
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var current = {
					cal: $(this).parent(),
					y: $(this).offset().top,
					preview: $(this).parent().data('colpickRmx').livePreview
				};
				$(document).on('mouseup touchend',current,upHue);
				$(document).on('mousemove touchmove',current,moveHue);
				//Update hue value with selected value
				var pageY = ((ev.type == 'touchstart') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY);
				change.apply(
					current.cal.data('colpickRmx').fields
					.eq(4).val(Math.round(360*(current.cal.data('colpickRmx').size - Math.max(0,Math.min(current.cal.data('colpickRmx').size,(pageY - current.y))))/current.cal.data('colpickRmx').size))
					.get(0)
				);
				return false;
			},
			moveHue = function (ev) {
				var pageY = ((ev.type == 'touchmove') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY);
				var hue = Math.round(360*(ev.data.cal.data('colpickRmx').size - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageY - ev.data.y))))/ev.data.cal.data('colpickRmx').size);
				//livePreview = true: execute "change" function and update colors | livePreview = false: update only hue's arrows position
				if (ev.data.preview) change.apply(ev.data.cal.data('colpickRmx').fields.eq(4).val(hue).get(0));
				else setHuePos({h:hue}, ev.data.cal.get(0));
				return false;
			},
			upHue = function (ev) {
				//livePreview = true: do nothing | livePreview = false: execute "change" function and update colors
				if (!ev.data.preview) {
					var pageY = ((ev.type == 'touchend') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY);
					change.apply(
						ev.data.cal.data('colpickRmx').fields
						.eq(4).val(Math.round(360*(ev.data.cal.data('colpickRmx').size - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageY - ev.data.y))))/ev.data.cal.data('colpickRmx').size))
						.get(0)
					);
				}
				$(document).off('mouseup touchend',upHue);
				$(document).off('mousemove touchmove',moveHue);
				return false;
			},
			//Color selector functions
			downSelector = function (ev) {
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset(),
					preview: $(this).parent().data('colpickRmx').livePreview
				};
				$(document).on('mouseup touchend',current,upSelector);
				$(document).on('mousemove touchmove',current,moveSelector);
				//Update saturation and brightness with selected values
				var pageX, pageY;
				if(ev.type == 'touchstart') {pageX = ev.originalEvent.changedTouches[0].pageX; pageY = ev.originalEvent.changedTouches[0].pageY;} else {pageX = ev.pageX; pageY = ev.pageY;}
				change.apply(
					current.cal.data('colpickRmx').fields
					.eq(6).val(Math.round(100*(current.cal.data('colpickRmx').size - Math.max(0,Math.min(current.cal.data('colpickRmx').size,(pageY - current.pos.top))))/current.cal.data('colpickRmx').size)).end()
					.eq(5).val(Math.round(100*(Math.max(0,Math.min(current.cal.data('colpickRmx').size,(pageX - current.pos.left))))/current.cal.data('colpickRmx').size))
					.get(0)
				);
				return false;
			},
			moveSelector = function (ev) {
				var pageX, pageY;
				if(ev.type == 'touchmove') {pageX = ev.originalEvent.changedTouches[0].pageX; pageY = ev.originalEvent.changedTouches[0].pageY;} else {pageX = ev.pageX; pageY = ev.pageY;}
				var saturation = Math.round(100*(Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageX - ev.data.pos.left))))/ev.data.cal.data('colpickRmx').size);
				var brightness = Math.round(100*(ev.data.cal.data('colpickRmx').size - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageY - ev.data.pos.top))))/ev.data.cal.data('colpickRmx').size);
				//livePreview = true: execute "change" function and update colors | livePreview = false: update only selector's indicator position
				if (ev.data.preview) change.apply(ev.data.cal.data('colpickRmx').fields.eq(6).val(brightness).end().eq(5).val(saturation).get(0));
				else setSelectorPos({s:saturation, b:brightness}, ev.data.cal.get(0));
				return false;
			},
			upSelector = function (ev) {
				//livePreview = true: do nothing | livePreview = false: execute "change" function and update colors
				if (!ev.data.preview) {
					var pageX, pageY;
					if(ev.type == 'touchend') {pageX = ev.originalEvent.changedTouches[0].pageX; pageY = ev.originalEvent.changedTouches[0].pageY; } else { pageX = ev.pageX; pageY = ev.pageY;}
					change.apply(
						ev.data.cal.data('colpickRmx').fields
						.eq(6).val(Math.round(100*(ev.data.cal.data('colpickRmx').size - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageY - ev.data.pos.top))))/ev.data.cal.data('colpickRmx').size)).end()
						.eq(5).val(Math.round(100*(Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageX - ev.data.pos.left))))/ev.data.cal.data('colpickRmx').size))
						.get(0)
					);
				}
				$(document).off('mouseup touchend',upSelector);
				$(document).off('mousemove touchmove',moveSelector);
				return false;
			},
			//Submit button
			clickSubmit = function () {
				var cal = $(this).parent();
				var hsba = cloneHSBA(cal.data('colpickRmx').color, true);
				var rgba = hsbaToRgba(hsba);
				var hex = rgbaToHex(rgba);
				cal.data('colpickRmx').origColor = cloneHSBA(hsba, true);
				setCurrentColor(rgba, cal.get(0));
				//Fires onSubmit
				var hsla = hsbaToHsla(hsba);
				cal.data('colpickRmx').onSubmit({colorDiv:cal.get(0), el:cal.data('colpickRmx').el, hex:hex.substring(0,6), hexa:hex, hsb:cloneHSBA(hsba, false), hsba:hsba, hsl:cloneHSLA(hsla, false), hsla:hsla, rgb:cloneRGBA(rgba, false), rgba:rgba});
			},
			//Restore original color by clicking on current color
			restoreOriginal = function () {
				var cal = $(this).parent().parent();
				var hsba = cloneHSBA(cal.data('colpickRmx').origColor, true);
				var rgba = hsbaToRgba(hsba);
				var hex = rgbaToHex(rgba);
				cal.data('colpickRmx').color = cloneHSBA(hsba, true);
				//Reapplies current color to all elements
				fillHexField(hex, cal.get(0));
				fillRGBFields(rgba, cal.get(0));
				fillHSBFields(hsba, cal.get(0));
				fillAlphaField(hsba, cal.get(0));
				setSelectorPos(hsba, cal.get(0));
				setSelectorColor(hsba, cal.get(0));
				setHuePos(hsba, cal.get(0));
				setAlphaPos(hsba, cal.get(0));
				setAlphaColor(rgba, cal.get(0));
				setNewColor(rgba, cal.get(0));
				//Fires onChange (bySetColor = false)
				var hsla = hsbaToHsla(hsba);
				cal.data('colpickRmx').onChange.apply(cal.parent(), [{bySetColor:false, colorDiv:cal.get(0), el:cal.data('colpickRmx').el, hex:hex.substring(0,6), hexa:hex, hsb:cloneHSBA(hsba, false), hsba:hsba, hsl:cloneHSLA(hsla, false), hsla:hsla, rgb:cloneRGBA(rgba, false), rgba:rgba}]);
			},
			//Fix alpha value, if the user enters a wrong value
			fixAlpha = function (alpha) {
				return Math.min(1, Math.max(0, isNaN(alpha) ? 1 : alpha));
			},
			//Remove alpha from hexadecimal, if alpha channel is disabled
			adaptHex = function (hex, cal) {
				if (hex === undefined) hex = "000000ff";
				if (!cal.data('colpickRmx').enableAlpha) {
					hex = removeAlpha(hex);
				}
				return hex;
			},
			//Remove alpha value from hexadecimals/objects
			removeAlpha = function (col) {
				if (col != undefined) {
					if (typeof col == 'string') {
						if (col.indexOf('#') != 0) {
							if (col.length == 4) col = col.substring(0,3);
							if (col.length == 8) col = col.substring(0,6);
						} else {
							if (col.length == 5) col = col.substring(0,4);
							if (col.length == 9) col = col.substring(0,7);
						}
					} else if (col.a != undefined) col.a = 1;
				}
				return col;
			},
			//Clone color objects
			cloneRGBA = function (rgba, withAlpha) {
				if (rgba === undefined) return {r:0, g:0, b:0, a:1};
				if (withAlpha) {
					if (rgba.a === undefined) return {r:rgba.r, g:rgba.g, b:rgba.b, a:1};
					else return {r:rgba.r, g:rgba.g, b:rgba.b, a:rgba.a};
				} else return {r:rgba.r, g:rgba.g, b:rgba.b};
			},
			cloneHSBA = function (hsba, withAlpha) {
				if (hsba === undefined) return {h:0, s:0, b:0, a:1};
				if (withAlpha) {
					if (hsba.a === undefined) return {h:hsba.h, s:hsba.s, b:hsba.b, a:1};
					else return {h:hsba.h, s:hsba.s, b:hsba.b, a:hsba.a};
				} else return {h:hsba.h, s:hsba.s, b:hsba.b};
			},
			cloneHSLA = function (hsla, withAlpha) {
				if (hsla === undefined) return {h:0, s:0, l:0, a:1};
				if (withAlpha) {
					if (hsla.a === undefined) return {h:hsla.h, s:hsla.s, l:hsla.l, a:1};
					else return {h:hsla.h, s:hsla.s, l:hsla.l, a:hsla.a};
				} else return {h:hsla.h, s:hsla.s, l:hsla.l};
			},
			//Compare color objects
			compareHSBA = function (hsba1, hsba2) {
				if (hsba1 === undefined || hsba2 === undefined) return false;
				return (hsba1.h == hsba2.h && hsba1.s == hsba2.s && hsba1.b == hsba2.b && hsba1.a == hsba2.a);
			},
			//Shows/hides the color picker
			show = function (ev) {
				//Prevent the trigger of any direct parent
				if (ev) ev.stopPropagation();
				//cal is the color picker (dom object)
				var cal = $('#' + $(this).data('colpickRmxId')), overridePos = {};
				//Trying to access to a property (e.g. color) and, if is generated an error, abort!
				try {var temp = cal.data('colpickRmx').color;}
				catch (e) {return this;}
				//Polyfill fixes
				if (ev && !cal.data('colpickRmx').polyfill) ev.preventDefault();
				//Fires onBeforeShow
				cal.data('colpickRmx').onBeforeShow.apply(this, [{colorDiv:cal.get(0), el:cal.data('colpickRmx').el, overridePos:overridePos}]);
				//If flat is true, simply shows the color picker!
				if (cal.data('colpickRmx').flat) {
					//Fires onShow
					if (!(cal.data('colpickRmx').onShow.apply(this, [{colorDiv:cal.get(0), el:cal.data('colpickRmx').el}]) != false)) return this;
					//Shows the picker and terminates
					cal.show();
					return;
				}
				//Positions the color picker
				if (overridePos.left === undefined || isNaN(overridePos.left) || overridePos.top === undefined || isNaN(overridePos.top)) {
					//Calculates the correctly position
					var finalPos = {top:0, left:0}, pos = cal.data('colpickRmx').appendedToBody ? $(this).offset() : $(this).position();
					if (cal.data('colpickRmx').position == "center") { //Positions the color picker on center of viewport
						//Positions the color picker on top-left corner of viewport
						finalPos.top = pos.top - ($(this).offset().top - $(window).scrollTop());
						finalPos.left = pos.left - ($(this).offset().left - $(window).scrollLeft());
						//Positions the color picker on center of viewport, by adding coordinates
						var centerViewport = {top:$(window).height()/2, left:$(window).width()/2};
						finalPos.top += centerViewport.top - cal.outerHeight()/2;
						finalPos.left += centerViewport.left - cal.outerWidth()/2;
					} else { //Positions the color picker automatically (default)
						//Positions the color picker under his related html object
						finalPos.top = pos.top + this.offsetHeight;
						finalPos.left = pos.left;
						//Fixes, if the color picker is showing outside of viewport
						if (outOfViewportHeight(cal, $(this), this) && $(this).offset().top - $(window).scrollTop() >= cal.outerHeight()) {
							finalPos.top -= (cal.outerHeight() + this.offsetHeight);
						}
						if (outOfViewportWidth(cal, $(this))) {
							if ($(this).offset().left - $(window).scrollLeft() + this.offsetWidth >= cal.outerWidth()) {
								finalPos.left -= (cal.outerWidth() - this.offsetWidth);
							} else {
								var leftMargin = $(this).offset().left - $(window).scrollLeft();
								var outWidth = leftMargin + cal.outerWidth() - $(window).width();
								if (leftMargin > outWidth) { finalPos.left -= outWidth; } else { finalPos.left -= leftMargin; }
							}
						}
					}
					//Applies the result
					cal.css({top: finalPos.top + 'px', left: finalPos.left + 'px'});
				} else {
					//Applies the user-defined position
					cal.css({top: overridePos.top + 'px', left: overridePos.left + 'px'});
				}
				//Fires onShow
				if (!(cal.data('colpickRmx').onShow.apply(this, [{colorDiv:cal.get(0), el:cal.data('colpickRmx').el}]) != false)) return this;
				//Shows the picker
				cal.show();
				//Hides when user clicks outside
				$('html').mousedown({cal:cal}, hide);
				cal.mousedown(function(ev){ev.stopPropagation();})
			},
			hide = function (ev) {
				var cal = $('#' + $(this).data('colpickRmxId'));
				if (ev) cal = ev.data.cal;
				//Trying to access to a property (e.g. color) and, if is generated an error, abort!
				try {var temp = cal.data('colpickRmx').color;}
				catch (e) {return this;}
				//Fires onHide
				if (!(cal.data('colpickRmx').onHide.apply(this, [{colorDiv:cal.get(0), el:cal.data('colpickRmx').el}]) != false)) return this;
				//Hides the picker
				cal.hide();
				$('html').off('mousedown', hide);
			},
			//Detect if the color picker is out of viewport
			outOfViewportHeight = function (cal, wrapEl, domEl) {
				var calViewTop = wrapEl.offset().top - $(window).scrollTop() + domEl.offsetHeight; //Top of the color picker in viewport
				var calHeight = cal.outerHeight(); //Height of the color picker
				var viewHeight = $(window).height(); //Viewport height
				return (calViewTop + calHeight > viewHeight);
			},
			outOfViewportWidth = function (cal, wrapEl) {
				var calViewLeft = wrapEl.offset().left - $(window).scrollLeft(); //Left of the color picker in viewport
				var calWidth = cal.outerWidth(); //Width of the color picker
				var viewWidth = $(window).width(); //Viewport width
				return (calViewLeft + calWidth > viewWidth);
			},
			//Destroys the color picker
			destroy = function (ev) {
				var cal = $('#' + $(this).data('colpickRmxId'));
				if (ev) cal = ev.data.cal;
				//Fires onDestroy
				if (!(cal.data('colpickRmx').onDestroy.apply(this, [{colorDiv:cal.get(0), el:cal.data('colpickRmx').el}]) != false)) return this;
				//Destroys the picker
				cal.remove();
				//Prevent firing of hide event on a destroyed object! //bySetColor
				$('html').off('mousedown', hide);
			},
			//Generate a random unique id
			getUniqueID = (function () {
				var cnt = Math.round(Math.random() * 10000);
				return function () {
					cnt += 1;
					return cnt;
				};
			})(),
			//Used to detect if the browser in use is Microsoft Internet Explorer
			isInternetExplorer = function () {
				var isIE = (navigator.appName === 'Microsoft Internet Explorer');
				if (!isIE) return false;
				var UA = navigator.userAgent.toLowerCase();
				var IEver = parseFloat(UA.match( /msie ([0-9]{1,}[\.0-9]{0,})/ )[1]);
				var ngIE = (isIE && IEver < 10);
				return ngIE;
			};
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt||{});
				//Set color
				if (typeof opt.color == 'string') opt.color = hexToHsba(opt.color);
				else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) opt.color = rgbaToHsba(fixRGBA(opt.color));
				else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) opt.color = fixHSBA(opt.color);
				else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.l != undefined) opt.color = hslaToHsba(fixHSLA(opt.color));
				else opt.color = {h:0, s:0, b:0, a:1}; //Black = Error color

				//Normalize string options
				opt.showEvent = opt.showEvent.toLowerCase();
				opt.variant = opt.variant.toLowerCase();
				opt.layout = opt.layout.toLowerCase();
				opt.colorScheme = opt.colorScheme.toLowerCase();
				opt.arrowsColor = opt.arrowsColor.toLowerCase();
				opt.checkersColor = opt.checkersColor.toLowerCase();

				//For each selected DOM element
				return this.each(function () {
					//If the element does not have an ID
					if (!$(this).data('colpickRmxId')) {
						var options = $.extend({}, opt);
						//Fixes color if alpha is disabled
						if (!opt.enableAlpha) opt.color = removeAlpha(opt.color);
						//Setup current color
						options.origColor = cloneHSBA(opt.color, true);

						// Set polyfill
						if (typeof opt.polyfill == 'function') options.polyfill = opt.polyfill(this);
						//Input field operations
						options.input = $(this).is('input');
						//Polyfill fixes
						if (options.polyfill && options.input && this.type === "color") return;

						//Generate and assign a random ID
						var id = 'colorpicker_' + getUniqueID();
						$(this).data('colpickRmxId', id);
						//Set the tpl's ID and get the HTML
						var cal = $(tpl).attr('id', id);

						//Setup size of the selected variant (Add other "else-if" for other future variants)
						if (options.variant == 'small') options.size = 160; //Small Version!
						else if (options.variant == 'extra-large') options.size = 300; //Extra Large Version!
						else options.size = 225; //Standard Version (default)!

						//Loading the choosen layout
						if (options.variant == "small") { //Add class according to layout (small)
							cal.addClass('colpickRmxS colpickRmxS_'+options.layout+(options.submit?'':' colpickRmxS_'+options.layout+'_ns'));
							if(!options.enableAlpha) cal.addClass('colpickRmxS_noalpha colpickRmxS_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmxS_'+options.layout+'_noalpha_ns')); //Disable alpha channel, if requested
						} else if (options.variant == "extra-large") { //Add class according to layout (extra-large)
							cal.addClass('colpickRmxXL colpickRmxXL_'+options.layout+(options.submit?'':' colpickRmxXL_'+options.layout+'_ns'));
							if(!options.enableAlpha) cal.addClass('colpickRmxXL_noalpha colpickRmxXL_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmxXL_'+options.layout+'_noalpha_ns')); //Disable alpha channel, if requested
						} else { //Add class according to layout (default -> standard)
							cal.addClass('colpickRmx_'+options.layout+(options.submit?'':' colpickRmx_'+options.layout+'_ns'));
							if(!options.enableAlpha) cal.addClass('colpickRmx_noalpha colpickRmx_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmx_'+options.layout+'_noalpha_ns')); //Disable alpha channel, if requested
						}
						//Loading Compact layout, if requested
						if (options.compactLayout) {
							if (options.variant == "small") { //Add class according to layout (small)
								cal.addClass('colpickRmxS_compact colpickRmxS_compact_'+options.layout+(options.submit?'':' colpickRmxS_compact_'+options.layout+'_ns'));
								if(!options.enableAlpha) cal.addClass('colpickRmxS_compact_noalpha colpickRmxS_compact_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmxS_compact_'+options.layout+'_noalpha_ns')); //Disable alpha channel, if requested
							} else if (options.variant == "extra-large") { //Add class according to layout (extra-large)
								cal.addClass('colpickRmxXL_compact colpickRmxXL_compact_'+options.layout+(options.submit?'':' colpickRmxXL_compact_'+options.layout+'_ns'));
								if(!options.enableAlpha) cal.addClass('colpickRmxXL_compact_noalpha colpickRmxXL_compact_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmxXL_compact_'+options.layout+'_noalpha_ns')); //Disable alpha channel, if requested
							} else { //Add class according to layout (default -> standard)
								cal.addClass('colpickRmx_compact colpickRmx_compact_'+options.layout+(options.submit?'':' colpickRmx_compact_'+options.layout+'_ns'));
								if(!options.enableAlpha) cal.addClass('colpickRmx_compact_noalpha colpickRmx_compact_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmx_compact_'+options.layout+'_noalpha_ns')); //Disable alpha channel, if requested
							}
						}

						//Loading the choosen color scheme
						if (options.colorScheme.indexOf("light") == 0) { //All light color schemes start with "light"
							cal.addClass('colpickRmx_light'); //Loading default light color scheme
							if(options.colorScheme != "light") cal.addClass('colpickRmx_'+options.colorScheme); //Loading light-based color scheme
							/*
							INFO: You can implements light-based color schemes, in css, naming them: light-[name] (IMPORTANT: Use only lowercase names!)
							*/
						} else if (options.colorScheme.indexOf("dark") == 0) { //All dark color schemes start with "dark"
							cal.addClass('colpickRmx_dark'); //Loading default dark color scheme
							if(options.colorScheme != "dark") cal.addClass('colpickRmx_'+options.colorScheme); //Loading dark-based color scheme
							/*
							INFO: You can implements dark-based color schemes, in css, naming them: dark-[name] (IMPORTANT: Use only lowercase names!)
							*/
						} else { //If the scheme does not starts with "light" or "dark"
							cal.addClass('colpickRmx_light'); //Loading default color scheme for all (light)
							cal.addClass('colpickRmx_'+options.colorScheme); //Loading the "strange" color scheme
						}

						//Change color scheme for arrows, if requested
						if (options.arrowsColor == "light") cal.addClass('colpickRmx_lightArrs');
						else if (options.arrowsColor == "dark") cal.addClass('colpickRmx_darkArrs');

						//Change color scheme for checkerboards, if requested
						if (options.checkersColor == "light") cal.addClass('colpickRmx_lightCheckerboards');
						else if (options.checkersColor == "dark") cal.addClass('colpickRmx_darkCheckerboards');

						//Hide outlines, if requested
						if (!options.colorSelOutline) cal.addClass('colpickRmx_noCSOutline');
						if (!options.hueOutline) cal.addClass('colpickRmx_noHOutline');
						if (!options.alphaOutline) cal.addClass('colpickRmx_noAOutline');
						if (!options.colorOutline) cal.addClass('colpickRmx_noNCOutline');

						//Set border width
						cal.css('border-width', options.border + 'px');

						//Setup submit button
						cal.find('div.colpickRmx_submit').click(clickSubmit);
						//Setup input fields
						options.fields = cal.find('input').change(change).blur(blur).focus(focus);
						//If alpha channel is disabled, set hex field maxlength to 6
						if (!options.enableAlpha) options.fields.eq(0).prop('maxlength', 6);
						//Setup readonly attribute to fields
						options.fields.eq(0).prop('readonly', options.readonlyFields);
						options.fields.eq(1).prop('readonly', options.readonlyFields);
						options.fields.eq(2).prop('readonly', options.readonlyFields);
						options.fields.eq(3).prop('readonly', options.readonlyFields);
						options.fields.eq(4).prop('readonly', options.readonlyFields);
						options.fields.eq(5).prop('readonly', options.readonlyFields);
						options.fields.eq(6).prop('readonly', options.readonlyFields);
						options.fields.eq(7).prop('readonly', options.readonlyFields);
						if (options.readonlyHexField) options.fields.eq(0).prop('readonly', options.readonlyHexField);
						//Setup restoreOriginal to current color's click event
						cal.find('div.colpickRmx_field_arrs').mousedown(downIncrement).end().find('div.colpickRmx_current_color').click(restoreOriginal);
						//Setup hue selector
						options.selector = cal.find('div.colpickRmx_color').on('mousedown touchstart',downSelector);
						options.selectorIndic = options.selector.find('div.colpickRmx_selector_outer');
						//Store parts of the plugin
						options.el = this;
						options.hue = cal.find('div.colpickRmx_hue_arrs');
						options.hueBar = cal.find('div.colpickRmx_hue_overlay');
						options.alpha = cal.find('div.colpickRmx_alpha_arrs');
						options.alphaBar = cal.find('div.colpickRmx_alpha_overlay');
						//Paint the hue bar
						var stops = ['#ff0000','#ff0080','#ff00ff','#8000ff','#0000ff','#0080ff','#00ffff','#00ff80','#00ff00','#80ff00','#ffff00','#ff8000','#ff0000'];
						if (isInternetExplorer()) { //Compatibility with IE 6-9
							var i, div;
							for (i=0; i<=11; i++) {
								div = $('<div></div>').attr('style','height:8.333333%; filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+',endColorstr='+stops[i+1]+'); -ms-filter:"progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+',endColorstr='+stops[i+1]+')";');
								options.hueBar.append(div);
							}
						} else {
							var stopList = stops.join(',');
							options.hueBar.attr('style','background:-webkit-linear-gradient(top,'+stopList+'); background:-moz-linear-gradient(top,'+stopList+'); background:-ms-linear-gradient(top,'+stopList+'); background:-o-linear-gradient(top,'+stopList+'); background:linear-gradient(to bottom,'+stopList+');');
						}
						//Set remaining events, new, and current color
						cal.find('div.colpickRmx_hue').on('mousedown touchstart',downHue);
						cal.find('div.colpickRmx_alpha').on('mousedown touchstart',downAlpha);
						options.newColor = cal.find('div.colpickRmx_new_color');
						options.currentColor = cal.find('div.colpickRmx_current_color');
						//Store options
						cal.data('colpickRmx', options);
						//Fill with default color
						var rgba = hsbaToRgba(options.color);
						fillHSBFields(options.color, cal.get(0));
						fillAlphaField(options.color, cal.get(0));
						fillRGBFields(rgba, cal.get(0));
						fillHexField(rgbaToHex(rgba), cal.get(0));
						setSelectorPos(options.color, cal.get(0));
						setSelectorColor(options.color, cal.get(0));
						setHuePos(options.color, cal.get(0));
						setAlphaPos(options.color, cal.get(0));
						setAlphaColor(rgba, cal.get(0));
						setCurrentColor(rgba, cal.get(0));
						setNewColor(rgba, cal.get(0));
						//Append to parent if flat=false, else show in place
						if (options.flat) {
							cal.appendTo(this).show();
							cal.css({position: 'relative', display: 'block'});
						} else {
							cal.data('colpickRmx').appendedToBody = options.appendToBody;
							if (!options.appendToBody) cal.appendTo($(this).parent());
							else cal.appendTo(document.body);
							$(this).on(options.showEvent, show);
							cal.css({position: 'absolute'});
						}

						//Loading completed
						cal.data('colpickRmx').onLoaded.apply(cal.parent(), [{colorDiv:cal.get(0), el:cal.data('colpickRmx').el}]);
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
			//Destroys the picker
			destroyPicker: function() {
				return this.each( function () {
					if ($(this).data('colpickRmxId')) {
						destroy.apply(this);
					}
				});
			},
			//Sets a color as new and current (Default: Set only as new color)
			setColor: function(col, setCurrent) {
				if (col != undefined) { //If color is undefined, do nothing!
					if (typeof col == 'string') col = hexToHsba(col);
					else if (col.r != undefined && col.g != undefined && col.b != undefined) col = rgbaToHsba(fixRGBA(col));
					else if (col.h != undefined && col.s != undefined && col.b != undefined) col = fixHSBA(col);
					else if (col.h != undefined && col.s != undefined && col.l != undefined) col = hslaToHsba(fixHSLA(col));
					else return this; //If color is not recognized, do nothing!
					if (setCurrent === undefined) setCurrent = false; //Default: Set only as new color
					return this.each(function(){
						if ($(this).data('colpickRmxId')) {
							var cal = $('#' + $(this).data('colpickRmxId'));
							//Fixes color if alpha is disabled
							if (!cal.data('colpickRmx').enableAlpha) col = removeAlpha(col);
							//Check if the color is actually changed and, if is true, do nothing!
							if (setCurrent) { if (compareHSBA(col, cal.data('colpickRmx').color) && compareHSBA(col, cal.data('colpickRmx').origColor)) return this; }
							else { if (compareHSBA(col, cal.data('colpickRmx').color)) return this; }
							//Setup new color
							cal.data('colpickRmx').color = cloneHSBA(col, true);
							var rgba = hsbaToRgba(col);
							var hex = rgbaToHex(rgba);
							//Applies color to all elements
							fillHSBFields(col, cal.get(0));
							fillAlphaField(col, cal.get(0));
							fillRGBFields(rgba, cal.get(0));
							fillHexField(hex, cal.get(0));
							setSelectorPos(col, cal.get(0));
							setSelectorColor(col, cal.get(0));
							setHuePos(col, cal.get(0));
							setAlphaPos(col, cal.get(0));
							setAlphaColor(rgba, cal.get(0));
							setNewColor(rgba, cal.get(0));
							//If setCurrent is "true", sets the color as current
							if (setCurrent) {
								cal.data('colpickRmx').origColor = cloneHSBA(col, true);
								setCurrentColor(rgba, cal.get(0));
							}
							//Fires onChange (bySetColor = true)
							var hsla = hsbaToHsla(col);
							cal.data('colpickRmx').onChange.apply(cal.parent(), [{bySetColor:true, colorDiv:cal.get(0), el:cal.data('colpickRmx').el, hex:hex.substring(0,6), hexa:hex, hsb:cloneHSBA(col, false), hsba:col, hsl:cloneHSLA(hsla, false), hsla:hsla, rgb:cloneRGBA(rgba, false), rgba:rgba}]);
						}
					});
				}
			},
			//Returns the selected color (Default: Hsb color with alpha value, and get new color (not current))
			getColor: function(type, getCurrent) {
				var cal = $('#' + $(this).data('colpickRmxId'));
				if (getCurrent === undefined) getCurrent = false; //Default: Get new color (not current)
				if (type === undefined) type = "hsba"; //Default: Hsb color with alpha value
				var withAlpha = (type.indexOf("a") != -1);
				//Getting the color
				var col = getCurrent ? cloneHSBA(cal.data('colpickRmx').origColor, true) : cloneHSBA(cal.data('colpickRmx').color, true);
				if (type.indexOf("rgb") != -1) {
					var rgba = hsbaToRgba(col);
					return withAlpha ? {r:rgba.r, g:rgba.g, b:rgba.b, a:rgba.a} : {r:rgba.r, g:rgba.g, b:rgba.b};
				} else if (type.indexOf("hsl") != -1) {
					var hsla = hsbaToHsla(col);
					return withAlpha ? {h:hsla.h, s:hsla.s, l:hsla.l, a:hsla.a} : {h:hsla.h, s:hsla.s, l:hsla.l};
				} else if (type.indexOf("hex") != -1) return withAlpha ? hsbaToHex(col) : hsbaToHex(col).substring(0,6);
				else return withAlpha ? {h:col.h, s:col.s, b:col.b, a:col.a} : {h:col.h, s:col.s, b:col.b};
			}
		};
	}();
	//Color space convertions
	var hexToRgba = function (hex) {
		if (hex === undefined) return {r:0, g:0, b:0, a:1};
		if (hex.indexOf('#') == 0) hex = hex.substring(1);
		if (isValidHex(hex)) {
			if (hex.length == 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + "ff";
			else if (hex.length == 4) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
			else if (hex.length == 6) hex = hex + "ff";
			else if (hex.length != 8) return {r:0, g:0, b:0, a:1};
		} else { return {r:0, g:0, b:0, a:1}; }
		var hexI = parseInt(hex,16);
		var rgba = {r: hexI >>> 24, g: (hexI & 0x00FF0000) >>> 16, b: (hexI & 0x0000FF00) >>> 8, a: (hexI & 0x000000FF)};
		rgba.a = rgba.a / 255;
		return rgba;
	};
	var hexToHsba = function (hex) {
		return rgbaToHsba(hexToRgba(hex));
	};
	var hexToHsla = function (hex) {
		return rgbaToHsla(hexToRgba(hex));
	};
	var rgbaToHex = function (rgba) {
		if (rgba === undefined) return "000000ff";
		if (rgba.a === undefined) rgba.a = 1;
		var alpha = Math.round(rgba.a * 255);
		var hex = [
			rgba.r.toString(16),
			rgba.g.toString(16),
			rgba.b.toString(16),
			alpha.toString(16)
		];
		$.each(hex, function (nr, val) {
			if (val.length == 1) {
				hex[nr] = '0' + val;
			}
		});
		return hex.join('');
	};
	var rgbaToHsba = function (rgba) {
		if (rgba === undefined) return {h:0, s:0, b:0, a:1};
		if (rgba.a === undefined) rgba.a = 1;
		var hsba = {h:0, s:0, b:0, a:rgba.a};
		var min = Math.min(rgba.r, rgba.g, rgba.b);
		var max = Math.max(rgba.r, rgba.g, rgba.b);
		var delta = max - min;
		hsba.b = max;
		hsba.s = max != 0 ? 255 * delta / max : 0;
		if (hsba.s != 0) {
			if (rgba.r == max) hsba.h = (rgba.g - rgba.b) / delta;
			else if (rgba.g == max) hsba.h = 2 + (rgba.b - rgba.r) / delta;
			else hsba.h = 4 + (rgba.r - rgba.g) / delta;
		} else hsba.h = -6;
		hsba.h *= 60;
		if (hsba.h < 0) hsba.h += 360;
		hsba.s *= 100/255;
		hsba.b *= 100/255;
		return hsba;
	};
	var rgbaToHsla = function (rgba) {
		return hsbaToHsla(rgbaToHsba(rgba));
	};
	var hsbaToHex = function (hsba) {
		return rgbaToHex(hsbaToRgba(hsba));
	};
	var hsbaToRgba = function (hsba) {
		if (hsba === undefined) return {r:0, g:0, b:0, a:1};
		if (hsba.a === undefined) hsba.a = 1;
		var rgba = {};
		var h = hsba.h;
		var s = hsba.s*255/100;
		var v = hsba.b*255/100;
		if(s == 0) {
			rgba.r = rgba.g = rgba.b = v;
		} else {
			var t1 = v;
			var t2 = (255-s)*v/255;
			var t3 = (t1-t2)*(h%60)/60;
			if(h==360) h = 0;
			if(h<60) {rgba.r=t1;	rgba.b=t2; rgba.g=t2+t3}
			else if(h<120) {rgba.g=t1; rgba.b=t2;	rgba.r=t1-t3}
			else if(h<180) {rgba.g=t1; rgba.r=t2;	rgba.b=t2+t3}
			else if(h<240) {rgba.b=t1; rgba.r=t2;	rgba.g=t1-t3}
			else if(h<300) {rgba.b=t1; rgba.g=t2;	rgba.r=t2+t3}
			else if(h<360) {rgba.r=t1; rgba.g=t2;	rgba.b=t1-t3}
			else {rgba.r=0; rgba.g=0;	rgba.b=0}
		}
		return {r:Math.round(rgba.r), g:Math.round(rgba.g), b:Math.round(rgba.b), a:hsba.a};
	};
	var hsbaToHsla = function (hsba) {
		if (hsba === undefined) return {h:0, s:0, l:0, a:1};
		if (hsba.a === undefined) hsba.a = 1;
		var hsla = {h:hsba.h, s:0, l:0, a:hsba.a};
		var s = hsba.s / 100;
		var b = hsba.b / 100;
		hsla.l = b * (2 - s) / 2;
		if (hsla.l != 0 && hsla.l != 1) {
			hsla.s = (b * s) / (1 - Math.abs(2 * hsla.l - 1));
		} else hsla.s = 0;
		if (hsla.s == 0) hsla.h = 0;
		hsla.s *= 100;
		hsla.l *= 100;
		return hsla;
	};
	var hslaToHex = function (hsla) {
		return rgbaToHex(hslaToRgba(hsla));
	};
	var hslaToRgba = function (hsla) {
		return hsbaToRgba(hslaToHsba(hsla));
	};
	var hslaToHsba = function (hsla) {
		if (hsla === undefined) return {h:0, s:0, b:0, a:1};
		if (hsla.a === undefined) hsla.a = 1;
		var hsba = {h:hsla.h, s:0, b:0, a:hsla.a};
		var s = hsla.s / 100;
		var l = hsla.l / 100;
		hsba.b = (2 * l + s * (1 - Math.abs(2 * l - 1))) / 2;
		if (hsba.b != 0) {
			hsba.s = 2 * (hsba.b - l) / hsba.b;
		} else hsba.s = 0;
		if (hsba.s == 0) hsba.h = 0;
		hsba.s *= 100;
		hsba.b *= 100;
		return hsba;
	};
	//Check if a string is a valid hexadecimal string
	var isValidHex = function (hex) {
		if (hex === undefined) return false;
		while (hex.indexOf('0') == 0) {
			hex = hex.substring(1);
		}
		if(hex == "") hex = "0";
		return (parseInt(hex,16).toString(16) === hex.toLowerCase());
	};
	//Fix the values, if the user enters a wrong value
	var fixRGBA = function (rgba) {
		if (rgba === undefined) return {r:0, g:0, b:0, a:1};
		return {
			r: Math.min(255, Math.max(0, isNaN(rgba.r) ? 0 : rgba.r)),
			g: Math.min(255, Math.max(0, isNaN(rgba.g) ? 0 : rgba.g)),
			b: Math.min(255, Math.max(0, isNaN(rgba.b) ? 0 : rgba.b)),
			a: Math.min(1, Math.max(0, isNaN(rgba.a) ? 1 : rgba.a))
		};
	};
	var fixHSBA = function (hsba) {
		if (hsba === undefined) return {h:0, s:0, b:0, a:1};
		return {
			h: Math.min(360, Math.max(0, isNaN(hsba.h) ? 0 : hsba.h)),
			s: Math.min(100, Math.max(0, isNaN(hsba.s) ? 0 : hsba.s)),
			b: Math.min(100, Math.max(0, isNaN(hsba.b) ? 0 : hsba.b)),
			a: Math.min(1, Math.max(0, isNaN(hsba.a) ? 1 : hsba.a))
		};
	};
	var fixHSLA = function (hsla) {
		if (hsla === undefined) return {h:0, s:0, l:0, a:1};
		return {
			h: Math.min(360, Math.max(0, isNaN(hsla.h) ? 0 : hsla.h)),
			s: Math.min(100, Math.max(0, isNaN(hsla.s) ? 0 : hsla.s)),
			l: Math.min(100, Math.max(0, isNaN(hsla.l) ? 0 : hsla.l)),
			a: Math.min(1, Math.max(0, isNaN(hsla.a) ? 1 : hsla.a))
		};
	};
	//Converts a css color string in a color object
	var encodeToCSS = function (colobj) {
		if (colobj === undefined) return "rgb(0,0,0)";
		if (colobj.r != undefined && colobj.g != undefined && colobj.b != undefined) {
			var rgba = fixRGBA(colobj);
			return "rgba("+rgba.r+","+rgba.g+","+rgba.b+","+rgba.a+")";
		} else if (colobj.h != undefined && colobj.s != undefined && colobj.l != undefined) {
			var hsla = fixHSLA(colobj);
			return "hsla("+hsla.h+","+hsla.s+"%,"+hsla.l+"%,"+hsla.a+")";
		} else if (colobj.h != undefined && colobj.s != undefined && colobj.b != undefined) {
			var hsla = hsbaToHsla(fixHSBA(colobj));
			return "hsla("+hsla.h+","+hsla.s+"%,"+hsla.l+"%,"+hsla.a+")";
		} else if (typeof colobj == 'string') { //If colobj is a string: Trying to treat it as an hexadecimal, and, in case, return the hexadecimal (with #)
			if (colobj.indexOf('#') == 0) colobj = colobj.substring(1);
			if (isValidHex(colobj)) return "#" + colobj; //N.B. Is checked only if the hexadecimal is valid, but not if is a valid css hexadecimal color value!
			else return "#000000ff";
		} else return "rgb(0,0,0)";
	};
	//Converts a color object in a css color string
	var decodeFromCSS = function (colstr) {
		if (colstr === undefined) return {r:0, g:0, b:0, a:1};
		if (typeof colstr != 'string') colstr = colstr.toString();
		if (colstr.indexOf("rgb") != -1) {
			var elems = colstr.substring(colstr.indexOf("(")+1, colstr.indexOf(")")).split(",");
			return fixRGBA({r:parseInt(elems[0]), g:parseInt(elems[1]), b:parseInt(elems[2]), a:parseFloat(elems[3])});
		} else if (colstr.indexOf("hsl") != -1) {
			var elems = colstr.substring(colstr.indexOf("(")+1, colstr.indexOf(")")).split(",");
			return fixHSLA({h:parseFloat(elems[0]), s:parseFloat(elems[1]), l:parseFloat(elems[2]), a:parseFloat(elems[3])});
		} else { //Trying to treat the unidentified object as an hexadecimal string, and, in case, return the hexadecimal (without #)
			if (colstr.indexOf('#') == 0) colstr = colstr.substring(1);
			if (isValidHex(colstr)) return colstr; //N.B. Is checked only if the hexadecimal is valid, but not if is a valid css hexadecimal color value!
			else return "000000ff";
		}
	};
	//External accessible functions
	$.fn.extend({
		newColpick: colpickRmx.init,
		showColpick: colpickRmx.showPicker,
		hideColpick: colpickRmx.hidePicker,
		destroyColpick: colpickRmx.destroyPicker,
		setColpickColor: colpickRmx.setColor,
		getColpickColor: colpickRmx.getColor
	});
	$.extend({
		colpickRmx:{
			hexToRgba: hexToRgba,
			hexToHsba: hexToHsba,
			hexToHsla: hexToHsla,
			rgbaToHex: rgbaToHex,
			rgbaToHsba: rgbaToHsba,
			rgbaToHsla: rgbaToHsla,
			hsbaToHex: hsbaToHex,
			hsbaToRgba: hsbaToRgba,
			hsbaToHsla: hsbaToHsla,
			hslaToHex: hslaToHex,
			hslaToRgba: hslaToRgba,
			hslaToHsba: hslaToHsba,
			isValidHex: isValidHex,
			encodeToCSS: encodeToCSS,
			decodeFromCSS: decodeFromCSS
		}
	});
})(jQuery);
