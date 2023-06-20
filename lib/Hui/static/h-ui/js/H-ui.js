/*-----------H-ui前端框架-------------
* H-ui.min.js v3.2.1
/*
Includes：
jQuery.IEMobileHack.js
jQuery.cookie.js v1.4.1
jQuery.form.js v3.51.0
jQuery.lazyload.js v1.9.3
jQuery.responsive-nav.js v1.0.39
jQuery.placeholder.js
jQuery.emailsuggest.js v1.0
jQuery.format.js
jQuery.togglePassword.js
jQuery.iCheck.js
jQuery.raty.js v2.4.5
jQuery.onePageNav.js
jQuery.stickUp.js
jQuery.ColorPicker.js

jQuery.HuiaddFavorite.js
jQuery.Huisethome.js
jQuery.Huisidenav.js
jQuery.Huihover.js v2.0
jQuery.Huifocusblur.js V2.0
jQuery.Huiselect.js
jQuery.Huitab.js v2.0.1
jQuery.Huifold.js v2.0
jQuery.Huitags.js v2.0
jQuery.Huitagsmixed.js
jQuery.Huitextarealength.js v2.0
jQuery.Huipreview.js v2.1
jQuery.Huimodalalert.js
jQuery.Huialert.js
jQuery.Huitotop.js v2.0
jQuery.Huimarquee.js
jQuery.Huispinner.js v2.0
jQuery.Huiloading.js v1.0
jQuery.HuicheckAll.js v1.0

Bootstrap.modal.js v3.3.0
Bootstrap.dropdown.js v3.3.0
Bootstrap.transition.js v3.3.0
Bootstrap.tooltip.js v3.3.0
Bootstrap.popover.js v3.3.0
Bootstrap.alert.js v3.3.0
Bootstrap.slider.js v1.0.1
Bootstrap.datetimepicker.js
Bootstrap.Switch v1.3

*/
/* =======================================================================
 * jQuery.IEMobileHack.js判断浏览器
 * ======================================================================== */
!function(){
	if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
		var msViewportStyle = document.createElement("style");
		msViewportStyle.appendChild(
			document.createTextNode(
				"@-ms-viewport{width:auto!important}"
			)
		);
		document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
	}
} ();

/* =======================================================================
 * jQuery.stopDefault.js 阻止默认浏览器动作
 * ======================================================================== */
function stopDefault(e) {
	if (e && e.preventDefault) e.preventDefault();
	//IE中阻止函数器默认动作的方式
	else window.event.returnValue = false;
	return false;
}

/* =======================================================================
 * jQuery.cookie.js v1.4.1
 * https://github.com/carhartl/jQuery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 * ======================================================================== */
!(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}
(function($){
	var pluses = /\+/g;
	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}
	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}
	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}
	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}
	function read(s, converter) {
		var value = config.raw ? s: parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}
	var config = $.cookie = function(key, value, options) {
		// Write
		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({},
			config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires,
				t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
			options.path ? '; path=' + options.path: '', options.domain ? '; domain=' + options.domain: '', options.secure ? '; secure': ''].join(''));
		}
		// Read
		var result = key ? undefined: {},
		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		cookies = document.cookie ? document.cookie.split('; ') : [],
		i = 0,
		l = cookies.length;
		for (; i < l; i++) {
			var parts = cookies[i].split('='),
			name = decode(parts.shift()),
			cookie = parts.join('=');
			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}
			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}
		return result;
	};
	config.defaults = {};
	$.removeCookie = function(key, options) {
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({},
		options, {
			expires: -1
		}));
		return ! $.cookie(key);
	};
}));

/* =======================================================================
 * jquery.HuiaddFavorite.js 添加收藏
 * <a title="收藏本站" href="javascript:;" onClick="addFavoritepage('H-ui前端框架','http://www.h-ui.net/');">收藏本站</a>
 * function shoucang(name,site){
	$.addFavorite({
		name:name,
		site:site,
	});
 * ========================================================================*/
function HuiaddFavorite(obj) {
	obj.site = obj.site || window.location.href;
	obj.name = obj.name || document.title;
	try {
		window.external.addFavorite(obj.site, obj.name);
	} catch(e) {
		try {
			window.sidebar.addPanel(name, site, "");
		} catch(e) {
      $("body").Huimodalalert({
        content: '加入收藏失败，请使用Ctrl+D进行添加',
        speed: 2000,
      });
		}
	}
}

/* ========================================================================
 * jQuery.Huisethome.js 设为首页
 * ======================================================================== */
function Huisethome(obj){
	try{
		obj.style.behavior="url(#default#homepage)";
		obj.setHomePage(webSite);
	}
	catch(e){
		if(window.netscape){
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				}
			catch(e){
        $("body").Huimodalalert({
          content: "此操作被浏览器拒绝！\n请在浏览器地址栏输入\"about:config\"并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。",
          speed: 2000,
        });
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			prefs.setCharPref('browser.startup.homepage',url);
		}
	}
}

/* =======================================================================
 * jQuery.Huisidenav.js 左侧菜单-隐藏显示
 * ======================================================================== */
function displaynavbar(obj){
	if($(obj).hasClass("open")){
		$(obj).removeClass("open");
		$("body").removeClass("big-page");
	} else {
		$(obj).addClass("open");
		$("body").addClass("big-page");
	}
}

