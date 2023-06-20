!(function ($) {
    $.fn.extend({
        offsetP: function () {
            var offset = this.offset();
            var parentOffset = this.parent().offset();
            return { left: offset.left - parentOffset.left, top: offset.top - parentOffset.top };
        },
        cascade: function (option) {
            this.each(function (i, e) {
                if ($(e).data('csc') && $(e).data('csc').destroy) {
                    $(e).data('csc').destroy();
                    $(e).off('click');
                }
                if (typeof (option) == 'object') {
                    option.el = e;
                    var csc = new Cascade(option);
                    $(e).data('csc', csc);
                    $(e).on('click', function () {
                        csc.show();
                    });
                } else {
                    if (option === 'destroy') {
                        //if ($(e).data('csc') && $(e).data('csc').destroy) {
                        //    $(e).data('csc').destroy();
                        //}
                        //$(e).off('click');
                    }
                }
            });
            return this;
        }
    });
    function Cascade(option) {
        var that = this;
        this.id = getGuid();
        //labels决定级数，如labels为['省','市','区县']，data数据至少需3级
        this.settings = $.extend({ title: '请选择', data: [], labels: ['省份','城市','区县'],tip:'请先选择上一级' ,onselect:null,cancel:null,textJoin:' ',zIndex:2000}, option);
        this.target = option.el;
        var $b = $('<div class="bbox-mask cascade"><div class="bbox-container"><div class="bbox"><div class="bbox-header"></div><div class="bbox-body"></div><div class="bbox-footer"><a class="bbox-btn csc-cancel">取消</a><a class="bbox-btn csc-confirm">确定</a></div></div></div></div>');
        $b.css({ 'z-index': this.settings.zIndex, 'display': 'none' }).prop('id', 'bbox-' + this.id);
        this.bbox = $b;
        if (!this.settings.title) {
            $b.find('.bbox-header').remove();
        } else {
            $b.find('.bbox-header').html(this.settings.title);
        }
        var $body = $b.find('.bbox-body');
        var $menubox = $('<div style="border-bottom:1px solid #8487fa"><ul class="scroll-menu"></ul></div>');
        var $itembox = $('<div class="itembox"></div>');
        this.settings.labels.forEach(function (e, i) {
            $menubox.find('.scroll-menu').append('<li>' + that.settings.labels[i] + '</li>');
            $itembox.append('<div style="height:40vh;overflow-y:auto;margin-top:10px;display:none" class="list-box"><div class="list noborder"><div class="t">'+that.settings.tip+'</div></div></div>');
        });
        $itembox.find('.list').eq(0).empty();
        for (var i = 0; i < this.settings.data.length; i++) {
            var dataitem = this.settings.data[i];
            $itembox.find('.list').eq(0).append('<div class="list-item" data-level="0" data-id="'+dataitem.id+'" data-text="'+dataitem.text+'">'+dataitem.text+'</div>')
        }
        $body.append($menubox);
        $body.append($itembox);
        $menubox.find('.scroll-menu').on('menu.change', function (e) {
            $itembox.find('.list-box').eq(e.detail.newIdx).show().siblings().hide();
        });
        $b.find('.csc-cancel').on('click', function () {
            if (that.settings.cancel && typeof (that.settings.cancel) == 'function') {
                that.settings.cancel.call(that);
            }
            that.hide();
        });
        $b.find('.csc-confirm').on('click', function () {
            var ids = [];
            var texts = [];
            var lis = $menubox.find('li');
            for (var i = 0; i < lis.length; i++) {
                var $l = lis.eq(i);
                var dtid = $l.data("id");
                var dttext=$l.data("text");
                if (dtid != undefined && dtid != null) {
                    ids.push(dtid);
                    texts.push(dttext);
                } else {
                    break;
                }
            }
            if (ids.length >= that.settings.labels.length) {
                var txt = texts.join(that.settings.textJoin).trim();
                if (that.settings.onselect && typeof (that.settings.onselect) == 'function') {
                    that.settings.onselect.call(that, { values: ids, text: txt });
                }
                that.hide();
                if ($(that.target).is('input')) {
                    $(that.target).val(txt);
                    $(that.target).trigger('change');
                }
            }
        });
        $itembox.on('click', '.list-item', function () {
            if (!$(this).is('.actived')) {
                $(this).addClass('actived').siblings().removeClass('actived');
            }
            var level = $(this).data('level');
            var nextLevel = level+1;
            var id = $(this).data("id");
            var text = $(this).data("text");
            var $currentMenu = $menubox.find(".scroll-menu").find('li').eq(level);
            $currentMenu.html(text).data({ id: id, text: text });//当前label的文本设选显示值
            if (level < that.settings.labels.length - 1) {
                var clickedDataItem = that.findClickedDataItem(level, id);
                if (clickedDataItem && clickedDataItem.children) {
                    //当前label所有下级的文本初始化,并清空所有下级的选项
                    $currentMenu.nextAll().each(function (idx, ele) {
                        $menubox.find(".scroll-menu").find('li').eq(nextLevel + idx).html(that.settings.labels[nextLevel + idx]).data({ id: null, text: null });
                        $itembox.find(".list").eq(nextLevel + idx).html('<div class="t">'+that.settings.tip+'</div>');
                    });
                    //为下级列表添加item
                    var $nextList = $itembox.find(".list").eq(nextLevel);
                    $nextList.empty();
                    for (var i = 0; i < clickedDataItem.children.length; i++) {
                        var dataitem = clickedDataItem.children[i];
                        $nextList.append('<div class="list-item" data-level="' + nextLevel + '" data-id="' + dataitem.id + '" data-text="' + dataitem.text + '">' + dataitem.text + '</div>')
                    }
                    //激活下一级
                    $menubox.find(".scroll-menu").find('li').eq(nextLevel).trigger('click')
                }
            } else {
                //点击的是最后一级，滚动到最后一级内容完整显示（内容超出时）
                $menubox.find(".scroll-menu").animate({ scrollLeft: 2000}, 200);
            }
        });
        this.findClickedDataItem = function (clickedLevel, clickedId) {
            var currentData = that.settings.data;
            var currentItem = null;
            for (var i = 0; i <= clickedLevel; i++) {
                var $lb = $menubox.find(".scroll-menu").find('li').eq(i);
                if (currentData && currentData.length > 0) {
                    var foundedItems = currentData.filter(function (e) {
                        return e.id == $lb.data('id');
                    });
                    if (foundedItems.length > 0) {
                        currentItem = foundedItems[0];
                        currentData = currentItem.children;
                    } else {
                        currentItem = null;
                        break;
                    }
                } else {
                    break;
                }
            }

            return currentItem;
        };
        this.show = function () {
            this.bbox.find('.bbox').addClass('ani-slideup');
            this.bbox.show();
        };
        this.destroy = function () {
            console.log(123)
            $(this.target).off('click');
            this.bbox.remove();
        };
        this.hide = function () {
            this.bbox.find('.bbox').removeClass('ani-slideup');
            this.bbox.hide();
        };
        $('body').append($b);
        $menubox.find('.scroll-menu li').eq(0).trigger('click');
    }
})(jQuery);

