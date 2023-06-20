var num = 0, oUl = $("#min_title_list"), hide_nav = $("#Hui-tabNav");
/*获取顶部选项卡总长度*/
function tabNavallwidth(){
	var taballwidth=0,
		$tabNav = hide_nav.find(".acrossTab"),
		$tabNavWp = hide_nav.find(".Hui-tabNav-wp"),
		$tabNavitem = hide_nav.find(".acrossTab li"),
		$tabNavmore =hide_nav.find(".Hui-tabNav-more");
	if (!$tabNav[0]){return}
	$tabNavitem.each(function(index, element) {
		taballwidth += Number(parseFloat($(this).outerWidth()+2))
    });
	$tabNav.width(taballwidth+25);
	var w = $tabNavWp.width();
	if(taballwidth+25>w){
		$tabNavmore.show()}
	else{
		$tabNavmore.hide();
		$tabNav.css({left:0});
	}
}
/*左侧菜单响应式*/
function Huiasidedisplay(){
    if ($(window).width() >= 768) {
        $(".Hui-aside").show();
    } else {
        $(".Hui-aside").hide();
    }
}
/*获取皮肤cookie*/
function getskincookie(){
	var v = $.cookie("huiSkin");
	var hrefStr=$("#skin").attr("href");
	if(v==null||v==""){
		v="default";
	}
	if (hrefStr != undefined) {
		var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
		$("#skin").attr("href",hrefRes);
	}
}
/*菜单导航*/
function Hui_admin_tab(obj){
	var bStop = false,
		bStopIndex = 0,
		href = $(obj).attr('data-href'),
		title = $(obj).attr("data-title"),
		topWindow = $(window.parent.document),
		show_navLi = topWindow.find("#min_title_list li"),
		iframe_box = topWindow.find("#iframe_box");
	if(!href||href==""){
		alert("data-href不存在，v2.5版本之前用_href属性，升级后请改为data-href属性");
		return false;
	}if(!title){
		alert("v2.5版本之后使用data-title属性");
		return false;
	}
	if(title==""){
		alert("data-title属性不能为空");
		return false;
	}
	show_navLi.each(function() {
		if($(this).find('span').attr("data-href")==href){
			bStop=true;
			bStopIndex=show_navLi.index($(this));
			return false;
		}
	});
	if(!bStop){
		creatIframe(href,title);
		min_titleList();
	}
	else{
        show_navLi.removeClass("active").eq(bStopIndex).addClass("active");
        if (window._refreshPage || $('body').attr('refreshPage')==1) {
            iframe_box.find(".show_iframe").hide().eq(bStopIndex).show().find("iframe").attr("src", href);
        } else {
            iframe_box.find(".show_iframe").hide().eq(bStopIndex).show().find("iframe");
        }
	}
}

/*最新tab标题栏列表*/
function min_titleList(){
	var topWindow = $(window.parent.document),
		show_nav = topWindow.find("#min_title_list"),
		aLi = show_nav.find("li");
}

/*创建iframe*/
function creatIframe(href, titleName) {
	var topWindow=$(window.parent.document),
		show_nav=topWindow.find('#min_title_list'),
		iframe_box=topWindow.find('#iframe_box'),
		iframeBox=iframe_box.find('.show_iframe'),
		$tabNav = topWindow.find(".acrossTab"),
		$tabNavWp = topWindow.find(".Hui-tabNav-wp"),
		$tabNavmore =topWindow.find(".Hui-tabNav-more");
	var taballwidth=0;
	show_nav.find('li').removeClass("active");
	show_nav.append('<li class="active"><span data-href="'+href+'">'+titleName+'</span><i></i><em></em></li>');
	show_nav.find('li').contextMenu('Huiadminmenu', {
		bindings: {
			'closethis': function (t) {
				var $t = $(t);
				if ($t.find("i")) {
					$t.find("i").trigger("click");
				}
			},
			'closeall': function (t) {
				show_nav.find('li i').trigger("click");
			},
		}
	});

	var $tabNavitem = topWindow.find(".acrossTab li");
	if (!$tabNav[0]){return}
	$tabNavitem.each(function(index, element) {
    taballwidth+=Number(parseFloat($(this).outerWidth()+2))
  });
	$tabNav.width(taballwidth+25);
	var w = $tabNavWp.width();
	if(taballwidth+25>w){
		$tabNavmore.show()}
	else{
		$tabNavmore.hide();
		$tabNav.css({left:0})
	}
	iframeBox.hide();
	iframe_box.append('<div class="show_iframe"><div class="loading"></div><iframe data-scrollTop="0" frameborder="0" src='+href+'></iframe></div>');
	var showBox = iframe_box.find('.show_iframe:visible');
	showBox.find('iframe').on('load', function () {
		showBox.find('.loading').hide();
	});
}
///*关闭iframe*/
//function removeIframe(){
//	var topWindow = $(window.parent.document),
//		iframe = topWindow.find('#iframe_box .show_iframe'),
//		tab = topWindow.find(".acrossTab li"),
//		showTab = topWindow.find(".acrossTab li.active"),
//		showBox=topWindow.find('.show_iframe:visible'),
//		i = showTab.index();
//	tab.eq(i-1).addClass("active");
//	tab.eq(i).remove();
//	iframe.eq(i-1).show();
//	$(iframe.eq(i-1).find("iframe")[0].contentWindow.document).scrollTop(iframe.eq(i-1).find("iframe").attr("data-scrollTop"));
//	iframe.eq(i).remove();
//}
///*关闭所有iframe*/
//function removeIframeAll(){
//	var topWindow = $(window.parent.document),
//		iframe = topWindow.find('#iframe_box .show_iframe'),
//		tab = topWindow.find(".acrossTab li");
//	for(var i=0;i<tab.length;i++){
//		if(tab.eq(i).find("i").length>0){
//			tab.eq(i).remove();
//			iframe.eq(i).remove();
//		}
//	}
//}