/* =======================================================================
 * jQuery.Huihover.js v2.0 Huihover
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.05.05
 *
 * Copyright 2017 北京颖杰联创科技有限公司 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huihover = function(options){
		var defaults = {
			className:"hover",
		}
		var options = $.extend(defaults, options);
		this.each(function(){
			var that = $(this);
			that.hover(function() {
				that.addClass(options.className);
			},
			function() {
				that.removeClass(options.className);
			});
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huifocusblur.js v2.0 得到失去焦点
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.05.09
 *
 * Copyright 2017 北京颖杰联创科技有限公司 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huifocusblur = function(options){
		var defaults = {
			className:"focus",
		}
		var options = $.extend(defaults, options);
		this.each(function(){
			var that = $(this);
			that.focus(function() {
				that.addClass(options.className).removeClass("inputError");
			});
			that.blur(function() {
				that.removeClass(options.className);
			});
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huiselect.js 选择
 * ========================================================================*/
!function($) {
	$.Huiselect = function(divselectid, inputselectid) {
		var inputselect = $(inputselectid);
		$(divselectid + " cite").click(function() {
			var ul = $(divselectid + " ul");
			ul.slideToggle();
		});
		$(divselectid + " ul li a").click(function() {
			var txt = $(this).text();
			$(divselectid + " cite").html(txt);
			var value = $(this).attr("selectid");
			inputselect.val(value);
			$(divselectid + " ul").hide();
		});
		$(document).click(function() {
			$(divselectid + " ul").hide();
		});
	};
} (window.jQuery);

