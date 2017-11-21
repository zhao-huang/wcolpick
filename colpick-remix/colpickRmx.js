/*
Colpick RemiX - Color Picker

Copyright (C) 2017 Salvatore Peluso (Firestorm): fire-space.weebly.com
Dual licensed under GPL v3.0 and MIT licenses.

Based on Jose Vargas' Color Picker (https://github.com/josedvq/colpick-jQuery-Color-Picker) licensed under GPL and MIT license.

Description, how to use, and examples: fire-space.weebly.com/colpick-remix

Last Edit: 2017/11/21 19:21 Beta 2 TOPPO
*/



(function ($) {
	var colpickRmx = function () {
		var
			tpl = '<div class="colpickRmx"><div class="colpickRmx_color"><div class="colpickRmx_color_overlay1"><div class="colpickRmx_color_overlay2"><div class="colpickRmx_selector_outer"><div class="colpickRmx_selector_inner"></div></div></div></div></div><div class="colpickRmx_hue"><div class="colpickRmx_hue_outline"></div><div class="colpickRmx_hue_arrs"><div class="colpickRmx_hue_larr"></div><div class="colpickRmx_hue_rarr"></div></div></div><div class="colpickRmx_alpha"><div class="colpickRmx_alpha_outline"></div><div class="colpickRmx_alpha_overlay"></div><div class="colpickRmx_alpha_arrs"><div class="colpickRmx_alpha_darr"></div><div class="colpickRmx_alpha_uarr"></div></div></div><div class="colpickRmx_nc_color_checkerboard"></div><div class="colpickRmx_new_color"></div><div class="colpickRmx_current_color"></div><div class="colpickRmx_hex_field"><div class="colpickRmx_field_letter">#</div><input type="text" maxlength="8" size="6" /></div><div class="colpickRmx_rgb_r colpickRmx_field"><div class="colpickRmx_field_letter">R</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_rgb_g colpickRmx_field"><div class="colpickRmx_field_letter">G</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_rgb_b colpickRmx_field"><div class="colpickRmx_field_letter">B</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_hsb_h colpickRmx_field"><div class="colpickRmx_field_letter">H</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_hsb_s colpickRmx_field"><div class="colpickRmx_field_letter">S</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_hsb_b colpickRmx_field"><div class="colpickRmx_field_letter">B</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_alpha_field colpickRmx_field"><div class="colpickRmx_field_letter">A</div><input type="text" maxlength="3" size="3" /><div class="colpickRmx_field_arrs"><div class="colpickRmx_field_uarr"></div><div class="colpickRmx_field_darr"></div></div></div><div class="colpickRmx_submit"><div class="colpickRmx_tear"></div></div></div>',
			defaults = {
				flat: true, //If is "true", the color picker is displayed regardless.
				showEvent: 'click', //The event that shows the color picker (if flat is set to "true", this property is useless).
				enableAlpha: true, //Enable or disable alpha channel.
				variant: 'standard', //There are 3 variants: standard, small, extra-large.
				layout: 'full', //There are 3 types of layouts: full, rgbhex, hex.
				colorScheme: 'light--full', //There are 4 types of color schemes: light, dark, light--full, dark--full.
				compactLayout: false, //Switch between Normal and Compact layout.
				submit: true, //The 3 layouts have 2 sub-layouts for each: with submit button or without.
				readonlyFields: false, //Setup the readonly attribute to all fields.
				readonlyHexField: false, //Setup the readonly attribute only to hex field (only if it is "true").
				lightArrows: false, //ONLY FOR LIGHT COLOR SCHEME! Set the hue's and the alpha's arrows color to a light color (e.g. white).
				colorSelOutline: true, //Show or hide color selector's outline.
				hueOutline: true, //Show or hide hue's outline.
				alphaOutline: true, //Show or hide alpha's outline.
				colorOutline: true, //Show or hide color's outline.
				border: 1, //Width, in pixel, of the external border.
				color: '222222', //Default Selected Color: Visible in almost all themes.
				livePreview: true, //If is "true", the color is updated immediately when changing a parameter.
				polyfill: false, //If "true", the color picker is only activated when no native browser behavior is available.
				appendToBody: false, //If "true", force the color picker to append to body (only for "non flat" version).
				onLoaded: function() {},
				onBeforeShow: function() {},
				onShow: function () {},
				onHide: function () {},
				onDestroy: function () {},
				onChange: function () {},
				onSubmit: function () {}
			},
			//Fill the inputs of the plugin
			fillRGBFields = function  (hsba, cal) { //OKK
				var rgba = hsbaToRgba(hsba);
				$(cal).data('colpickRmx').fields
					.eq(1).val(rgba.r).end()
					.eq(2).val(rgba.g).end()
					.eq(3).val(rgba.b).end();
			},
			fillHSBFields = function  (hsba, cal) { //OKK
				$(cal).data('colpickRmx').fields
					.eq(4).val(Math.round(hsba.h)).end()
					.eq(5).val(Math.round(hsba.s)).end()
					.eq(6).val(Math.round(hsba.b)).end();
			},
			fillAlphaField = function (hsba, cal) { //OKK
				$(cal).data('colpickRmx').fields.eq(7).val(Math.round(hsba.a/255*100)).end();
			},
			fillHexField = function (hsba, cal) { //OKK
				if($(cal).data('colpickRmx').enableAlpha) $(cal).data('colpickRmx').fields.eq(0).val(hsbaToHex(hsba));
				else $(cal).data('colpickRmx').fields.eq(0).val(hsbaToHex(hsba).substring(0,6));
			},
			//Set the round selector position
			setSelector = function (hsba, cal) { //OKK
				var rgba = hsbaToRgba({h: hsba.h, s: 100, b: 100, a: 255});
				$(cal).data('colpickRmx').selector.css('backgroundColor', 'rgb('+rgba.r+','+rgba.g+','+rgba.b+')');
				$(cal).data('colpickRmx').selectorIndic.css({
					left: parseInt($(cal).data('colpickRmx').size * hsba.s/100, 10),
					top: parseInt($(cal).data('colpickRmx').size * (100-hsba.b)/100, 10)
				});
			},
			//Set the hue selector position
			setHue = function (hsba, cal) { //OKK
				$(cal).data('colpickRmx').hue.css('top', parseInt($(cal).data('colpickRmx').size - $(cal).data('colpickRmx').size * hsba.h/360, 10));
			},
			//Set the alpha selector position
			setAlpha = function (hsba, cal) { //OKK
				if($(cal).data('colpickRmx').enableAlpha) {
					$(cal).data('colpickRmx').alpha.css('left', parseInt($(cal).data('colpickRmx').size / 100 * (hsba.a / 255 * 100), 10));
				}
			},
			//Update the color of alpha bar with the choosen color
			setAlphaBarColor = function (col, cal) { //OKK
				if($(cal).data('colpickRmx').enableAlpha) {
					var rgba = hsbaToRgba(col);
					var begin = 'rgba('+rgba.r+','+rgba.g+','+rgba.b+',0)', end = 'rgba('+rgba.r+','+rgba.g+','+rgba.b+',1)';
					//Compatibility with IE 6-9
					var UA = navigator.userAgent.toLowerCase();
					var isIE = navigator.appName === 'Microsoft Internet Explorer';
					var IEver = isIE ? parseFloat( UA.match( /msie ([0-9]{1,}[\.0-9]{0,})/ )[1] ) : 0;
					var ngIE = ( isIE && IEver < 10 );
					if(ngIE) {
						$(cal).data('colpickRmx').alphaBar.attr('style','filter:progid:DXImageTransform.Microsoft.gradient(GradientType=1,startColorstr=0,endColorstr=#'+rgbaToHex(rgba).substring(0,6)+'); -ms-filter:"progid:DXImageTransform.Microsoft.gradient(GradientType=1,startColorstr=0,endColorstr=#'+rgbaToHex(rgba).substring(0,6)+')";');
					} else {
						$(cal).data('colpickRmx').alphaBar.attr('style','background:-webkit-linear-gradient(left,'+begin+' 0%,'+end+' 100%); background:-moz-linear-gradient(left,'+begin+' 0%,'+end+' 100%); background:-ms-linear-gradient(left,'+begin+' 0%,'+end+' 100%); background:-o-linear-gradient(left,'+begin+' 0%,'+end+' 100%); background:linear-gradient(to right,'+begin+' 0%,'+end+' 100%);');
					}
				}
			},
			//Set current and new colors
			setCurrentColor = function (hsba, cal) { //OKK
				var rgba = hsbaToRgba(hsba);
				$(cal).data('colpickRmx').currentColor.css('backgroundColor', 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+rgba.a/255+')');
			},
			setNewColor = function (hsba, cal) { //OKK
				var rgba = hsbaToRgba(hsba);
				$(cal).data('colpickRmx').newColor.css('backgroundColor', 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+rgba.a/255+')');
			},
			//Called when the new color is changed
			change = function (ev) { //OKK
				var cal = $(this).parent().parent(), col;
				if (this.parentNode.className.indexOf('_alpha') > 0) {
					cal.data('colpickRmx').color = col = {
						h: cal.data('colpickRmx').color.h,
						s: cal.data('colpickRmx').color.s,
						b: cal.data('colpickRmx').color.b,
						a: fixAlpha(parseInt(cal.data('colpickRmx').fields.eq(7).val()/100*255, 10))
					};
					fillAlphaField(col, cal.get(0));
					fillHexField(col, cal.get(0));
					setAlpha(col, cal.get(0));
					setNewColor(col, cal.get(0));
				} else {
					if (this.parentNode.className.indexOf('_hex') > 0) {
						cal.data('colpickRmx').color = col = hexToHsba(fixHex(this.value, cal));
						fillHexField(col, cal.get(0));
						fillRGBFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
						fillAlphaField(col, cal.get(0));
						setAlpha(col, cal.get(0));
					} else if (this.parentNode.className.indexOf('_hsb') > 0) {
						cal.data('colpickRmx').color = col = fixHSBA({
							h: parseInt(cal.data('colpickRmx').fields.eq(4).val(), 10),
							s: parseInt(cal.data('colpickRmx').fields.eq(5).val(), 10),
							b: parseInt(cal.data('colpickRmx').fields.eq(6).val(), 10),
							a: cal.data('colpickRmx').color.a
						});
						fillHSBFields(col, cal.get(0));
						fillRGBFields(col, cal.get(0));
						fillHexField(col, cal.get(0));
					} else {
						cal.data('colpickRmx').color = col = rgbaToHsba(fixRGBA({
							r: parseInt(cal.data('colpickRmx').fields.eq(1).val(), 10),
							g: parseInt(cal.data('colpickRmx').fields.eq(2).val(), 10),
							b: parseInt(cal.data('colpickRmx').fields.eq(3).val(), 10),
							a: cal.data('colpickRmx').color.a
						}));
						fillRGBFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
						fillHexField(col, cal.get(0));
					}
					setSelector(col, cal.get(0));
					setHue(col, cal.get(0));
					setAlphaBarColor(col, cal.get(0));
					setNewColor(col, cal.get(0));
				}

				if (cal.data('colpickRmx').enableAlpha) cal.data('colpickRmx').onChange.apply(cal.parent(), [col, hsbaToHex(col), hsbaToRgba(col), cal.data('colpickRmx').el, 0]);
				else {
					var rgba = hsbaToRgba(col);
					var hsb = {h:col.h, s:col.s, b:col.b}, rgb = {r:rgba.r, g:rgba.g, b:rgba.b}, hex = hsbaToHex(col).substring(0,6);
					cal.data('colpickRmx').onChange.apply(cal.parent(), [hsb, hex, rgb, cal.data('colpickRmx').el, 0]);
				}
			},
			//Change style on blur and on focus of inputs
			blur = function (ev) { //OKK AP
				$(this).parent().removeClass('colpickRmx_focus');
			},
			focus = function () { //OKK AP
				$(this).parent().parent().data('colpickRmx').fields.parent().removeClass('colpickRmx_focus');
				$(this).parent().addClass('colpickRmx_focus');
			},
			//Increment/decrement arrows functions
			downIncrement = function (ev) { //OKK
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var field = $(this).parent().find('input').focus();
				var current = {
					el: $(this).parent().addClass('colpickRmx_changing'),
					max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : (this.parentNode.className.indexOf('_alpha') > 0 ? 100 : 255)),
					y: ev.pageY,
					field: field,
					val: parseInt(field.val(), 10),
					preview: $(this).parent().parent().data('colpickRmx').livePreview
				};
				$(document).mouseup(current, upIncrement);
				$(document).mousemove(current, moveIncrement);
			},
			moveIncrement = function (ev) { //OKK AP
				ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val - ev.pageY + ev.data.y, 10))));
				if (ev.data.preview) {
					change.apply(ev.data.field.get(0), [true]);
				}
				return false;
			},
			upIncrement = function (ev) { //OKK AP
				change.apply(ev.data.field.get(0), [true]);
				ev.data.el.removeClass('colpickRmx_changing').find('input').focus();
				$(document).off('mouseup', upIncrement);
				$(document).off('mousemove', moveIncrement);
				return false;
			},
			//Alpha slider functions
			downAlpha = function (ev) { //OKK
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var current = {
					cal: $(this).parent(),
					x: $(this).offset().left,
					preview: $(this).parent().data('colpickRmx').livePreview
				};
				$(document).on('mouseup touchend',current,upAlpha);
				$(document).on('mousemove touchmove',current,moveAlpha);
				var pageX = ((ev.type == 'touchstart') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX );
				change.apply(
					current.cal.data('colpickRmx')
					.fields.eq(7).val(parseInt(100*Math.max(0,Math.min(current.cal.data('colpickRmx').size,(pageX - current.x)))/current.cal.data('colpickRmx').size, 10))
						.get(0),
					[true]
				);
				return false;
			},
			moveAlpha = function (ev) { //OKK
				if (ev.data.preview) { //If livePreview is false, update alpha only at down and up events.
					var pageX = ((ev.type == 'touchmove') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX );
					change.apply(
						ev.data.cal.data('colpickRmx')
						.fields.eq(7).val(parseInt(100*Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageX - ev.data.x)))/ev.data.cal.data('colpickRmx').size, 10))
							.get(0),
						[true]
					);
				}
				return false;
			},
			upAlpha = function (ev) { //OKK
				if (!ev.data.preview) { //If livePreview is false, update alpha only at down and up events.
					var pageX = ((ev.type == 'touchend') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX );
					change.apply(
						ev.data.cal.data('colpickRmx')
						.fields.eq(7).val(parseInt(100*Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageX - ev.data.x)))/ev.data.cal.data('colpickRmx').size, 10))
							.get(0),
						[true]
					);
				} else {
					fillAlphaField(ev.data.cal.data('colpickRmx').color, ev.data.cal.get(0));
				}
				$(document).off('mouseup touchend',upAlpha);
				$(document).off('mousemove touchmove',moveAlpha);
				return false;
			},
			//Hue slider functions
			downHue = function (ev) { //OKK AP
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var current = {
					cal: $(this).parent(),
					y: $(this).offset().top,
					preview: $(this).parent().data('colpickRmx').livePreview
				};
				$(document).on('mouseup touchend',current,upHue);
				$(document).on('mousemove touchmove',current,moveHue);
				var pageY = ((ev.type == 'touchstart') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY );
				change.apply(
					current.cal.data('colpickRmx')
					.fields.eq(4).val(parseInt(360*(current.cal.data('colpickRmx').size - Math.max(0,Math.min(current.cal.data('colpickRmx').size,(pageY - current.y))))/current.cal.data('colpickRmx').size, 10))
						.get(0),
					[true]
				);
				return false;
			},
			moveHue = function (ev) { //OKK AP
				if (ev.data.preview) { //If livePreview is false, update hue only at down and up events.
					var pageY = ((ev.type == 'touchmove') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY );
					change.apply(
						ev.data.cal.data('colpickRmx')
						.fields.eq(4).val(parseInt(360*(ev.data.cal.data('colpickRmx').size - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageY - ev.data.y))))/ev.data.cal.data('colpickRmx').size, 10))
							.get(0),
						[true]
					);
				}
				return false;
			},
			upHue = function (ev) { //OKK AP
				if (!ev.data.preview) { //If livePreview is false, update hue only at down and up events.
					var pageY = ((ev.type == 'touchend') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY );
					change.apply(
						ev.data.cal.data('colpickRmx')
						.fields.eq(4).val(parseInt(360*(ev.data.cal.data('colpickRmx').size - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageY - ev.data.y))))/ev.data.cal.data('colpickRmx').size, 10))
							.get(0),
						[true]
					);
				} else {
					fillRGBFields(ev.data.cal.data('colpickRmx').color, ev.data.cal.get(0));
					fillHexField(ev.data.cal.data('colpickRmx').color, ev.data.cal.get(0));
				}
				$(document).off('mouseup touchend',upHue);
				$(document).off('mousemove touchmove',moveHue);
				return false;
			},
			//Color selector functions
			downSelector = function (ev) { //OKK AP
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset(),
					preview: $(this).parent().data('colpickRmx').livePreview
				};
				$(document).on('mouseup touchend',current,upSelector);
				$(document).on('mousemove touchmove',current,moveSelector);
				var pageX, pageY;
				if(ev.type == 'touchstart') { pageX = ev.originalEvent.changedTouches[0].pageX; pageY = ev.originalEvent.changedTouches[0].pageY; }
				else { pageX = ev.pageX; pageY = ev.pageY; }
				change.apply(
					current.cal.data('colpickRmx').fields
					.eq(6).val(parseInt(100*(current.cal.data('colpickRmx').size - Math.max(0,Math.min(current.cal.data('colpickRmx').size,(pageY - current.pos.top))))/current.cal.data('colpickRmx').size, 10)).end()
					.eq(5).val(parseInt(100*(Math.max(0,Math.min(current.cal.data('colpickRmx').size,(pageX - current.pos.left))))/current.cal.data('colpickRmx').size, 10))
					.get(0),
					[true]
				);
				return false;
			},
			moveSelector = function (ev) { //OKK AP
				if (ev.data.preview) { //If livePreview is false, update values only at down and up events.
					var pageX, pageY;
					if(ev.type == 'touchmove') { pageX = ev.originalEvent.changedTouches[0].pageX; pageY = ev.originalEvent.changedTouches[0].pageY; }
					else { pageX = ev.pageX; pageY = ev.pageY; }
					change.apply(
						ev.data.cal.data('colpickRmx').fields
						.eq(6).val(parseInt(100*(ev.data.cal.data('colpickRmx').size - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageY - ev.data.pos.top))))/ev.data.cal.data('colpickRmx').size, 10)).end()
						.eq(5).val(parseInt(100*(Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageX - ev.data.pos.left))))/ev.data.cal.data('colpickRmx').size, 10))
						.get(0),
						[true]
					);
				}
				return false;
			},
			upSelector = function (ev) { //OKK AP
				if (!ev.data.preview) { //If livePreview is false, update values only at down and up events.
					var pageX, pageY;
					if(ev.type == 'touchend') { pageX = ev.originalEvent.changedTouches[0].pageX; pageY = ev.originalEvent.changedTouches[0].pageY; }
					else { pageX = ev.pageX; pageY = ev.pageY; }
					change.apply(
						ev.data.cal.data('colpickRmx').fields
						.eq(6).val(parseInt(100*(ev.data.cal.data('colpickRmx').size - Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageY - ev.data.pos.top))))/ev.data.cal.data('colpickRmx').size, 10)).end()
						.eq(5).val(parseInt(100*(Math.max(0,Math.min(ev.data.cal.data('colpickRmx').size,(pageX - ev.data.pos.left))))/ev.data.cal.data('colpickRmx').size, 10))
						.get(0),
						[true]
					);
				} else {
					fillRGBFields(ev.data.cal.data('colpickRmx').color, ev.data.cal.get(0));
					fillHexField(ev.data.cal.data('colpickRmx').color, ev.data.cal.get(0));
				}
				$(document).off('mouseup touchend',upSelector);
				$(document).off('mousemove touchmove',moveSelector);
				return false;
			},
			//Submit button
			clickSubmit = function (ev) { //OKK
				var cal = $(this).parent();
				var col = cal.data('colpickRmx').color;
				cal.data('colpickRmx').origColor = cloneColor(col);
				setCurrentColor(col, cal.get(0));

				if (cal.data('colpickRmx').enableAlpha) cal.data('colpickRmx').onSubmit(col, hsbaToHex(col), hsbaToRgba(col), cal.data('colpickRmx').el);
				else {
					var rgba = hsbaToRgba(col);
					var hsb = {h:col.h, s:col.s, b:col.b}, rgb = {r:rgba.r, g:rgba.g, b:rgba.b}, hex = hsbaToHex(col).substring(0,6);
					cal.data('colpickRmx').onSubmit(hsb, hex, rgb, cal.data('colpickRmx').el);
				}
			},
			//Restore original color by clicking on current color
			restoreOriginal = function () { //OKK
				var cal = $(this).parent();
				var col = cloneColor(cal.data('colpickRmx').origColor);
				cal.data('colpickRmx').color = col;
				//Reapplies current color to all elements
				fillHexField(col, cal.get(0));
				fillRGBFields(col, cal.get(0));
				fillHSBFields(col, cal.get(0));
				fillAlphaField(col, cal.get(0));
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setAlpha(col, cal.get(0));
				setAlphaBarColor(col, cal.get(0));
				setNewColor(col, cal.get(0));

				if (cal.data('colpickRmx').enableAlpha) cal.data('colpickRmx').onChange.apply(cal.parent(), [col, hsbaToHex(col), hsbaToRgba(col), cal.data('colpickRmx').el, 0]);
				else {
					var rgba = hsbaToRgba(col);
					var hsb = {h:col.h, s:col.s, b:col.b}, rgb = {r:rgba.r, g:rgba.g, b:rgba.b}, hex = hsbaToHex(col).substring(0,6);
					cal.data('colpickRmx').onChange.apply(cal.parent(), [hsb, hex, rgb, cal.data('colpickRmx').el, 0]);
				}
			},
			//Fix the values if the user enters a negative or high value
			fixHSBA = function (hsba) { //OKK
				if (hsba.a === undefined) hsba.a = 255;
				return {
					h: Math.min(360, Math.max(0, hsba.h)),
					s: Math.min(100, Math.max(0, hsba.s)),
					b: Math.min(100, Math.max(0, hsba.b)),
					a: Math.min(255, Math.max(0, hsba.a))
				};
			},
			fixRGBA = function (rgba) { //OKK
				if (rgba.a === undefined) rgba.a = 255;
				return {
					r: Math.min(255, Math.max(0, rgba.r)),
					g: Math.min(255, Math.max(0, rgba.g)),
					b: Math.min(255, Math.max(0, rgba.b)),
					a: Math.min(255, Math.max(0, rgba.a))
				};
			},
			fixAlpha = function (alpha) { //OKK
				return Math.min(255, Math.max(0, alpha));
			},
			fixHex = function (hex, cal) { //OKK
				if (!cal.data('colpickRmx').enableAlpha) {
					if (hex.length == 4) hex = hex.substring(0,3);
					if (hex.lenght == 8) hex = hex.substring(0,6);
				}
				return hex;
			},
			//Clone hsba object
			cloneColor = function (col) { //OKK
				return {h:col.h, s:col.s, b:col.b, a:col.a};
			}
			//Show/hide the color picker
			show = function (ev) { //OKK AP
				if(ev) {
					// Prevent the trigger of any direct parent
					ev.stopPropagation();
				}
				var cal = $('#' + $(this).data('colpickRmxId'));

				//Trying to access to a variable (e.g. color)
				try { var temp = cal.data('colpickRmx').color; }
				catch (e) {
					//If an error is generated: abort showing!
					//window.alert("Failed to show color picker! Probably it was destroyed!"); //If you want to show this error message, uncomment this line.
					return;
				}

				if (ev && !cal.data('colpickRmx').polyfill) {
					ev.preventDefault();
				}
				cal.data('colpickRmx').onBeforeShow.apply(this, [cal.get(0), cal.data('colpickRmx').el]);

				if(cal.data('colpickRmx').flat){ //If flat is true, simply shows the color picker!
					if (cal.data('colpickRmx').onShow.apply(this, [cal.get(0), cal.data('colpickRmx').el]) != false) {
						cal.show();
					}
					return;
				}

				//Position the color picker
				var pos;
				if (cal.data('colpickRmx').appendedToBody) { pos = $(this).offset(); } else { pos = $(this).position(); }
				var top = pos.top + this.offsetHeight;
				var left = pos.left;
				//Fix if the color picker is showing outside of viewport
				if (outOfViewportHeight(cal, $(this), this) && $(this).offset().top - $(window).scrollTop() >= cal.outerHeight()) {
					top -= (cal.outerHeight() + this.offsetHeight);
				}
				if (outOfViewportWidth(cal, $(this), this)) {
					if ($(this).offset().left - $(window).scrollLeft() + this.offsetWidth >= cal.outerWidth()) {
						left -= (cal.outerWidth() - this.offsetWidth);
					} else {
						var leftMargin = $(this).offset().left - $(window).scrollLeft();
						var outWidth = leftMargin + cal.outerWidth() - $(window).width();
						if (leftMargin > outWidth) { left -= outWidth; } else { left -= leftMargin; }
					}
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
			hide = function (ev) { //OKK AP
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
			outOfViewportHeight = function (cal, wrapEl, domEl) { //OKK AP
				var calViewTop = wrapEl.offset().top - $(window).scrollTop() + domEl.offsetHeight; //Top of the color picker in viewport
				var calHeight = cal.outerHeight(); //Height of the color picker
				var viewHeight = $(window).height(); //Viewport height
				return (calViewTop + calHeight > viewHeight);
			},
			outOfViewportWidth = function (cal, wrapEl, domEl) { //OKK AP
				var calViewLeft = wrapEl.offset().left - $(window).scrollLeft(); //Left of the color picker in viewport
				var calWidth = cal.outerWidth(); //Width of the color picker
				var viewWidth = $(window).width(); //Viewport width
				return (calViewLeft + calWidth > viewWidth);
			},
			//Generate a random unique id
			getUniqueID = (function () { //OKK AP
				var cnt = parseInt(Math.random() * 10000);
				return function () {
					cnt += 1;
					return cnt;
				};
			})();
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt||{});
				//Set color
				if (typeof opt.color == 'string') {
					opt.color = hexToHsba(opt.color);
				} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
					opt.color = rgbaToHsba(opt.color);
				} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
					opt.color = fixHSBA(opt.color);
				} else {
					return this;
				}

				//For each selected DOM element
				return this.each(function () {
					//If the element does not have an ID
					if (!$(this).data('colpickRmxId')) {
						var options = $.extend({}, opt);
						options.origColor = cloneColor(opt.color);

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

						//Setup size of the selected variant (Add other "else-if" for other future variants)
						if (options.variant == 'small') {
							options.size = 160; //Small Version!
						} else if (options.variant == 'extra-large') {
							options.size = 300; //Extra Large Version!
						} else {
							options.size = 225; //Standard Version!
						}

						//Loading the choosen layout
						switch (options.variant) { //Switching between the 3 variants
							case 'small': //Add class according to layout (small)
								cal.addClass('colpickRmxS colpickRmxS_'+options.layout+(options.submit?'':' colpickRmxS_'+options.layout+'_ns'));
								//Enable or disable alpha channel
								if(!options.enableAlpha){cal.addClass('colpickRmxS_noalpha colpickRmxS_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmxS_'+options.layout+'_noalpha_ns'));}
								break;
							case 'extra-large': //Add class according to layout (extra-large)
								cal.addClass('colpickRmxXL colpickRmxXL_'+options.layout+(options.submit?'':' colpickRmxXL_'+options.layout+'_ns'));
								//Enable or disable alpha channel
								if(!options.enableAlpha){cal.addClass('colpickRmxXL_noalpha colpickRmxXL_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmxXL_'+options.layout+'_noalpha_ns'));}
								break;
							default: //Add class according to layout (default -> standard)
								cal.addClass('colpickRmx_'+options.layout+(options.submit?'':' colpickRmx_'+options.layout+'_ns'));
								//Enable or disable alpha channel
								if(!options.enableAlpha){cal.addClass('colpickRmx_noalpha colpickRmx_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmx_'+options.layout+'_noalpha_ns'));}
								break;
						}

						//Loading Compact layout, if requested
						if(options.compactLayout) {
							switch (options.variant) { //Switching between the 3 variants
								case 'small': //Add class according to layout (small)
									cal.addClass('colpickRmxS_compact colpickRmxS_compact_'+options.layout+(options.submit?'':' colpickRmxS_compact_'+options.layout+'_ns'));
									//Enable or disable alpha channel
									if(!options.enableAlpha){cal.addClass('colpickRmxS_compact_noalpha colpickRmxS_compact_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmxS_compact_'+options.layout+'_noalpha_ns'));}
									break;
								case 'extra-large': //Add class according to layout (extra-large)
									cal.addClass('colpickRmxXL_compact colpickRmxXL_compact_'+options.layout+(options.submit?'':' colpickRmxXL_compact_'+options.layout+'_ns'));
									//Enable or disable alpha channel
									if(!options.enableAlpha){cal.addClass('colpickRmxXL_compact_noalpha colpickRmxXL_compact_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmxXL_compact_'+options.layout+'_noalpha_ns'));}
									break;
								default: //Add class according to layout (default -> standard)
									cal.addClass('colpickRmx_compact colpickRmx_compact_'+options.layout+(options.submit?'':' colpickRmx_compact_'+options.layout+'_ns'));
									//Enable or disable alpha channel
									if(!options.enableAlpha){cal.addClass('colpickRmx_compact_noalpha colpickRmx_compact_'+options.layout+'_noalpha'+(options.submit?'':' colpickRmx_compact_'+options.layout+'_noalpha_ns'));}
									break;
							}
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
						if(options.lightArrows){cal.addClass('colpickRmx_lightHueArrs');}
						//Hide outlines, if requested
						if(!options.colorSelOutline){cal.addClass('colpickRmx_noCSOutline');}
						if(!options.hueOutline){cal.addClass('colpickRmx_noHOutline');}
						if(!options.alphaOutline){cal.addClass('colpickRmx_noAOutline');}
						if(!options.colorOutline){cal.addClass('colpickRmx_noNCOutline');}

						//Set border width
						cal.css('border-width', options.border +'px');

						//Setup submit button
						cal.find('div.colpickRmx_submit').click(clickSubmit);
						//Setup input fields
						options.fields = cal.find('input').change(change).blur(blur).focus(focus);
						//If alpha channel is disabled, set hex field maxlength to 6
						if(!options.enableAlpha){options.fields.eq(0).prop('maxlength', 6);}
						//Setup readonly attribute to fields
						options.fields.eq(0).prop('readonly', options.readonlyFields);
						options.fields.eq(1).prop('readonly', options.readonlyFields);
						options.fields.eq(2).prop('readonly', options.readonlyFields);
						options.fields.eq(3).prop('readonly', options.readonlyFields);
						options.fields.eq(4).prop('readonly', options.readonlyFields);
						options.fields.eq(5).prop('readonly', options.readonlyFields);
						options.fields.eq(6).prop('readonly', options.readonlyFields);
						options.fields.eq(7).prop('readonly', options.readonlyFields);
						if(options.readonlyHexField){options.fields.eq(0).prop('readonly', options.readonlyHexField);}
						//Setup restoreOriginal to current color's click event
						cal.find('div.colpickRmx_field_arrs').mousedown(downIncrement).end().find('div.colpickRmx_current_color').click(restoreOriginal);
						//Setup hue selector
						options.selector = cal.find('div.colpickRmx_color').on('mousedown touchstart',downSelector);
						options.selectorIndic = options.selector.find('div.colpickRmx_selector_outer');
						//Store parts of the plugin
						options.el = this;
						options.hue = cal.find('div.colpickRmx_hue_arrs');
						options.alpha = cal.find('div.colpickRmx_alpha_arrs');
						options.alphaBar = cal.find('div.colpickRmx_alpha_overlay');
						var huebar = options.hue.parent();
						//Paint the hue bar
						var stops = ['#ff0000','#ff0080','#ff00ff','#8000ff','#0000ff','#0080ff','#00ffff','#00ff80','#00ff00','#80ff00','#ffff00','#ff8000','#ff0000'];
						//Compatibility with IE 6-9
						var UA = navigator.userAgent.toLowerCase();
						var isIE = navigator.appName === 'Microsoft Internet Explorer';
						var IEver = isIE ? parseFloat( UA.match( /msie ([0-9]{1,}[\.0-9]{0,})/ )[1] ) : 0;
						var ngIE = ( isIE && IEver < 10 );
						if(ngIE) {
							var i, div;
							for(i=0; i<=11; i++) {
								div = $('<div></div>').attr('style','height:8.333333%; filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+',endColorstr='+stops[i+1]+'); -ms-filter:"progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+',endColorstr='+stops[i+1]+')";');
								huebar.append(div);
							}
						} else {
							var stopList = stops.join(',');
							huebar.attr('style','background:-webkit-linear-gradient(top,'+stopList+'); background:-moz-linear-gradient(top,'+stopList+'); background:-ms-linear-gradient(top,'+stopList+'); background:-o-linear-gradient(top,'+stopList+'); background:linear-gradient(to bottom,'+stopList+');');
						}
						//Set remaining events, new, and current color
						cal.find('div.colpickRmx_hue').on('mousedown touchstart',downHue);
						cal.find('div.colpickRmx_alpha').on('mousedown touchstart',downAlpha);
						options.newColor = cal.find('div.colpickRmx_new_color');
						options.currentColor = cal.find('div.colpickRmx_current_color');
						//Store options
						cal.data('colpickRmx', options);
						//Fill with default color
						fillRGBFields(options.color, cal.get(0));
						fillHSBFields(options.color, cal.get(0));
						fillHexField(options.color, cal.get(0));
						setHue(options.color, cal.get(0));
						setAlpha(options.color, cal.get(0)); //ALPHAAA
						setAlphaBarColor(options.color, cal.get(0)); //Colora la barra alpha col colore scelto
						fillAlphaField(options.color, cal.get(0)); //Riempie il campo input alpha
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
							cal.data('colpickRmx').appendedToBody = options.appendToBody;
							if (!options.appendToBody) { cal.appendTo($(this).parent()); } else { cal.appendTo(document.body); }
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
			showPicker: function() { //OKK AP
				return this.each( function () {
					if ($(this).data('colpickRmxId')) {
						show.apply(this);
					}
				});
			},
			//Hides the picker
			hidePicker: function() { //OKK AP
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
						col = hexToHsba(col);
					} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
						col = rgbaToHsba(col);
					} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
						col = fixHSBA(col);
					} else {
						return this;
					}
					return this.each(function(){
						if ($(this).data('colpickRmxId')) {
							var cal = $('#' + $(this).data('colpickRmxId'));
							cal.data('colpickRmx').color = col;
							cal.data('colpickRmx').origColor = cloneColor(col);
							fillRGBFields(col, cal.get(0));
							fillHSBFields(col, cal.get(0));
							fillHexField(col, cal.get(0));
							setHue(col, cal.get(0));
							setSelector(col, cal.get(0));
							setNewColor(col, cal.get(0));
							cal.data('colpickRmx').onChange.apply(cal.parent(), [col, hsbaToHex(col), hsbaToRgba(col), cal.data('colpickRmx').el, 1]);
							if(setCurrent) {
								setCurrentColor(col, cal.get(0));
							}
						}
					});
				}
			},
			destroy: function() { //OKK AP
				var cal = $('#' + $(this).data('colpickRmxId'));
				cal.data('colpickRmx').onDestroy(cal.get(0), cal.data('colpickRmx').el);
				$('html').off('mousedown', hide);
				//Destroying picker
				cal.remove();
			},
			getCurrentColor: function() { //OKK
				var cal = $('#' + $(this).data('colpickRmxId'));
				return cloneColor(cal.data('colpickRmx').origColor);
			}
		};
	}();
	//Color space convertions
	var hexToRgba = function (hex) { //OKK
		if (hex.indexOf('#') == 0) hex = hex.substring(1);
		if (hex.length == 3) hex = hex.substring(0,1) + hex.substring(0,1) + hex.substring(1,2) + hex.substring(1,2) + hex.substring(2,3) + hex.substring(2,3) + "ff";
		else if (hex.length == 4) hex = hex.substring(0,1) + hex.substring(0,1) + hex.substring(1,2) + hex.substring(1,2) + hex.substring(2,3) + hex.substring(2,3) + hex.substring(3,4) + hex.substring(3,4);
		else if (hex.length == 6) hex = hex + "ff";
		else if (hex.length != 8) hex = "000000ff";
		if (!isValidHex(hex)) hex = "000000ff";
		var hexI = parseInt(hex , 16);
		var rgba = {r: hexI >>> 24, g: (hexI & 0x00FF0000) >>> 16, b: (hexI & 0x0000FF00) >>> 8, a: (hexI & 0x000000FF)};
		return rgba;
	};
	var hexToHsba = function (hex) { //OKK
		return rgbaToHsba(hexToRgba(hex));
	};
	var rgbaToHsba = function (rgba) { //OKK
		if (rgba.a === undefined) rgba.a = 255;
		var hsba = {h: 0, s: 0, b: 0, a: rgba.a};
		var min = Math.min(rgba.r, rgba.g, rgba.b);
		var max = Math.max(rgba.r, rgba.g, rgba.b);
		var delta = max - min;
		hsba.b = max;
		hsba.s = max != 0 ? 255 * delta / max : 0;
		if (hsba.s != 0) {
			if (rgba.r == max) hsba.h = (rgba.g - rgba.b) / delta;
			else if (rgba.g == max) hsba.h = 2 + (rgba.b - rgba.r) / delta;
			else hsba.h = 4 + (rgba.r - rgba.g) / delta;
		} else hsba.h = -1;
		hsba.h *= 60;
		if (hsba.h < 0) hsba.h += 360;
		hsba.s *= 100/255;
		hsba.b *= 100/255;
		return hsba;
	};
	var hsbaToRgba = function (hsba) { //OKK
		if (hsba.a === undefined) hsba.a = 255;
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
	var rgbaToHex = function (rgba) { //OKK
		if (rgba.a === undefined) rgba.a = 255;
		var hex = [
			rgba.r.toString(16),
			rgba.g.toString(16),
			rgba.b.toString(16),
			parseInt(rgba.a).toString(16)
		];
		$.each(hex, function (nr, val) {
			if (val.length == 1) {
				hex[nr] = '0' + val;
			}
		});
		return hex.join('');
	};
	var hsbaToHex = function (hsba) { //OKK
		return rgbaToHex(hsbaToRgba(hsba));
	};
	//Check if a string is a valid hexadecimal string
	var isValidHex = function (hex) { //OKK
		while (hex.indexOf('0') == 0) {
			hex = hex.substring(1);
		}
		if(hex == "") hex = "0";
		return (parseInt(hex,16).toString(16) === hex.toLowerCase());
	};
	//External accessible functions
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
			rgbaToHex: rgbaToHex,
			rgbaToHsba: rgbaToHsba,
			hsbaToHex: hsbaToHex,
			hsbaToRgba: hsbaToRgba,
			hexToHsba: hexToHsba,
			hexToRgba: hexToRgba,
			isValidHex: isValidHex
		}
	});
})(jQuery);