/*弹出层*/
/*
	参数解释：
	title	标题
	url		请求的url
	id		需要操作的数据id
	w		弹出层宽度（缺省调默认值）
	h		弹出层高度（缺省调默认值）
*/
function layer_show(title,url,w,h){
	if (title == null || title == '') {
		title=false;
	};
	if (url == null || url == '') {
		url="404.html";
	};
	if (w == null || w == '') {
		w=800;
	};
	if (h == null || h == '') {
		h=($(window).height() - 50);
	};
	layer.open({
		type: 2,
		area: [w+'px', h +'px'],
		fix: false, //不固定
		maxmin: true,
		shade:0.4,
		title: title,
		content: url
	});
}
/*关闭弹出框口*/
function layer_close(){
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}

/*时间*/
function getHTMLDate(obj) {
    var d = new Date();
	var weekday = new Array(7);
	var _yy = "";
    var _mm = "";
    var _dd = "";
    var _ww = "";
    weekday[0] = "星期日";
    weekday[1] = "星期一";
    weekday[2] = "星期二";
    weekday[3] = "星期三";
    weekday[4] = "星期四";
    weekday[5] = "星期五";
    weekday[6] = "星期六";
    _yy = d.getFullYear();
    _mm = d.getMonth() + 1;
    _dd = d.getDate();
    _ww = weekday[d.getDay()];
    obj.html(_yy + "年" + _mm + "月" + _dd + "日 " + _ww);
};
function toNavPos(){
	oUl.stop().animate({'left':-num*100},100);
}
function initAsideFold() {
	$(".Hui-aside").Huifold({
		titCell: '.menu_dropdown dl dt',
		mainCell: '.menu_dropdown dl dd',
		speed: 200
	});
}
function changeAsideMenu(html) {
	$(".Hui-aside .menu_dropdown").html(html);
	initAsideFold();
}
function closeTag(idx){
	var $li=$("#min_title_list li").eq(idx);
	var preIndex=$li.index()-1;//上一个标签index
	var actived=$li.is(".active");//正在关闭的标签是否active

	$li.remove();
	$('#iframe_box').find('.show_iframe').eq(idx).remove();
	num==0?num=0:num--;
	tabNavallwidth();

	//added by rex 如果正在关闭的标签为激活状态,激活上一个标签，否则不动
	if(actived){
		$("#min_title_list li").removeClass("active").eq(preIndex).addClass("active");
		$("#iframe_box").find(".show_iframe").hide().eq(preIndex).show();
	}
}
/*
 *slimscroll 1.3.1
 */