/* =======================================================================
 * jQuery.Huitab.js v2.0.1 选项卡
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.10.10
 *
 * Copyright 2017 北京颖杰联创科技有限公司 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huitab = function(options, callback){
		var defaults = {
			tabBar:'.tabBar span',
			tabCon:".tabCon",
			className:"current",
			tabEvent:"click",
			index:0
		}
		var options = $.extend(defaults, options);
		this.each(function(){
			var that = $(this);
			that.find(options.tabBar).removeClass(options.className);
			that.find(options.tabBar).eq(options.index).addClass(options.className);
			that.find(options.tabCon).hide();
			that.find(options.tabCon).eq(options.index).show();

            that.find(options.tabBar).on(options.tabEvent, function () {
                var oldIndex = that.find('.tabBar .' + options.className).index();
				that.find(options.tabBar).removeClass(options.className);
				$(this).addClass(options.className);
				var index = that.find(options.tabBar).index(this);
				that.find(options.tabCon).hide();
				that.find(options.tabCon).eq(index).show();
				if (callback) {
					callback(oldIndex,index);
				}
			});
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huifold.js v2.1 折叠
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2012.10.12
 * Copyright 2017-2020 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huifold = function(options){
		var defaults = {
			item: '.item',
			titCell:'.Huifold-header',
			mainCell:'.Huifold-body',
			type:1,//1	只打开一个，可以全部关闭;2	必须有一个打开;3	可打开多个
			trigger:'click',
			className:"selected",
			speed:'normal',
			openKeys: []
		}
		var options = $.extend(defaults, options);
		this.each(function() {
			var that = $(this);
			if(options.openKeys && options.openKeys.length > 0) {
				for(var i=0;i<options.openKeys.length; i++) {
					
					var $item = that.find(options.item).eq(options.openKeys[i]);
					$item.find(options.titCell).addClass(options.className);
					$item.find(options.mainCell).show();
					if ($item.find(options.titCell).find("b")) {
						$item.find(options.titCell).find("b").html("-");
					}
				}
			}

			that.find(options.titCell).on(options.trigger,function(){
				if ($(this).next().is(":visible")) {
					if (options.type == 2) {
						return false;
					} else {
						$(this).next().slideUp(options.speed).end().removeClass(options.className);
						if ($(this).find("b")) {
							$(this).find("b").html("+");
						}
					}
				}else {
					if (options.type == 3) {
						$(this).next().slideDown(options.speed).end().addClass(options.className);
						if ($(this).find("b")) {
							$(this).find("b").html("-");
						}
					} else {
						that.find(options.mainCell).slideUp(options.speed);
						that.find(options.titCell).removeClass(options.className);
						if (that.find(options.titCell).find("b")) {
							that.find(options.titCell).find("b").html("+");
						}
						$(this).next().slideDown(options.speed).end().addClass(options.className);
						if ($(this).find("b")) {
							$(this).find("b").html("-");
						}
					}
				}
			});
			
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huitags.js v2.0 标签
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.05.10
 *
 * Copyright 2017 北京颖杰联创科技有限公司 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huitags = function(options) {
		var defaults = {
			value:'Hui前端框架,H-ui,辉哥',
			maxlength : 20,
			number : 5,
			tagsDefault : ["Html","CSS","JS"],
		}
		var options = $.extend(defaults, options);
		var keyCodes = {
			Enter : 13,
			Enter2 : 108,
			Spacebar:32
		}
		this.each(function(){
			var that = $(this);
			var str =
			'<div class="Huitags-wraper">'+
				'<div class="Huitags-editor cl"></div>'+
				'<div class="Huitags-input-wraper">'+
					'<input type="text" class="input-text Huitags-input" maxlength="'+options.maxlength+'" value="">'+
				'</div>'+
				'<div class="Huitags-list">'+
					'<div class="Huitags-notag" style="display:none">暂无常用标签</div>'+
					'<div class="Huitags-has"></div>'+
				'</div>'+
				'<input type="hidden" class="Huitags-val" name="" value="'+options.value+'">'+
			'</div>';
			that.append(str);
			var wraper = that.find(".Huitags-wraper");
			var editor = that.find(".Huitags-editor");
			var input =that.find(".Huitags-input");
			var list = that.find(".Huitags-list");
			var has = that.find(".Huitags-has");
			var val = that.find(".Huitags-val");



			if(options.tagsDefault){
				var tagsDefaultLength = (options.tagsDefault).length;
				for(var i = 0;i< tagsDefaultLength; i++){
					has.append('<span>'+options.tagsDefault[i]+'</span>');
				}
				has.find("span").on('click',function(){
					var taghasV = $(this).text();
					taghasV=taghasV.replace(/(^\s*)|(\s*$)/g,"");
					editor.append('<span class="Huitags-token">'+taghasV+'</span>');
					gettagval(this);
					$(this).remove();
				});
			}

			function gettagval(obj) {
				var str = "";
				var token = that.find(".Huitags-token");
				if (token.length < 1) {
					input.val("");
					return false;
				}
				for (var i = 0; i < token.length; i++) {
					str += token.eq(i).text() + ",";
				}
				str = unique(str, 1);
				str=str.join();
				val.val(str);
			}
			/*将字符串逗号分割成数组并去重*/
			function unique(o, type){
				//去掉前后空格
				o=o.replace(/(^\s*)|(\s*$)/g,"");
				if(type == 1) {
					//把所有的空格和中文逗号替换成英文逗号
					o=o.replace(/(\s)|(，)/g, ",");
				} else {
					//把所有的中文逗号替换成英文逗号
					o=o.replace(/(，)/g, ",");
				}
				//去掉前后英文逗号
				o=o.replace(/^,|,$/g, "");
				//去重连续的英文逗号
				o=o.replace(/,+/g,',');
				o=o.split(",");
				var n = [o[0]]; //结果数组
				for(var i = 1; i < o.length; i++){
					if (o.indexOf(o[i]) == i) {
						if(o[i] == "")
							continue;
						n.push(o[i]);
					}
				}
				return n;
			}

			input.on("keydown",function(e){
				var evt = e || window.event;
				if (evt.keyCode == keyCodes.Enter || evt.keyCode == keyCodes.Enter2 || evt.keyCode == keyCodes.Spacebar) {
					var v = input.val().replace(/\s+/g, "");
					var reg = /^,|,$/gi;
					v = v.replace(reg, "");
					v = $.trim(v);
					if (v != '') {
						input.change();
					}else{
						return false;
					}
				}
			});

			input.on("change",function(){
				var v1 = input.val();
				var v2 = val.val();
				var v = v2+','+v1;
				if(v!=''){
					var str='<i class="Huitags-icon Hui-iconfont">&#xe64b;</i>';
					var result = unique(v, 1);
					if(result.length>0){
						for(var j=0;j<result.length;j++){
							str+='<span class="Huitags-token">'+result[j]+'</span>';
						}
						val.val(result);
						editor.html(str);
						input.val("").blur();
					}
				}
			});

			$(document).on("click",".Huitags-token",function(){
				$(this).remove();
				var str ="";
				if(that.find(".Huitags-token").length<1){
					val.val("");
					return false;
				}else{
					for(var i = 0;i< that.find(".Huitags-token").length;i++){
						str += that.find(".Huitags-token").eq(i).text() + ",";
					}
					str = str.substring(0,str.length-1);
					val.val(str);
				}
			});
			input.change();
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huitagsmixed.js 标签混排效果
 * ========================================================================*/