$(function () {
    $.event.special.touchstart = {
        setup: function (_, ns, handle) {
            this.addEventListener("touchstart", handle, {
                passive: false,
            });
        }
    };
    $.event.special.touchmove = {
        setup: function (_, ns, handle) {
            this.addEventListener("touchmove", handle, {
                passive: false,
            });
        }
    };
    $.event.special.mousewheel = {
        setup: function (_, ns, handle) {
            this.addEventListener("mousewheel", handle, {
                passive: false,
            });
        }
    };
    currentScroll = $(window).scrollTop();
    $(document)
    .on('click', '.scroll-menu li', function () {
        var $t = $(this);
        var $s = $t.closest('.scroll-menu');
        var $ul = $t.parent();
        var newIdx = $t.index();
        var oldIdx = $ul.find('li.actived').index();

        var evt = $.Event("menu.click", { detail: { newIdx: newIdx, oldIdx: oldIdx, data: $t.data() } });
        $s.trigger(evt);
        if (newIdx != oldIdx) {
            if (!$t.hasClass('actived')) {
                $t.addClass('actived');
            }
            $t.siblings().removeClass('actived');
            evt = $.Event("menu.change", { detail: { newIdx: newIdx, oldIdx: oldIdx, data: $t.data() } });
            $s.trigger(evt);

            var offsetLeft = $t.offsetP().left + $s.scrollLeft();
            $s.animate({ scrollLeft: offsetLeft + $t.outerWidth() / 2 - $s.width()/2}, 200);//选中菜单移到中间
        }
    })
    .on('touchstart', ".scroll-menu", smEventDown)
    .on('mousedown', ".scroll-menu", smEventDown)
    .on('touchmove', ".scroll-menu", smEventMove)
    .on('mousemove',smEventMove)
    .on('touchend','.scroll-menu',smEventUp)
    .on('mouseup',smEventUp);
    var smMouseIsDown = false, smPrexX, smStartX;
    var $currentSM,$currentSMLis;
    function smEventDown(e) {
        $currentSM = $(this);
        $currentSMLis = $currentSM.find('li');
        if (e&&e.originalEvent) {
            e = e.originalEvent;
        }
        if (e && e.changedTouches) {
            e = e.changedTouches[e.changedTouches.length - 1];
        }
        var offsetX = $currentSM.offset().left;
        smPrexX = e.pageX - offsetX;
        smStartX = smPrexX;
        smMouseIsDown = true;
    }
    function smEventMove(e) {
        if (smMouseIsDown) {
            e.preventDefault();
            if (e&&e.originalEvent) {
                e = e.originalEvent;
            }
            if (e && e.changedTouches) {
                e = e.changedTouches[e.changedTouches.length - 1];
            }
            var currentX = e.pageX - $currentSM.offset().left;
            $currentSM[0].scrollLeft += smPrexX - currentX;
            //move>10时，阻止li的点击事件，防止松开鼠标时触发click
            if (Math.abs(currentX - smStartX) >= 10 && !$currentSMLis.hasClass('prevent-event')) {
                $currentSM.addClass('prevent-event');
            }
            smPrexX = currentX;
        }
    }
    function smEventUp(e) {
        $currentSM = null;
        $currentSMLis = null;
        smMouseIsDown = false;
        $('.scroll-menu').removeClass('prevent-event');
    }
    //cascade
    $(document).on('touchstart', ".cascade .list-box", cascadeEventDown)
    .on('mousedown', ".cascade .list-box", cascadeEventDown)
    .on('touchmove', ".cascade .list-box", cascadeEventMove)
    .on('mousemove',cascadeEventMove)
    .on('touchend',".cascade .list-box",cascadeEventUp)
    .on('mouseup',cascadeEventUp)
    .on('mousewheel','.cascade .list-box',cascadeEventWheel)
    .on('mousewheel', '.cascade', function (e) {
        e.preventDefault();
    }).on('touchmove', '.cascade', function (e) {
        e.preventDefault();
    });
    var $currentCsc;
    var cscMouseIsDown = false, cscPreY, cscStartY;
    function cascadeEventDown(e) {
        $currentCsc = $(this);
        if (e&&e.originalEvent) {
            e = e.originalEvent;
        }
        if (e && e.changedTouches) {
            e = e.changedTouches[e.changedTouches.length - 1];
        }
        var offsetY = $currentCsc.offset().top;
        cscPreY = e.pageY - offsetY;
        cscStartY = cscPreY;
        cscMouseIsDown = true;
    }
    function cascadeEventMove(e) {
        if (cscMouseIsDown) {
            e.preventDefault();
            if (e&&e.originalEvent) {
                e = e.originalEvent;
            }
            if (e && e.changedTouches) {
                e = e.changedTouches[e.changedTouches.length - 1];
            }
            var currentY = e.pageY - $currentCsc.offset().top;
            $currentCsc[0].scrollTop += (cscPreY - currentY)*1.5;
            //move>10时，阻止li的点击事件，防止松开鼠标时触发click
            if (Math.abs(currentY - cscStartY) >= 10 && !$currentCsc.hasClass('prevent-event')) {
                $currentCsc.addClass('prevent-event');
            }
            cscPreY = currentY;
        }
    }
    function cascadeEventUp(e) {
        $currentCsc = null;
        cscMouseIsDown = false;
        $('.cascade .list-box').removeClass('prevent-event');
    }
    function cascadeEventWheel(e) {
        e.preventDefault();
        if (e&&e.originalEvent) {
            e = e.originalEvent;
        }
        if (e.deltaY > 0) {
            $(this)[0].scrollTop += 42;
        } else {
            $(this)[0].scrollTop -= 42;
        }
    }
});