!function(a){jQuery.fn.extend({slimScroll:function(b){var c={width:"auto",height:"250px",size:"7px",color:"#000",position:"right",distance:"1px",start:"top",opacity:.4,alwaysVisible:!1,disableFadeOut:!1,railVisible:!1,railColor:"#333",railOpacity:.2,railDraggable:!0,railClass:"slimScrollRail",barClass:"slimScrollBar",wrapperClass:"slimScrollDiv",allowPageScroll:!1,wheelStep:20,touchScrollStep:200,borderRadius:"7px",railBorderRadius:"7px"},d=a.extend(c,b);return this.each(function(){function x(b){if(c){var b=b||window.event,e=0;b.wheelDelta&&(e=-b.wheelDelta/120),b.detail&&(e=b.detail/3);var f=b.target||b.srcTarget||b.srcElement;a(f).closest("."+d.wrapperClass).is(o.parent())&&y(e,!0),b.preventDefault&&!n&&b.preventDefault(),n||(b.returnValue=!1)}}function y(a,b,c){n=!1;var e=a,f=o.outerHeight()-v.outerHeight();if(b&&(e=parseInt(v.css("top"))+a*parseInt(d.wheelStep)/100*v.outerHeight(),e=Math.min(Math.max(e,0),f),e=a>0?Math.ceil(e):Math.floor(e),v.css({top:e+"px"})),j=parseInt(v.css("top"))/(o.outerHeight()-v.outerHeight()),e=j*(o[0].scrollHeight-o.outerHeight()),c){e=a;var g=e/o[0].scrollHeight*o.outerHeight();g=Math.min(Math.max(g,0),f),v.css({top:g+"px"})}o.scrollTop(e),o.trigger("slimscrolling",~~e),B(),C()}function z(){window.addEventListener?(this.addEventListener("DOMMouseScroll",x,!1),this.addEventListener("mousewheel",x,!1),this.addEventListener("MozMousePixelScroll",x,!1)):document.attachEvent("onmousewheel",x)}function A(){i=Math.max(o.outerHeight()/o[0].scrollHeight*o.outerHeight(),m),v.css({height:i+"px"});var a=i==o.outerHeight()?"none":"block";v.css({display:a})}function B(){if(A(),clearTimeout(g),j==~~j){if(n=d.allowPageScroll,k!=j){var a=0==~~j?"top":"bottom";o.trigger("slimscroll",a)}}else n=!1;return k=j,i>=o.outerHeight()?(n=!0,void 0):(v.stop(!0,!0).fadeIn("fast"),d.railVisible&&u.stop(!0,!0).fadeIn("fast"),void 0)}function C(){d.alwaysVisible||(g=setTimeout(function(){d.disableFadeOut&&c||e||f||(v.fadeOut("slow"),u.fadeOut("slow"))},1e3))}var c,e,f,g,h,i,j,k,l="<div></div>",m=30,n=!1,o=a(this);if(o.parent().hasClass(d.wrapperClass)){var p=o.scrollTop();if(v=o.parent().find("."+d.barClass),u=o.parent().find("."+d.railClass),A(),a.isPlainObject(b)){if("height"in b&&"auto"==b.height){o.parent().css("height","auto"),o.css("height","auto");var q=o.parent().parent().height();o.parent().css("height",q),o.css("height",q)}else if("height"in b){var r=b.height;o.parent().css("height",r),o.css("height",r)}if("scrollTo"in b)p=parseInt(d.scrollTo);else if("scrollBy"in b)p+=parseInt(d.scrollBy);else if("destroy"in b)return v.remove(),u.remove(),o.unwrap(),void 0;y(p,!1,!0)}}else{d.height="auto"==d.height?o.parent().height():d.height;var s=a(l).addClass(d.wrapperClass).css({position:"relative",overflow:"hidden",width:d.width,height:d.height});o.css({overflow:"hidden",width:d.width,height:d.height});var u=a(l).addClass(d.railClass).css({width:d.size,height:"100%",position:"absolute",top:0,display:d.alwaysVisible&&d.railVisible?"block":"none","border-radius":d.railBorderRadius,background:d.railColor,opacity:d.railOpacity,zIndex:90}),v=a(l).addClass(d.barClass).css({background:d.color,width:d.size,position:"absolute",top:0,opacity:d.opacity,display:d.alwaysVisible?"block":"none","border-radius":d.borderRadius,BorderRadius:d.borderRadius,MozBorderRadius:d.borderRadius,WebkitBorderRadius:d.borderRadius,zIndex:99}),w="right"==d.position?{right:d.distance}:{left:d.distance};u.css(w),v.css(w),o.wrap(s),o.parent().append(v),o.parent().append(u),d.railDraggable&&v.bind("mousedown",function(b){var c=a(document);return f=!0,t=parseFloat(v.css("top")),pageY=b.pageY,c.bind("mousemove.slimscroll",function(a){currTop=t+a.pageY-pageY,v.css("top",currTop),y(0,v.position().top,!1)}),c.bind("mouseup.slimscroll",function(){f=!1,C(),c.unbind(".slimscroll")}),!1}).bind("selectstart.slimscroll",function(a){return a.stopPropagation(),a.preventDefault(),!1}),u.hover(function(){B()},function(){C()}),v.hover(function(){e=!0},function(){e=!1}),o.hover(function(){c=!0,B(),C()},function(){c=!1,C()}),o.bind("touchstart",function(a){a.originalEvent.touches.length&&(h=a.originalEvent.touches[0].pageY)}),o.bind("touchmove",function(a){if(n||a.originalEvent.preventDefault(),a.originalEvent.touches.length){var b=(h-a.originalEvent.touches[0].pageY)/d.touchScrollStep;y(b,!0),h=a.originalEvent.touches[0].pageY}}),A(),"bottom"===d.start?(v.css({top:o.outerHeight()-v.outerHeight()}),y(0,!0)):"top"!==d.start&&(y(a(d.start).position().top,null,!0),d.alwaysVisible||v.hide()),z()}}),this}}),jQuery.fn.extend({slimscroll:jQuery.fn.slimScroll})}(jQuery);