!function($) {
	$.Huitagsmixed = function(obj) {
		$(obj).each(function() {
			var x = 9;
			var y = 0;
			var rand = parseInt(Math.random() * (x - y + 1) + y);
			$(this).addClass("tags" + rand);
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huitextarealength.js v2.0 字数限制
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.05.12
 *
 * Copyright 2017 北京颖杰联创科技有限公司 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huitextarealength = function(options){
		var defaults = {
			minlength:0,
			maxlength:140,
			errorClass:"error",
			exceed:true,
		}
		var options = $.extend(defaults, options);
		this.each(function(){
			var that = $(this);
			var v = that.val();
			var l = v.length;
			var str = '<p class="textarea-numberbar"><em class="textarea-length">'+l+'</em>/'+options.maxlength+'</p>';
			that.parent().append(str);

			that.on("keyup",function(){
				v = that.val();
				l = v.length;
				if (l > options.maxlength) {
					if(options.exceed){
						that.addClass(options.errorClass);
					}else{
						v = v.substring(0, options.maxlength);
						that.val(v);
						that.removeClass(options.errorClass);
					}
				}
				else if(l<options.minlength){
					that.addClass(options.errorClass);
				}else{
					that.removeClass(options.errorClass);
				}
				that.parent().find(".textarea-length").text(v.length);
			});

		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huipreview.js v2.1 图片预览
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.11.13
 *
 * Copyright 2017 北京颖杰联创科技有限公司 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function ($) {
	$.fn.Huipreview = function (options) {
		var defaults = {
			className: "active",
			bigImgWidth: 300,
		};
		var options = $.extend(defaults, options);
		this.each(function () {
			var that = $(this);
			var timer;
			that.hover(
				function () {
					clearTimeout(timer);
					timer = setTimeout(function () {
						$("#preview-wraper").remove();
						var smallImg = that.find("img").attr("src");
						var bigImg = that.attr('data-src');
						var bigImgW = that.attr('data-width');
						var bigImgH = that.attr('data-height');
						var winW = $(window).width();
						var winW5 = winW / 2;
						var imgT = that.parent().offset().top;
						var imgL = that.parent().offset().left;
						var imgW = that.parent().width();
						var imgH = that.parent().height();
						var ww = (imgL + imgW / 2);
						var tooltipLeft = "auto", tooltipRight = "auto";
						if (ww < winW5) {
							tooltipLeft = (imgW + imgL) + "px";
						} else {
							tooltipRight = (winW - imgL) + "px";
						}

						that.addClass(options.className);
						if (bigImg == '') {
							return false;
						} else {
							var tooltip_keleyi_com =
								'<div id="preview-wraper" style="position: absolute;z-index:999;width:' + options.bigImgWidth + 'px;height:auto;top:' + imgT + 'px;right:' + tooltipRight + ';left:' + tooltipLeft + '">' +
								'<img src="' + smallImg + '" width="' + options.bigImgWidth + '">' +
								'</div>';
							$("body").append(tooltip_keleyi_com);
							/*图片预加载*/
							var image = new Image();
							image.src = bigImg;
							/*创建一个Image对象*/
							image.onload = function () {
								$('#preview-wraper').find("img").attr("src", bigImg).css("width", options.bigImgWidth);
							};
						}
					}, 500);
				},
				function () {
					clearTimeout(timer);
					that.removeClass(options.className);
					$("#preview-wraper").remove();
				}
			);
		});
	}
}(window.jQuery);

/* =======================================================================
 * jQuery.Huimodalalert.js alert
 * ========================================================================*/
!function ($) {
  $.fn.Huimodalalert = function (options, callback) {
    var defaults = {
      btn: ['确定'],
      content:'弹窗内容',
      speed: "0",
      area: ['400', 'auto'],
    };
    var options = $.extend(defaults, options);
    this.each(function () {
      var that = $(this);
      var w= 0,h=0,t=0,l=0;
      if (options.area[0]=='auto'){
        w ='400px';
        l = -(400 / 2) + 'px';
      }else{
        w = options.area[0] + 'px';
        l = -(options.area[0] / 2) + 'px';
      }
      if (options.area[1] == 'auto') {
        h = 'auto';
      } else {
        h = options.area[1] + 'px';
      }
      var htmlstr =
      '<div id="Huimodalalert" class="modal modal-alert radius" style="width:' + w + ';height:' + h + ';margin-left:' + l +'">' +
        '<div class="modal-alert-info">' + options.content + '</div>' +
        '<div class="modal-footer">'+
          '<button class="btn btn-primary radius">' + options.btn[0]+'</button>'+
        '</div>' +
      '</div>'+
      '<div id="Huimodalmask" class="Huimodalmask"></div>';

      if ($("#Huimodalalert").length > 0) {
        $("#Huimodalalert,#Huimodalmask").remove();
      }
      if (options.speed==0){
        $(document.body).addClass("modal-open").append(htmlstr);
        $("#Huimodalalert").fadeIn();
      }else{
        $(document.body).addClass("modal-open").append(htmlstr);
        $("#Huimodalalert").find(".modal-footer").remove();
        $("#Huimodalalert").fadeIn();
        setTimeout(function(){
          $("#Huimodalalert").fadeOut("normal",function () {
            huimodalhide();
          });
        }, options.speed);
      }

      var button = that.find(".modal-footer .btn");
      button.on("click",function(){
        $("#Huimodalalert").fadeOut("normal", function () {
          huimodalhide();
        });
      });

      function huimodalhide(){
        $("#Huimodalalert,#Huimodalmask").remove();
        $(document.body).removeClass("modal-open");
        if (callback) {
          callback();
        }
      }
    });
  }
}(window.jQuery);

/* =======================================================================
 * jQuery.Huialert.js alert
 * ========================================================================*/
!function($) {
	$.Huialert = function() {
		$('.Huialert i').Huihover();
		$(document).on("click",".Huialert i",function() {
			var Huialert = $(this).parents(".Huialert");
			Huialert.fadeOut("normal",function() {
				Huialert.remove();
			});
		});
	}
	$.Huialert();
} (window.jQuery);

/* =======================================================================
 * jQuery.Huitotop.js v2.0 返回顶部
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.05.05
 *
 * Copyright 2017 北京颖杰联创科技有限公司 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	//bottom 距离底部高度
	$.Huitotop = function(bottom,threshold){
		if(!bottom){
			bottom = 60;
        }
        if (!threshold) {
            threshold = 800;
        }
		var str ='<a href="javascript:void(0)" class="tools-right toTop Hui-iconfont" title="返回顶部" alt="返回顶部" style="display:none;bottom:'+bottom+'px">&#xe684;</a>';
		$(str).appendTo($('body')).click(function() {
			$("html, body").animate({
				scrollTop: 0
			},
			120);
        });
        if ($(document).scrollTop() > threshold) {
            $(".toTop").show();
        }
		var backToTopFun = function(){
			var st = $(document).scrollTop();
            var winh = $(window).height();
            if (st > threshold) {
				$(".toTop").show();
			}else{
				$(".toTop").hide();
			}
			/*IE6下的定位*/
			if (!window.XMLHttpRequest) {
				$(".toTop").css("top", st + winh - 166);
			}

		}
		$(window).on("scroll",backToTopFun);
	}
} (window.jQuery);
/* =======================================================================
 * jQuery.Huiloading.js v1.0 Huiloading
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.07.18
 *
 * Copyright 2017 北京颖杰联创科技有限公司 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function ($) {
    $.Huiloading = {
        show: function (messages) {
            if ($(".loading-wrapper").length > 0) {
                $(".loading-wrapper").remove();
            }
            if (messages == null) messages = '';
            var htmlstr = '<div class="loading-wrapper"><div class="loading-content"><i class="iconpic iconpic-loading"></i> <span>' + messages + '</span></div></div>';
            $(document.body).append(htmlstr);
            var w = $(".loading-wrapper .loading-content").width() + 40;
            $(".loading-wrapper .loading-content").css({
                "margin-left": -(w / 2) + "px",
            });
        },
        hide: function () {
            $(".loading-wrapper").remove();
        }
    }
}(window.jQuery);

/* =======================================================================
 * jQuery.HuicheckAll.js v1.0 HuicheckAll
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2019.07.01
 *
 * Copyright 2019 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
// 全选与反选 2019.7.1 14:28 @guojunhui
!function ($) {
    $.fn.HuicheckAll = function (options, callback) {
        var defaults = {
            checkboxAll: 'thead input[type="checkbox"]',
            checkbox: 'tbody input[type="checkbox"]'
        }
        var options = $.extend(defaults, options);
        this.each(function () {
            var that = $(this);
            var checkboxAll = that.find(options.checkboxAll);
            var checkbox = that.find(options.checkbox);

            checkboxAll.on("click", function () {
                var isChecked = checkboxAll.prop("checked");
                checkbox.prop("checked", isChecked);
                var _Num = 0, checkedArr = [];
                checkbox.each(function () {
                    if ($(this).prop("checked")) {
                        checkedArr.push($(this).val());
                        _Num++;
                    }
                });
                var checkedInfo = {
                    Number: _Num,
                    checkedArr: checkedArr
                }
                if (callback) {
                    callback(checkedInfo);
                }
            });

            checkbox.on("click", function () {
                var allLength = checkbox.length;
                var checkedLength = checkbox.prop("checked").length;
                allLength == checkedLength ? checkboxAll.prop("checked", true) : checkboxAll.prop("checked", false);
                var _Num = 0, checkedArr = [];
                checkbox.each(function () {
                    if ($(this).prop("checked")) {
                        checkedArr.push($(this).val());
                        _Num++;
                    }
                });
                var checkedInfo = {
                    Number: _Num,
                    checkedArr: checkedArr
                }
                if (callback) {
                    callback(checkedInfo);
                }
            });
        });
    }
}(window.jQuery);

/* =======================================================================
 * jQuery.stickUp.js v0.5.7 BETA  by:LiranCohen
 * https://github.com/LiranCohen/stickUp
 * ======================================================================== */
jQuery(function($) {
	$(document).ready(function(){
		var contentButton = [];
		var contentTop = [];
		var content = [];
		var lastScrollTop = 0;
		var scrollDir = '';
		var itemClass = '';
		var itemHover = '';
		var menuSize = null;
		var stickyHeight = 0;
		var stickyMarginB = 0;
		var currentMarginT = 0;
		var topMargin = 0;
		var vartop = 0;
		$(window).scroll(function(event){
   			var st = $(this).scrollTop();
   			if (st > lastScrollTop){
       			scrollDir = 'down';
   			} else {
      			scrollDir = 'up';
   			}
  			lastScrollTop = st;
		});
		$.fn.stickUp = function( options ) {
			// adding a class to users div
			$(this).addClass('stuckMenu');
        	//getting options
        	var objn = 0;
        	if(options != null) {
	        	for(var o in options.parts) {
	        		if (options.parts.hasOwnProperty(o)){
	        			content[objn] = options.parts[objn];
	        			objn++;
	        		}
	        	}
	  			if(objn == 0) {
	  				console.log('error:needs arguments');
	  			}

	  			itemClass = options.itemClass;
	  			itemHover = options.itemHover;
	  			if(options.topMargin != null) {
	  				if(options.topMargin == 'auto') {
	  					topMargin = parseInt($('.stuckMenu').css('margin-top'));
	  				} else {
	  					if(isNaN(options.topMargin) && options.topMargin.search("px") > 0){
	  						topMargin = parseInt(options.topMargin.replace("px",""));
	  					} else if(!isNaN(parseInt(options.topMargin))) {
	  						topMargin = parseInt(options.topMargin);
	  					} else {
	  						console.log("incorrect argument, ignored.");
	  						topMargin = 0;
	  					}
	  				}
	  			} else {
	  				topMargin = 0;
	  			}
	  			menuSize = $('.'+itemClass).size();
  			}
			stickyHeight = parseInt($(this).height());
			stickyMarginB = parseInt($(this).css('margin-bottom'));
			currentMarginT = parseInt($(this).next().closest('div').css('margin-top'));
			vartop = parseInt($(this).offset().top);
			//$(this).find('*').removeClass(itemHover);
		}
		$(document).on('scroll', function() {
			varscroll = parseInt($(document).scrollTop());
			if(menuSize != null){
				for(var i=0;i < menuSize;i++)
				{
					contentTop[i] = $('#'+content[i]+'').offset().top;
					function bottomView(i) {
						contentView = $('#'+content[i]+'').height()*.4;
						testView = contentTop[i] - contentView;
						if(varscroll > testView){
							$('.'+itemClass).removeClass(itemHover);
							$('.'+itemClass+':eq('+i+')').addClass(itemHover);
						} else if(varscroll < 50){
							$('.'+itemClass).removeClass(itemHover);
							$('.'+itemClass+':eq(0)').addClass(itemHover);
						}
					}
					if(scrollDir == 'down' && varscroll > contentTop[i]-50 && varscroll < contentTop[i]+50) {
						$('.'+itemClass).removeClass(itemHover);
						$('.'+itemClass+':eq('+i+')').addClass(itemHover);
					}
					if(scrollDir == 'up') {
						bottomView(i);
					}
				}
			}
			if(vartop < varscroll + topMargin){
				$('.stuckMenu').addClass('isStuck');
				$('.stuckMenu').next().closest('div').css({
					'margin-top': stickyHeight + stickyMarginB + currentMarginT + 'px'
				}, 10);
				$('.stuckMenu').css("position","fixed");
				$('.isStuck').css({
					top: '0px'
				}, 10, function(){

				});
			};

			if(varscroll + topMargin < vartop){
				$('.stuckMenu').removeClass('isStuck');
				$('.stuckMenu').next().closest('div').css({
					'margin-top': currentMarginT + 'px'
				}, 10);
				$('.stuckMenu').css("position","relative");
			};
		});
	});
});

/* =======================================================================
 * Bootstrap.dropdown.js v3.3.0
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
!function($) {
	'use strict';
	var backdrop = '.dropdown-backdrop';
	var toggle = '[data-toggle="dropdown"]';
	var Dropdown = function(element) {
		$(element).on('click.bs.dropdown', this.toggle)
	}
	Dropdown.VERSION = '3.3.5';
	function getParent($this) {
		var selector = $this.attr('data-target');
		if (!selector) {
			selector = $this.attr('href');
			selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
		}
		var $parent = selector && $(selector);
		return $parent && $parent.length ? $parent: $this.parent();
	}
	function clearMenus(e) {
		if (e && e.which === 3) return $(backdrop).remove();
		$(toggle).each(function() {
			var $this = $(this);
			var $parent = getParent($this);
			var relatedTarget = {
				relatedTarget: this
			}
			if (!$parent.hasClass('open')) return;
			if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));
			if (e.isDefaultPrevented()) return;
			$this.attr('aria-expanded', 'false');
			$parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget);
		});
	}
	Dropdown.prototype.toggle = function(e) {
		var $this = $(this);
		if ($this.is('.disabled, :disabled')) return;
		var $parent = getParent($this);
		var isActive = $parent.hasClass('open');
		clearMenus();
		if (!isActive) {
			if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
				// if mobile we use a backdrop because click events don't delegate
				$(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
			}
			var relatedTarget = {
				relatedTarget: this
			}
			$parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));
			if (e.isDefaultPrevented()) return $this.trigger('focus').attr('aria-expanded', 'true');
			$parent.toggleClass('open').trigger('shown.bs.dropdown', relatedTarget);
		}
		return false;
	}
	Dropdown.prototype.keydown = function(e) {
		if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;
		var $this = $(this);
		e.preventDefault();
		e.stopPropagation();
		if ($this.is('.disabled, :disabled')) return;
		var $parent = getParent($this);
		var isActive = $parent.hasClass('open');
		if (!isActive && e.which != 27 || isActive && e.which == 27) {
			if (e.which == 27)
			$parent.find(toggle).trigger('focus');
			return;
			$this.trigger('click');
		}
		var desc = ' li:not(.disabled):visible a';
		var $items = $parent.find('.dropdown-menu' + desc);
		if (!$items.length) return;
		var index = $items.index(e.target);
		if (e.which == 38 && index > 0) index-- // up
		if (e.which == 40 && index < $items.length - 1) index++; // down
		if (!~index) index = 0;
		$items.eq(index).trigger('focus');
	}
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.dropdown');
			if (!data) {
				$this.data('bs.dropdown', (data = new Dropdown(this)));
			}
			if (typeof option == 'string') {
				data[option].call($this);
			}
		});
	}
	var old = $.fn.dropdown;
	$.fn.dropdown = Plugin;
	$.fn.dropdown.Constructor = Dropdown;
	$.fn.dropdown.noConflict = function() {
		$.fn.dropdown = old;
		return this;
	}
	$(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form',
	function(e) {
		e.stopPropagation()
	}).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
} (window.jQuery);
$(function() {
	/*下拉菜单*/
	$(document).on("mouseenter", ".dropDown",
	function() {
		$(this).addClass("hover");
	});
	$(document).on("mouseleave", ".dropDown",
	function() {
		$(this).removeClass("hover");
	});
	$(document).on("mouseenter", ".dropDown_hover",
	function() {
		$(this).addClass("open");
	});
	$(document).on("mouseleave", ".dropDown_hover",
	function() {
		$(this).removeClass("open");
	});
	$(document).on("click", ".dropDown-menu li a",
	function() {
		$(".dropDown").removeClass('open');
	});
	$(document).on("mouseenter", ".menu > li",
	function() {
		$(this).addClass("open");
	});
	$(document).on("mouseleave", ".menu > li",
	function() {
		$(this).removeClass("open");
	});
});

/* =======================================================================
 * Bootstrap.tooltip.js v3.3.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
!function ($) {
    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================
    var Tooltip = function (element, options) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null;
        this.init('tooltip', element, options);
    }

    Tooltip.VERSION = '3.3.0';
    Tooltip.TRANSITION_DURATION = 150;

    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    }

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled = true;
        this.type = type;
        this.$element = $(element);
        this.options = this.getOptions(options);
        this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport);

        var triggers = this.options.trigger.split(' ');
        for (var i = triggers.length; i--;) {
            var trigger = triggers[i];
            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';
                this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
            }
        }

        this.options.selector ? (this._options = $.extend({},
            this.options, {
            trigger: 'manual',
            selector: ''
        })) : this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS;
    }

    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({},
            this.getDefaults(), this.$element.data(), options);
        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }
        return options;
    }

    Tooltip.prototype.getDelegateOptions = function () {
        var options = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options,
            function (key, value) {
                if (defaults[key] != value) options[key] = value;
            })

        return options;
    }

    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type);

        if (self && self.$tip && self.$tip.is(':visible')) {
            self.hoverState = 'in';
            return;
        }

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data('bs.' + this.type, self);
        }

        clearTimeout(self.timeout);
        self.hoverState = 'in';
        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show();
        },
            self.options.delay.show);
    }

    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data('bs.' + this.type, self);
        }
        clearTimeout(self.timeout);
        self.hoverState = 'out';

        if (!self.options.delay || !self.options.delay.hide) return self.hide();
        self.timeout = setTimeout(function () {

            if (self.hoverState == 'out') self.hide();
        },
            self.options.delay.hide);
    }

    Tooltip.prototype.show = function () {
        var e = $.Event('show.bs.' + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);

            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (e.isDefaultPrevented() || !inDom) return;
            var that = this;
            var $tip = this.tip();
            var tipId = this.getUID(this.type);

            this.setContent();
            $tip.attr('id', tipId);
            this.$element.attr('aria-describedby', tipId);

            if (this.options.animation) $tip.addClass('fade');

            var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement);
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

            $tip.detach().css({
                top: 0,
                left: 0,
                display: 'block'
            }).addClass(placement).data('bs.' + this.type, this);

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
            var pos = this.getPosition();
            var actualWidth = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;

            if (autoPlace) {
                var orgPlacement = placement;
                var $container = this.options.container ? $(this.options.container) : this.$element.parent();
                var containerDim = this.getPosition($container);

                placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top' : placement == 'top' && pos.top - actualHeight < containerDim.top ? 'bottom' : placement == 'right' && pos.right + actualWidth > containerDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < containerDim.left ? 'right' : placement
                $tip.removeClass(orgPlacement).addClass(placement);
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
            this.applyPlacement(calculatedOffset, placement);
            var complete = function () {
                var prevHoverState = that.hoverState;
                that.$element.trigger('shown.bs.' + that.type);
                that.hoverState = null;
                if (prevHoverState == 'out') that.leave(that);
            }

            $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete()
        }
    }

    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip = this.tip();
        var width = $tip[0].offsetWidth;
        var height = $tip[0].offsetHeight;

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10);
        var marginLeft = parseInt($tip.css('margin-left'), 10);

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop)) marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;

        offset.top = offset.top + marginTop;
        offset.left = offset.left + marginLeft;

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        },
            offset), 0);

        $tip.addClass('in');

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = $tip[0].offsetWidth;
        var actualHeight = $tip[0].offsetHeight;

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight;
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

        if (delta.left) offset.left += delta.left;
        else offset.top += delta.top;

        var isVertical = /top|bottom/.test(placement);
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

        $tip.offset(offset);
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
    }

    Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
        this.arrow().css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isHorizontal ? 'top' : 'left', '');
    }

    Tooltip.prototype.setContent = function () {
        var $tip = this.tip();
        var title = this.getTitle();
        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
        $tip.removeClass('fade in top bottom left right');
    }

    Tooltip.prototype.hide = function (callback) {
        var that = this;
        var $tip = this.tip();
        var e = $.Event('hide.bs.' + this.type);
        function complete() {
            if (that.hoverState != 'in') $tip.detach();
            that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type);
            callback && callback();
        }
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $tip.removeClass('in');

        $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
        this.hoverState = null;
        return this;
    }

    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element
        if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }

    Tooltip.prototype.hasContent = function () {
        return this.getTitle();
    }

    Tooltip.prototype.getPosition = function ($element) {
        $element = $element || this.$element;
        var el = $element[0];
        var isBody = el.tagName == 'BODY';
        var elRect = el.getBoundingClientRect();
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({},
                elRect, {
                width: elRect.right - elRect.left,
                height: elRect.bottom - elRect.top
            });
        }
        var elOffset = isBody ? {
            top: 0,
            left: 0
        } : $element.offset();
        var scroll = {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()
        }
        var outerDims = isBody ? {
            width: $(window).width(),
            height: $(window).height()
        } : null
        return $.extend({},
            elRect, scroll, outerDims, elOffset)
    }

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? {
            top: pos.top + pos.height,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == 'top' ? {
            top: pos.top - actualHeight,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == 'left' ? {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth
        } :
            /* placement == 'right' */
            {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left + pos.width
            }

    }

    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = {
            top: 0,
            left: 0
        }
        if (!this.$viewport) return delta;

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
        var viewportDimensions = this.getPosition(this.$viewport);

        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset;
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding;
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset;
            } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
            }
        }
        return delta
    }

    Tooltip.prototype.getTitle = function () {
        var title;
        var $e = this.$element;
        var o = this.options;
        title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)
        return title;
    }

    Tooltip.prototype.getUID = function (prefix) {
        do prefix += ~~(Math.random() * 1000000);
        while (document.getElementById(prefix));
        return prefix;
    }

    Tooltip.prototype.tip = function () {
        return (this.$tip = this.$tip || $(this.options.template));
    }

    Tooltip.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'));
    }

    Tooltip.prototype.enable = function () {
        this.enabled = true;
    }

    Tooltip.prototype.disable = function () {
        this.enabled = false;
    }

    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled;
    }

    Tooltip.prototype.toggle = function (e) {
        var self = this;
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type);
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions());
                $(e.currentTarget).data('bs.' + this.type, self);
            }
        }
        self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }

    Tooltip.prototype.destroy = function () {
        var that = this;
        clearTimeout(this.timeout);
        this.hide(function () {
            that.$element.off('.' + that.type).removeData('bs.' + that.type);
        });
    }

    // TOOLTIP PLUGIN DEFINITION
    // =========================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.tooltip');
            var options = typeof option == 'object' && option;
            var selector = options && options.selector;

            if (!data && option == 'destroy') return;
            if (selector) {
                if (!data) $this.data('bs.tooltip', (data = {}));
                if (!data[selector]) data[selector] = new Tooltip(this, options);
            } else {
                if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)));
            }
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tooltip;
    $.fn.tooltip = Plugin;
    $.fn.tooltip.Constructor = Tooltip;
    // TOOLTIP NO CONFLICT
    // ===================
    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old;
        return this;
    }
}(window.jQuery);
$(function () {
    $("[data-toggle='tooltip']").tooltip();
});

/* =======================================================================
 * Bootstrap.popover.js v3.3.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
!
    function ($) {
        'use strict';
        // POPOVER PUBLIC CLASS DEFINITION
        // ===============================
        var Popover = function (element, options) {
            this.init('popover', element, options)
        }

        if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');
        Popover.VERSION = '3.3.0';
        Popover.DEFAULTS = $.extend({},
            $.fn.tooltip.Constructor.DEFAULTS, {
            placement: 'right',
            trigger: 'click',
            content: '',
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
        })

        // NOTE: POPOVER EXTENDS tooltip.js
        // ================================
        Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);
        Popover.prototype.constructor = Popover;
        Popover.prototype.getDefaults = function () {
            return Popover.DEFAULTS;
        }

        Popover.prototype.setContent = function () {
            var $tip = this.tip();
            var title = this.getTitle();
            var content = this.getContent();

            $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
            $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
                this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'](content)

            $tip.removeClass('fade top bottom left right in');

            // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
            // this manually by checking the contents.
            if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
        }

        Popover.prototype.hasContent = function () {
            return this.getTitle() || this.getContent()
        }

        Popover.prototype.getContent = function () {
            var $e = this.$element;
            var o = this.options;

            return $e.attr('data-content') || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content)
        }

        Popover.prototype.arrow = function () {
            return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
        }

        Popover.prototype.tip = function () {
            if (!this.$tip) this.$tip = $(this.options.template);
            return this.$tip;
        }

        // POPOVER PLUGIN DEFINITION
        // =========================
        function Plugin(option) {
            return this.each(function () {
                var $this = $(this);
                var data = $this.data('bs.popover');
                var options = typeof option == 'object' && option;
                var selector = options && options.selector;

                if (!data && option == 'destroy') return;
                if (selector) {
                    if (!data) $this.data('bs.popover', (data = {}));
                    if (!data[selector]) data[selector] = new Popover(this, options);
                } else {
                    if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
                }
                if (typeof option == 'string') data[option]()
            })
        }

        var old = $.fn.popover

        $.fn.popover = Plugin;
        $.fn.popover.Constructor = Popover;

        // POPOVER NO CONFLICT
        // ===================
        $.fn.popover.noConflict = function () {
            $.fn.popover = old;
            return this;
        }
    }(window.jQuery);
$(function () {
    $("[data-toggle='popover']").popover();
});