$(function(){
	getHTMLDate($("#top_time"));
	getskincookie();
	Huiasidedisplay();
	var resizeID;
	$(window).resize(function(){
		clearTimeout(resizeID);
		resizeID = setTimeout(function(){
			Huiasidedisplay();
			tabNavallwidth();//bug:width<767打开标签，窗口拖大时会堆在一起，需重新计算一下宽度
		},200);
	});

	$(".nav-toggle").click(function () {
		$(".Hui-aside").toggle(200);
	});
	$(".Hui-aside").on("click",".menu_dropdown dd li a",function(){
		if($(window).width()<768){
			$(".Hui-aside").toggle(200);
		}
	});
	initAsideFold();
	/*选项卡导航*/
	$(document).on("click",".Hui-aside .menu_dropdown a",function(){
		Hui_admin_tab(this);
		//设置选中modified by rex
		$(".Hui-aside").find(".menu_dropdown dl dd ul li").removeClass("current");
		$(this).parent().addClass("current");
	});

	$(document).on("click","#min_title_list li",function(){
		var bStopIndex=$(this).index();
		var iframe_box=$("#iframe_box");
		$("#min_title_list li").removeClass("active").eq(bStopIndex).addClass("active");
		iframe_box.find(".show_iframe").hide().eq(bStopIndex).show();
		
		//点击标签时设置选中modified by rex
		//var href=$("#min_title_list li").eq(bStopIndex).find("span").data("href");
		//if(href){
		//	var $aside=$(".Hui-aside");
		//	$aside.find(".menu_dropdown dl dd ul li").removeClass("current");
		//	$aside.find('[data-href="'+href+'"]').parent().addClass("current");
		//}
	});
	
	$(document).on("click","#min_title_list li i",function(e){
		//added by rex
		e.stopPropagation();
		closeTag($(this).parent().index());
	});
	$(document).on("dblclick","#min_title_list li",function(){
		var aCloseIndex=$(this).index();
		var iframe_box=$("#iframe_box");
		if(aCloseIndex>0){
			$(this).remove();
			$('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove();
			num==0?num=0:num--;
			$("#min_title_list li").removeClass("active").eq(aCloseIndex-1).addClass("active");
			iframe_box.find(".show_iframe").hide().eq(aCloseIndex-1).show();
			tabNavallwidth();
		}else{
			return false;
		}
	});
	tabNavallwidth();

	$('#js-tabNav-next').click(function(){
		num==oUl.find('li').length-1?num=oUl.find('li').length-1:num++;
		toNavPos();
	});
	$('#js-tabNav-prev').click(function(){
		num==0?num=0:num--;
		toNavPos();
	});

	/*换肤*/
	$("#Hui-skin .dropDown-menu a").click(function(){
		var v = $(this).attr("data-val");
		$.cookie("huiSkin", v,{expires:365,path:"/"});
		var hrefStr=$("#skin").attr("href");
		var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
		$(window.frames.document).contents().find("#skin").attr("href",hrefRes);
	});
	/*added*/
	$('.Hui-aside .menu_dropdown').slimScroll({
        height: '100%',
        railVisible: true,
        size:4
    });
	//var sideMenu =[{"TypeId":1,"TypeName":"常用","Groups":[{"GroupId":1,"GroupName":"常用网站","GroupIcon":"&#xe630;","Modules":[{"ModuleName":"百度","Icon":"","Url":"https://www.baidu.com"}
    if ($('[menuType]').length > 0) {
        var currentMenuType = $('[menuType] .active').eq(0).attr("menuType");
        $('[menuType]').click(function () {
            var $t = $(this);
            var typeId = $t.attr('menuType');
            if (typeId != currentMenuType) {
                currentMenuType = typeId;
                var mt = sideMenu.filter(function (t) {
                    return t.TypeId == typeId;
                });
                var html = template("tp_menu", mt[0]);
				$("[menuType]").removeClass("active");
                $t.addClass("active");
                changeAsideMenu(html);
            }
        });
    }
});
