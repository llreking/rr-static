!(function ($) {
    $.fn.extend({
        //$this中不能放多个child
        marquee: function (op) {
            var $this = this;
            var paused = false;
            var scrollInterval;
            var settings = $.extend({ speed: 30, interval: 3000, height: $this.height() }, op);
            if ($this.children().eq(0).outerHeight() <= settings.height) {
                return;
            }

            $this.append($this.html());
            $this.on('mouseenter', function () {
                paused = true;
            });
            $this.on('mouseleave', function () {
                paused = false;
            });

            var scrollbox = $this[0];
            scrollbox.scrollTop = 0;
            var start = function () {
                scrollInterval = setInterval(scrolling, settings.speed);
                if (!paused) {
                    scrollbox.scrollTop += 1;
                }
            };
            var scrolling = function () {
                if (scrollbox.scrollTop % settings.height != 0) {
                    scrollbox.scrollTop += 1;
                    if (scrollbox.scrollTop >= scrollbox.scrollHeight / 2) {
                        scrollbox.scrollTop = 0;
                    }
                }
                else {
                    clearInterval(scrollInterval);
                    setTimeout(start, settings.interval);
                }
            };
            setTimeout(start, settings.interval);

            return $this;
        }, offsetP: function () {
            var offset = this.offset();
            var parentOffset = this.parent().offset();
            return { left: offset.left - parentOffset.left, top: offset.top - parentOffset.top };
        }, slideTo: function (val) {
            //设置slider手柄位置
            var $s = this;
            if (val == null || val == undefined || isNaN(val)) {
                val = $s.data('value');
            }
            if (val == undefined) {
                return;
            }
            val = parseFloat(val);
            var $h = $s.find('.handle');
            var hw = $h.outerWidth();
            var min = parseFloat($s.attr('min'));
            var max = parseFloat($s.attr('max'));
            if (isNaN(min)) {
                min = 0;
            }
            if (isNaN(max)) {
                max = min + 100;
            }
            var maxX = $s.width() - hw;
            if (maxX < 0) {
                maxX = 0;
            }
            if (isNaN(val)) {
                val = min;
            }
            if (val < min) {
                val = min;
            }
            if (val > max) {
                val = max;
            }
            var x = maxX*(val-min)/(max - min);
            if (x < 0) {
                x = 0;
            }
            if (x > maxX) {
                x = maxX;
            }
            $h.css({ left: x });
            //$h.stop().animate({ left: x }, 200);
            $s.data('value', val);
            return $s;
        }, cascade: function (option) {
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
        }, progress: function (rate) {
            if (rate > 1) {
                rate = 1;
            }
            var p = rate * 100 + '%';
            this.find('.handle').css('width', p);
            this.data("value", rate);
            return this;
        }
    });
    function Cascade(option) {
        var that = this;
        this.id = getGuid();
        //labels决定级数，如labels为['省','市','区县']，data数据至少需3级
        this.settings = $.extend({ title: '请选择',valuename:'id',textname:'text', data: [], labels: ['省份','城市','区县'],tip:'请先选择上一级' ,onselect:null,cancel:null,textJoin:' ',zIndex:80000000,maxWidth:767,dark:false,background:''}, option);
        this.target = option.el;
        var $b = $('<div class="bbox-mask cascade"><div class="bbox-container" style="max-width:' + (typeof (this.settings.maxWidth) == 'number'||(!(this.settings.maxWidth+'').contains('%')&&!(this.settings.maxWidth+'').contains('px')) ? this.settings.maxWidth + 'px' : this.settings.maxWidth) + '"><div class="bbox'+(this.settings.dark?' dark':'')+'" style="'+(this.settings.background?'background:'+this.settings.background:'')+'"><div class="bbox-header"></div><div class="bbox-body"></div><div class="bbox-footer"><a class="bbox-btn csc-cancel">取消</a><a class="bbox-btn csc-confirm">确定</a></div></div></div></div>');
        $b.css({ 'z-index': this.settings.zIndex, 'display': 'none' }).prop('id', 'bbox-' + this.id);
        this.bbox = $b;
        if (!this.settings.title) {
            $b.find('.bbox-header').remove();
        } else {
            $b.find('.bbox-header').html(this.settings.title);
        }
        var $body = $b.find('.bbox-body');
        var $menubox = $('<div style="border-bottom:1px solid #8487fa"><ul class="scroll-menu"></ul></div>');
        var $sm = $menubox.find('.scroll-menu');
        var $itembox = $('<div class="itembox"></div>');
        this.settings.labels.forEach(function (e, i) {
            $sm.append('<li>' + that.settings.labels[i] + '</li>');
            $itembox.append('<div style="height:40vh;overflow:hidden;margin-top:10px;display:none" class="list-box"><div class="list noborder"><div class="t">'+that.settings.tip+'</div></div></div>');
        });
        //添加一级选项
        var firstList = $itembox.find('.list').eq(0);
        firstList.empty();
        for (var i = 0; i < this.settings.data.length; i++) {
            var dataitem = this.settings.data[i];
            firstList.append('<div class="list-item" data-level="0" data-id="' + dataitem[this.settings.valuename] + '" data-text="' + dataitem[this.settings.textname] + '">' + dataitem[this.settings.textname] + '</div>')
        }

        $body.append($menubox);
        $body.append($itembox);
        if (window.Hammer) {
            $body.find('.list-box').each(function (idx, box) {
                var hm = new Hammer(box);
                hm.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
                hm.on('swipe', function (e) {
                    $(box).stop();
                    var speed = e.deltaY / e.deltaTime;
                    var distance = speed * 300;
                    var targetScrollTop1 = $(box).scrollTop() - distance/2;
                    var targetScrollTop2 = $(box).scrollTop() - distance;
                    var scrollTime1 = Math.abs(Math.ceil(distance / 2 / speed));
                    var scrollTime2 = Math.abs(distance * 2);
                    $(box).animate({ scrollTop: targetScrollTop1 }, scrollTime1, 'linear', function () {
                        $(box).animate({ scrollTop: targetScrollTop2 }, scrollTime2, 'easeOutQuart');
                    });
                });
            });
        }
        $sm.on('menu.change', function (e) {
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
                that.hide();
                if ($(that.target).is('input')) {
                    $(that.target).val(txt);
                    $(that.target).trigger('change');
                }
                if (that.settings.onselect && typeof (that.settings.onselect) == 'function') {
                    that.settings.onselect.call(that, { values: ids, texts: texts, text: txt });
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
            var $currentMenu = $sm.find('li').eq(level);
            $currentMenu.html(text).data({ id: id, text: text });//当前label的文本设选显示值
            if (level < that.settings.labels.length - 1) {
                //当前label所有下级的文本初始化,并清空所有下级的选项
                $currentMenu.nextAll().each(function (idx, ele) {
                    $sm.find('li').eq(nextLevel + idx).html(that.settings.labels[nextLevel + idx]).data({ id: null, text: null });
                    $itembox.find(".list").eq(nextLevel + idx).html('<div class="t">'+that.settings.tip+'</div>');
                });
                var clickedDataItem = that.findClickedDataItem(level, id);
                if (clickedDataItem && clickedDataItem.children) {
                    //为下级列表添加item
                    var $nextList = $itembox.find(".list").eq(nextLevel);
                    $nextList.empty();
                    for (var i = 0; i < clickedDataItem.children.length; i++) {
                        var dataitem = clickedDataItem.children[i];
                        $nextList.append('<div class="list-item" data-level="' + nextLevel + '" data-id="' + dataitem[that.settings.valuename] + '" data-text="' + dataitem[that.settings.textname] + '">' + dataitem[that.settings.textname] + '</div>')
                    }
                    //激活下一级
                    $sm.find('li').eq(nextLevel).trigger('click')
                }
            } else {
                //点击的是最后一级，滚动到最后一级内容完整显示（内容超出时）
                $sm.animate({ scrollLeft: 2000}, 200);
            }
        });
        this.findClickedDataItem = function (clickedLevel, clickedId) {
            var currentData = that.settings.data;
            var currentItem = null;
            for (var i = 0; i <= clickedLevel; i++) {
                var currentId = $sm.find('li').eq(i).data('id');
                if (currentData && currentData.length > 0) {
                    var foundedItems = currentData.filter(function (e) {
                        return e[that.settings.valuename] == currentId;
                    });
                    if (foundedItems.length > 0) {
                        currentItem = foundedItems[0];
                        currentData = currentItem.children;
                    } else {
                        currentItem = null;
                        break;
                    }
                } else {
                    currentItem = null;
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
            $(this.target).off('click');
            this.bbox.remove();
        };
        this.hide = function () {
            this.bbox.find('.bbox').removeClass('ani-slideup');
            this.bbox.hide();
        };
        $('body').append($b);
        $menubox.find('.scroll-menu li').eq(0).trigger('click');
        bboxIdx++;
    }
    var bboxIdx = 50000000;
    $.bbox = function (option) {
        function BBox(op) {
            var that = this;
            if (!op.buttons) {
                op.buttons = { "确定": { action: null } };
            }
            this.settings = { title: "", content: "hello",success:null ,maxWidth:767,dark:false,background:''};
            this.idx = bboxIdx;
            $.extend(this.settings, option);
            this.create = function () {
                var $b = $('<div class="bbox-mask"><div class="bbox-container" style="max-width:' + (typeof (this.settings.maxWidth) == 'number'||(!(this.settings.maxWidth+'').contains('%')&&!(this.settings.maxWidth+'').contains('px')) ? this.settings.maxWidth + 'px' : this.settings.maxWidth) + '"><div class="bbox'+(this.settings.dark?' dark':'')+'" style="'+(this.settings.background?'background:'+this.settings.background:'')+'"><div class="bbox-header"></div><div class="bbox-body"></div><div class="bbox-footer"></div></div></div></div>');
                $b.css('z-index', bboxIdx).prop('id', 'bbox-' + this.idx);
                if (!this.settings.title) {
                    $b.find('.bbox-header').remove();
                } else {
                    $b.find('.bbox-header').html(this.settings.title);
                }
                $b.find('.bbox-body').html(this.settings.content);
                var $footer = $b.find('.bbox-footer');
                for (var b in this.settings.buttons) {
                    var btn = $('<a class="bbox-btn">' + b + '</a>');
                    if (this.settings.buttons[b].style) {
                        btn[0].style = this.settings.buttons[b].style;
                    }
                    btn[0].action = this.settings.buttons[b].action;
                    btn.on('click', function () {
                        var action = this.action;
                        if (action && typeof (action) == 'function') {
                            var returns = action.call(that, that);
                            if (returns !== false) {
                                that.close();
                            }
                        } else {
                            that.close();
                        }
                    });
                    $footer.append(btn);
                }
                bboxIdx++;
                $('body').append($b);
                this.el = $b[0];
                $b.find('.bbox').addClass('ani-slideup');
                if (this.settings.success && typeof (this.settings.success) == 'function') {
                    this.settings.success.call(this, this);
                }
            };

            this.close = function () {
                if (this.settings.close && typeof (this.settings.close) == 'function') {
                    this.settings.close.call(this, this);
                }
                $('#bbox-' + this.idx).remove();
            };
        }

        var bbox = new BBox(option);
        bbox.create();
        return bbox;
    };
    $.alert = $.confirm = function (option) {
        function ConfirmBox(op) {
            var that = this;
            this.settings = { title: "提示", content: "hello", buttons: { "确定": { action: null } }, success: null, maxWidth: 350, titleCenter: true,contentCenter:true,showClose:false,closeBtnColor:'#8a8a8a',dark:false,background:''};
            this.id = 'confirmboxbox-' + getGuid();
            $.extend(this.settings, option);
            this.create = function () {
                var $c = $('<div class="confirmbox-mask"><div class="confirmbox-container" style="max-width:' + (typeof (this.settings.maxWidth) == 'number' || (!(this.settings.maxWidth + '').contains('%') && !(this.settings.maxWidth + '').contains('px')) ? this.settings.maxWidth + 'px' : this.settings.maxWidth) + '"><div class="confirmbox'+(this.settings.dark?' dark':'')+'" style="'+(this.settings.background?'background:'+this.settings.background:'')+'"><div class="confirmbox-header"' + (this.settings.titleCenter ? ' style="justify-content:center"' : '') + '></div><div class="confirmbox-body"' + (this.settings.contentCenter ? 'style=" text-align:center"' : '') + '></div><div class="confirmbox-footer"></div></div></div></div>');
                $c.prop('id', this.id);
                var $hd = $c.find('.confirmbox-header');
                if (!this.settings.title) {
                    $hd.remove();
                } else {
                    $hd.html(this.settings.title);
                }
                if (this.settings.showClose) {
                    $c.find('.confirmbox').append('<a class="rf rf-close confirmbox-close" style="color:'+this.settings.closeBtnColor+'"></a>')
                }
                $c.find('.confirmbox-body').html(this.settings.content);
                var $footer = $c.find('.confirmbox-footer');
                if (this.settings.buttons) {
                    for (var b in this.settings.buttons) {
                        var btn = $('<a class="confirmbox-btn">' + b + '</a>');
                        if (this.settings.buttons[b].style) {
                            btn[0].style = this.settings.buttons[b].style;
                        }
                        btn[0].action = this.settings.buttons[b].action;
                        btn.on('click', function (e) {
                            var action = this.action;
                            if (action && typeof (action) == 'function') {
                                var returns = action.call(that, that);
                                if (returns !== false) {
                                    that.close();
                                }
                            } else {
                                that.close();
                            }
                        });
                        $footer.append(btn);
                    }
                } else {
                    $footer.remove();
                }
                $c.find('.confirmbox-close').on('click', function () {
                    that.close();
                });
                $('body').append($c);
                this.el = $c[0];
                $c.find('.confirmbox').addClass('ani-slideup');
                if (this.settings.success && typeof (this.settings.success) == 'function') {
                    this.settings.success.call(this, this);
                }
            };

            this.close = function () {
                if (this.settings.close && typeof (this.settings.close) == 'function') {
                    this.settings.close.call(this, this);
                }
                $('#' + this.id).remove();
            };
        }

        var cbox = new ConfirmBox(option);
        cbox.create();
        return cbox;
    };
    $.action = $.actionSheet = function (option) {
        function ActionBox(op) {
            var that = this;
            this.settings = { title: false, menu: [], success: null, select: null, maxWidth: 400, cancelText: '取消', maskClose: true,dark:false };
            this.id = 'action-' + getGuid();
            $.extend(this.settings, option);
            this.create = function () {
                var $c = $('<div class="action-mask"><div class="actionbox-container" style="max-width:' + (typeof (this.settings.maxWidth) == 'number'||(!(this.settings.maxWidth+'').contains('%')&&!(this.settings.maxWidth+'').contains('px')) ? this.settings.maxWidth + 'px' : this.settings.maxWidth) + '"><div class="actionbox'+(this.settings.dark?' dark':'')+'"><div class="actionbox-header"></div><div class="actionbox-body"' + (this.settings.textCenter ? 'style=" text-align:center"' : '') + '></div><a class="actionbox-btn actionbox-btn-cancel" data-idx="-1">' + this.settings.cancelText + '</a></div></div></div>');
                $c.prop('id', this.id);
                if (!this.settings.title) {
                    $c.find('.actionbox-header').remove();
                } else {
                    $c.find('.actionbox-header').html(this.settings.title);
                }
                var $body = $c.find('.actionbox-body');
                for (var i = 0; i < this.settings.menu.length; i++) {
                    var btn = $('<a class="actionbox-btn" data-idx="' + i + '">' + this.settings.menu[i] + '</a>');
                    //btn.on('click', function () {
                    //    if (that.settings.select && typeof (that.settings.select) == 'function') {
                    //        that.settings.select.call(that, $(this).index(), $(this).html().trim());
                    //    }
                    //    that.close();
                    //});
                    $body.append(btn);
                }
                $('body').append($c);
                this.el = $c[0];
                $c.find('.actionbox').addClass('ani-slideup');
                if (this.settings.success && typeof (this.settings.success) == 'function') {
                    this.settings.success.call(this, this);
                }
                $c.find('.actionbox-btn').click(function () {
                    if (that.settings.select && typeof (that.settings.select) == 'function') {
                        that.settings.select.call(that, { idx: $(this).data('idx'), text: $(this).html().trim() });
                    }
                    that.close();
                });
                if (this.settings.maskClose) {
                    $c.click(function () {
                        that.close();
                    });
                }
            };

            this.close = function () {
                if (this.settings.close && typeof (this.settings.close) == 'function') {
                    this.settings.close.call(this, this);
                }
                $('#' + this.id).remove();
            };
        }
        var abox = new ActionBox(option);
        abox.create();
        return abox;
    };
})(jQuery);

//---rutil
!(function ($) {
    $.fn.extend({
        initDrop: function (funcs) {
            var el = this[0];
            document.ondragover = function (e) {
                e.preventDefault(); e.stopPropagation();
                if (funcs &&funcs.documentOver) {
                    funcs.documentOver(e);
                }
            };
            document.ondrop = function (e) {
                e.preventDefault(); e.stopPropagation();
                if (funcs &&funcs.documentDrop) {
                    funcs.documentDrop(e);
                }
            };
            document.ondragenter = function (e) {
                if (funcs && funcs.documentEnter) {
                    funcs.documentEnter(e);
                }
            };
            document.ondragleave = function (e) {
                if (funcs && funcs.documentLeave) {
                    funcs.documentLeave(e);
                }
            };

            el.ondragover = function (e) {
                e.preventDefault(); e.stopPropagation();
                if (funcs &&funcs.over) {
                    funcs.over(e);
                }
            };
            el.ondragenter = function (e) {
                if (funcs && funcs.enter) {
                    funcs.enter(e);
                }
            };
            el.ondragleave = function (e) {
                if (funcs && funcs.leave) {
                    funcs.leave(e);
                }
            };
            el.ondrop = function (e) {
                e.preventDefault(); e.stopPropagation();
                if (funcs && funcs.drop) {
                    funcs.drop(e);
                }
            };

        },
        moveToStart: function () {
            var $this = this;
            var $t = this[0];
            if ($t.setSelectionRange) {
                $t.setSelectionRange(0, 0);
                $t.focus();
            } else if ($t.createTextRange) {
                var range = $t.createTextRange();
                range.move("character", 0);
                range.select();
            } else {
                $t.focus();
            }
            return $this;
        },
        moveToEnd: function () {
            var $this = this;
            try {
                var $t = this[0];
                if ($t.setSelectionRange) {
                    $t.setSelectionRange($(this).val().length, $(this).val().length);
                    $t.focus();
                } else if ($t.createTextRange) {
                    var range = $t.createTextRange();
                    range.move("character", $(this).val().length);
                    range.select();
                } else {
                    $t.focus();
                }
            } catch (e) { }
            return $this;
        },
        loading: function (msg) {
            var $this = this;
            if (!msg) {
                msg = 'loading';
            }
            $this.data("rOrgText", $this.html());
            $this.data("isLoading", 1);
            $this.html(msg);
            return $this;
        },
        isLoading: function () {
            return this.data("isLoading") == 1;
        },
        resetLoading: function () {
            var $this = this;
            $this.html($this.data("rOrgText"));
            $this.data("isLoading", 0);
        },
        getJson: function (options) {
            var settings = {
                checkboxValToString: true, removeEmpty: false, selector: 'input:not([type=file]),select,textarea'
            };
            $.extend(settings, options);
            var json = {};
            $.each(this.find(settings.selector), function (i) {
                var el = $(this), key = el.attr('name'), val = $.trim(el.val());
                if (!key) {
                    key = el.attr("id");
                }
                if (key && val !== undefined && val !== null && (!settings.removeEmpty || val != '')) {
                    if (el.is(':checkbox')) {
                        if (!settings.checkboxValToString) {
                            el.prop('checked') && ($.isArray(json[key]) ? json[key].push(val) : json[key] = [val]);
                        } else {
                            el.prop('checked') && (json[key] = json[key] ? json[key] + "," + val : val);
                        }
                    } else if (el.is(':radio')) {
                        el.prop('checked') && (json[key] = val);
                    } else {
                        json[key] = val;
                    }
                }
            });
            return json;
        }, checkInput: function (options) {
            $e = this;
            var settings = { hasTitle: false, invalidClass: "rInvalid" ,showError:false,style:"default"};
            $.extend(settings, options);
            var validateResult = true;
            var firstMsg = "";
            var $inputs;
            var isSingle = false;
            if ($e.is("[vrf]")) {
                $inputs = $e;
                isSingle = true;
            } else {
                $inputs = $e.find("[vrf]");
            }
            $inputs.each(function (i, el) {
                var $el = $(el);
                var vrfd = true;
                var _v = $.trim($el.val());
                var _vl = _v.length;
                var _cl = $el.attr("length");
                var _rq = $el.attr("required");
                var _vr = $el.attr("valueRange");
                var _min = $el.attr("min");
                var _max = $el.attr("max");
                var _isNumber = $el.attr("number");
                var _isInteger = $el.attr("integer");
                var _startWith = $el.attr("startWith");
                var _eqto = $el.attr("equalTo");
                var _eq = $el.attr("equal");
                var _neqto = $el.attr("notEqualTo");
                var _neq = $el.attr("notEqual");
                var _cr = new RegExp($el.attr("regex"), "i");
                if (vrfd && _rq != undefined && _v == "") {
                    vrfd = false;
                }
                if (_v != "" && _cl != undefined) {
                    var min = _cl.split(",")[0];
                    var max = _cl.split(",")[1];
                    if (_vl < min || _vl > max) {
                        vrfd = false;
                    }
                }
                if (vrfd && _v != "" && _cr != undefined && !_cr.test(_v)) {
                    vrfd = false;
                }
                if (vrfd && _v != "" && _isNumber != undefined) {
                    if (isNaN(_v)) {
                        var _temp = parseFloat(_v);
                        if (!isNaN(_temp)) {
                            $el.val(_temp);
                        } else {
                            vrfd = false;
                        }
                    }
                }
                if (vrfd && _v != "" && _vr != undefined) {
                    var min = _vr.split(",")[0];
                    var max = _vr.split(",")[1];
                    if (parseFloat(_v) < parseFloat(min) || parseFloat(_v) > parseFloat(max)) {
                        vrfd = false;
                    }
                }
                if (vrfd && _v != "" && _isInteger != undefined) {
                    if (!/^(-){0,1}[\d]+$/.test(_v)) {
                        var _temp = parseInt(_v);
                        if (!isNaN(_temp)) {
                            $el.val(_temp);
                        } else {
                            vrfd = false;
                        }
                    }
                }
                if (vrfd && _v != "" && _min != undefined) {
                    if (_v < parseFloat(_min)) {
                        $el.val(_min);
                    }
                }
                if (vrfd && _v != "" && _max != undefined) {
                    if (_v > parseFloat(_max)) {
                        $el.val(_max);
                    }
                }
                if (vrfd && _v != "" && _startWith != undefined) {
                    if (_v.indexOf(_startWith) != 0) {
                        vrfd = false;
                    }
                }
                if (vrfd && _eqto != undefined) {
                    if (_v != $(_eqto).val().trim()) {
                        vrfd = false;
                    }
                }
                if (vrfd && _eq != undefined) {
                    if (_v != _eq) {
                        vrfd = false;
                    }
                }
                if (vrfd && _neqto != undefined) {
                    if (_v == $(_neqto).val().trim()) {
                        vrfd = false;
                    }
                }
                if (vrfd && _neq != undefined) {
                    if (_v == _neq) {
                        vrfd = false;
                    }
                }
                if (!vrfd) {
                    if (settings.hasTitle) {
                        setTimeout(function () { $el.prev().addClass(settings.invalidClass) }, 10);
                    }
                    if (validateResult) {
                        validateResult = false;
                        firstMsg = $el.attr("msg") ? $el.attr("msg") : "填写有误";
                    }
                    setTimeout(function () { $el.addClass(settings.invalidClass) }, 10);
                } else {
                    if (settings.hasTitle) {
                        $el.prev().removeClass(settings.invalidClass);
                    }
                    setTimeout(function () { $el.removeClass(settings.invalidClass) }, 10);
                }
            });
            if (!isSingle && settings.showError && !validateResult) {
                showMsg(firstMsg, { style: settings.style });
            }
            return validateResult;
        }, checkAndPost: function (options, validateOptions) {
            var $t = this;
            var settings = { url: null, dataType: "json", extraData: {}, success: null, error: null, complete: null, invalid: null, before: null, beforeSend: null, delay: 0 };
            var validateSettings = { hasTitle: false, invalidClass: "rInvalid" };

            $.extend(settings, options);
            $.extend(validateSettings, validateOptions);
            if (!$t.checkInput(validateSettings)) {
                if (settings.invalid && typeof (settings.invalid) == 'function') {
                    settings.invalid();
                } else {
                    showMsg("填写有误");
                }
            } else {
                var data = $.extend($t.getJson(), settings.extraData);
                if (settings.before && typeof (settings.before) == 'function') {
                    settings.before();
                }
                setTimeout(function () {
                    $.ajax({
                        beforeSend: function (xhr) {
                            if (settings.beforeSend && typeof (settings.beforeSend) == 'function') {
                                settings.beforeSend(xhr);
                            }
                        },
                        url: settings.url, data: data, type: "post", dataType: settings.dataType
                    }).done(function (r) {
                        if (settings.success && typeof (settings.success) == 'function') {
                            settings.success(r);
                        }
                        if (settings.done && typeof (settings.done) == 'function') {
                            settings.done();
                        }
                    }).fail(function (r) {
                        if (settings.error && typeof (settings.error) == 'function') {
                            settings.error(r);
                        }
                        if (settings.fail && typeof (settings.fail) == 'function') {
                            settings.fail(r);
                        }
                    }).always(function () {
                        if (settings.complete && typeof (settings.complete) == 'function') {
                            settings.complete();
                        }
                        if (settings.always && typeof (settings.always) == 'function') {
                            settings.always();
                        }
                    });
                }, settings.delay);
            }
        }, getBackgroundImage: function () {
            var bgImg = this.css("background-image");
            if (bgImg) {
                if (bgImg.indexOf('"') != -1) {
                    bgImg = bgImg.substring(bgImg.indexOf('"') + 1, bgImg.lastIndexOf('"'));
                } else {
                    bgImg = bgImg.substring(bgImg.indexOf('(') + 1, bgImg.indexOf(')'));
                }
            }
            return bgImg;
        }, paging: function (totalCount, pageIdx, pageSize, loadDataFunc, op) {
            var $this = this;
            var settings = { pagingCount: 9, showLastPage: true, showJump: true, showTotal: true, pageSize: false, pageSizeKey: 'pageSize', minPageSize: 5, maxPageSize: 20,hugePageSize:false};
            var id = getGuid(false);
            $.extend(settings, op);
            function getTotalPage() {
                if (totalCount == 0)
                    return 1;
                else {
                    if (totalCount % pageSize == 0) {
                        return totalCount / pageSize;
                    } else {
                        return parseInt(totalCount / pageSize) + 1;
                    }
                }
            }
            var totalPage = getTotalPage();
            function getPagingBtn(pageIdx, enabled) {
                if (enabled) {
                    return '<a class="paging" href="javascript:;" onclick="' + loadDataFunc.replace("{0}", pageIdx) + '">' + pageIdx + '</a>';
                } else {
                    return '<span class="paging current">' + pageIdx + '</span>';
                }
            };
            function getPagings() {
                var html = '<div class="pagings">' + (settings.showTotal ? '<span class="paging_total_count">共' + totalCount + '条</span>' : '');
                html += '<div class="paging-page-box">';
                if (pageIdx > 1) {
                    html += '<a class="paging" href="javascript:;" onclick="' + loadDataFunc.replace("{0}", pageIdx - 1) + '" style="border-radius:3px 0 0 3px">&lt;</a>';
                } else {
                    html += '<span class="paging current">&lt;</span>';
                }
                var leftCount = 3, rightCount = 3;

                if (totalPage <= settings.pagingCount) {//可显示完所有页
                    for (var i = 1; i <= totalPage; i++) {
                        if (pageIdx == i)
                            html += getPagingBtn(i, false);
                        else
                            html += getPagingBtn(i, true);
                    }
                } else {
                    leftCount = settings.pagingCount % 2 == 0 ? parseInt(settings.pagingCount / 2 - 1) : parseInt(settings.pagingCount / 2);
                    rightCount = parseInt(settings.pagingCount / 2);
                    if (pageIdx <= leftCount + 1) {//左连续
                        for (var i = 1; i <= settings.pagingCount - 1; i++) {
                            if (i == pageIdx) {
                                html += getPagingBtn(i, false);
                            } else {
                                html += getPagingBtn(i, true);
                            }
                        }
                        html += '<span class="paging pgdot">...</span>';
                        if (settings.showLastPage) {
                            html += getPagingBtn(totalPage, true);
                        }
                    } else {
                        html += getPagingBtn(1, true);
                        html += '<span class="paging pgdot">...</span>';
                        if (pageIdx >= totalPage - rightCount) {//右连续
                            for (var i = totalPage - (settings.pagingCount - 1) + 1; i <= totalPage; i++) {
                                if (i == pageIdx) {
                                    html += getPagingBtn(i, false);
                                } else {
                                    html += getPagingBtn(i, true);
                                }
                            }
                        } else {//中间连续
                            for (var i = pageIdx - leftCount + 1; i <= pageIdx + rightCount - 1; i++) {
                                if (i == pageIdx)
                                    html += getPagingBtn(i, false);
                                else
                                    html += getPagingBtn(i, true);
                            }
                            html += '<span class="paging pgdot">...</span>';
                            if (settings.showLastPage) {
                                html += getPagingBtn(totalPage, true);
                            }
                        }
                    }
                }
                if (pageIdx < totalPage) {
                    html += '<a class="paging" href="javascript:;" onclick="' + loadDataFunc.replace("{0}", pageIdx + 1) + '">&gt;</a>';
                } else {
                    html += '<span class="paging current">&gt;</span>';
                }
                html += '</div>';
                if (settings.pageSize || settings.showJump) {
                    html+='<div class="paging-op-box">';
                    if (settings.pageSize) {
                        html += '<label class="lb_txtPage">每页</label><select id="pgsize_' + id + '">';
                        for (var i = settings.minPageSize; i <= settings.maxPageSize; i++) {
                            html += '<option value="' + i + '">' + i + '</option>';
                        }
                        if (settings.hugePageSize) {
                            html += '<option value="' + 500 + '">' + 500 + '</option>';
                            html += '<option value="' + 1000 + '">' + 1000 + '</option>';
                            html += '<option value="' + 1500 + '">' + 1500 + '</option>';
                            html += '<option value="' + 2000 + '">' + 2000 + '</option>';
                        }
                        html += '</select><label class="lb_txtPage">条</label>';
                    }
                    if (settings.showJump) {
                        
                        html += '<label class="lb_txtPage">转到第</label><input type="text" id="pgt_' + id + '" value="' + pageIdx + '" class="txtPage"/><label class="lb_txtPage">页</label><a id="pgb_' + id + '" class="lb_txtPage btn_jumpToPage">GO</a>'
                    }
                    html+='</div>';
                }
                return html + '</div>';
            }
            $this.html(getPagings());
            var _pageSize = parseInt(window.localStorage.getItem(settings.pageSizeKey));
            if (!_pageSize) {
                _pageSize = pageSize;
                window.localStorage.setItem(settings.pageSizeKey, _pageSize);
            } else {
                if (_pageSize < settings.minPageSize) {
                    _pageSize = settings.minPageSize;
                    window.localStorage.setItem(settings.pageSizeKey, _pageSize);
                }
                if (_pageSize > settings.maxPageSize) {
                    if (!settings.hugePageSize) {
                        _pageSize = settings.maxPageSize;
                        window.localStorage.setItem(settings.pageSizeKey, _pageSize);
                    }
                }
            }
            $('#pgsize_' + id).val(_pageSize);
            $('#pgsize_' + id).on('change', function () {
                window.localStorage.setItem(settings.pageSizeKey, $(this).val());
                eval(loadDataFunc.replace("{0}", pageIdx));
            });
            function getPageTxtVal($t) {
                var _v = $t.val().trim();
                _v = parseInt(_v);
                if (isNaN(_v)) {
                    $t.val(pageIdx);
                    _v = pageIdx
                } else {
                    if (_v < 1) {
                        _v = 1; $t.val(_v);
                    } else if (_v > totalPage) {
                        _v = totalPage; $t.val(_v);
                    }
                }
                return _v;
            }

            $('#pgt_' + id).keyup(function (e) {
                if (e.keyCode == 13) {
                    var pg = getPageTxtVal($(this));
                    if (pg != pageIdx) {
                        eval(loadDataFunc.replace("{0}", pg));
                    }
                }
            }).click(function () {
                $(this).select();
            });
            $('#pgb_' + id).click(function () {
                var pg = getPageTxtVal($('#pgt_' + id));
                if (pg != pageIdx) {
                    eval(loadDataFunc.replace("{0}", pg));
                }
            });
        }
        ,isVisible: function (bottomThreshHold, topThreasHold,topOnly) {
            var $t = this;
            if (bottomThreshHold == undefined || bottomThreshHold == null) {
                bottomThreshHold = 0;
            }
            if (topThreasHold == undefined || topThreasHold == null) {
                topThreasHold = 0;
            }
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var winHeight = $(window).height();
            var eleTopToTop = $t.offset().top - scrollTop;
            var eleTopToBottom = winHeight - eleTopToTop;
            if (topOnly) {
                return eleTopToBottom >= bottomThreshHold && eleTopToTop >= topThreasHold;
            } else {
                var eleBottomToTop = eleTopToTop + $t.height();
                return eleTopToBottom >= bottomThreshHold && eleBottomToTop >= topThreasHold;
            }
        },
        isVisibleByRatio: function (bottomThreshHold, topThreasHold,topOnly) {
            var $t = this;
            if (bottomThreshHold == undefined || bottomThreshHold == null) {
                bottomThreshHold = 0;
            }
            if (topThreasHold == undefined || topThreasHold == null) {
                topThreasHold = 0;
            }
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var winHeight = $(window).height();
            var eleTopToTop = $t.offset().top - scrollTop;
            var eleTopToBottom = winHeight - eleTopToTop;
            if (topOnly) {
                return eleTopToBottom >= winHeight * bottomThreshHold && eleTopToTop >= winHeight * topThreasHold;
            }
            else {
                var eleBottomToTop = eleTopToTop + $t.height();
                return eleTopToBottom >= winHeight * bottomThreshHold && eleBottomToTop >= winHeight * topThreasHold;
            }
        }, reachBottom: function (threashHold) {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var leftDistance = $('html').height() - scrollTop - $(window).height();
            return leftDistance <= threashHold;
        }, getTransform: function (transform) {
            var $t = this;
            var trans = $t.css('transform');
            if (!trans) {
                return undefined;
            }
            var reg = new RegExp('/' + transform + '\((.+?)\)/');
            var arr;
            if (arr = trans.match(reg)){
                if (arr.length > 1) {
                    return arr[1];
                }
            }
            return undefined;
        }, getTransformD: function (transform) {
            var trans = this.getTransform(transform);
            if (trans == undefined) {
                return 0;
            }
            var d = parseFloat(trans);
            if (!isNaN(d)) {
                return d;
            }
            return 0;
        }
    });
    $(document).on('blur', '[vrf]', function () {
        $(this).checkInput();
    }).on('keyup', '[vrf]', function () {
        $(this).checkInput();
    }).on('change', '[vrf]', function () {
        $(this).checkInput();
    });
})(jQuery);

var isNavShowing = false, navAnimating = false, currentScroll;
$(function () {
    var canToggleNavVisible = true;
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
    function toggleSideBox() {
        canToggleNavVisible = false;
        $('body').toggleClass('sidebox-open');
        if ($('body').is('.sidebox-open')) {
            enableScroll(false);
        } else {
            enableScroll(true);
            setTimeout(function () { canToggleNavVisible = true; }, 500);//关闭一段时间后才可触发窗口滚动导致的nav是否可见（enableScroll导致的窗口滚动事件）
        }
    }
    $('.nav-toggle').click(function () {
        toggleSideBox();
    });
    $('.body-mask').click(function () {
        toggleSideBox();
    });
    $('.side-box>ul>li>a').click(function () {
        var $t = $(this).parent();
        var $next=$(this).next();
        var nextIsUl = $next.is('ul');
        if ($t.hasClass('open')) {
            $t.removeClass('open');
            if (nextIsUl) {
                $next.slideUp(200);
            }
        } else {
            if (nextIsUl) {
                $t.addClass('open').siblings().removeClass('open');
                $next.slideDown();
                $t.siblings().find('ul').slideUp(200);
            } else {
                toggleSideBox();
            }
        }
    });
    $('.side-box>ul ul>li>a').click(function () {
        toggleSideBox();
    });
    $('.progress').each(function (i, el) {
        var val = $(el).data('value');
        if (val) {
            $(el).progress(val);
        }
    });
    //初始化solider手柄位置
    $('.slider').each(function (i, e) {
        $(e).slideTo($(e).data('value'));
    });
    $('input[type=checkbox],input[type=radio]').each(function (i, e) {
        var label = $(e).parent();
        if (label.is(".checkbox")) {
            if (e.checked) {
                if (!label.hasClass('checked')) {
                    label.addClass('checked');
                }
            } else {
                label.removeClass('checked');
            }

            if (e.disabled) {
                if (!label.hasClass('disabled')) {
                    label.addClass('disabled');
                }
            }
        }
    });
    function showNav(show) {
        //非动画状态或相反时
        if (!navAnimating || (navAnimating && isNavShowing != show)) {
            var $nav = $('.navbar:not(.static)');
            navAnimating = true;
            isNavShowing = show;
            if (show) {
                $nav.removeClass('hide');
            } else {
                $nav.addClass('hide');
            }
            setTimeout(function () {
                navAnimating = false;
            }, 500);
        }
    }
    function checkScrollIn() {
        $('.scroll-trigger').each(function (i, e) {
            var $t = $(e);
            var threshold = $t.data('thresholdbottom');
            if (threshold == undefined) {
                threshold = 0;
            }
            var thresholdtop = $t.data('thresholdtop');
            if (thresholdtop == undefined) {
                thresholdtop = 0;
            }
            var thisTop = $t.offset().top;
            var isVisible = $t.isVisible(threshold, thresholdtop);
            if (isVisible) {
                if (!$t.hasClass('shown')) {
                    $t.addClass('shown');
                    $t.trigger($.Event("scroll.in"));
                }
            } else {
                if ($t.hasClass('shown')) {
                    $t.removeClass('shown');
                    $t.trigger($.Event("scroll.out"));
                }
            }
        })
    }
    window.checkScrollIn = checkScrollIn;
    checkScrollIn();
    $(window).on('scroll', function () {
        var sc = $(window).scrollTop();
        if (canToggleNavVisible) {
            if (sc >= 100) {
                $('.navbar:not(.static)').addClass('transparent');
                if (sc > currentScroll) {
                    showNav(false);
                } else {
                    showNav(true);
                }
            } else {
                $('.navbar').removeClass('transparent');
                showNav(true);
            }
        }
        currentScroll = sc;
        checkScrollIn();
    });
    $(document).on('click', '.tab-header', function (e) {
        var $t = $(this);
        var $tab = $t.closest('.tab');
        var newIdx = $t.index();
        var $c = $tab.find('.tab-content').eq(newIdx);
        var oldIdx = $tab.find('.tab-header.actived').index();

        var evt = $.Event("tab.click", { detail: { newIdx: newIdx, oldIdx: oldIdx, data: $t.data() } });
        $tab.trigger(evt);

        if (newIdx != oldIdx) {
            if (!$t.hasClass('actived')) {
                $t.addClass('actived');
            }
            if (!$c.hasClass('actived')) {
                $c.addClass('actived');
            }
            $t.siblings().removeClass('actived');
            $c.siblings().removeClass('actived');
            evt = $.Event("tab.change", { detail: { newIdx: newIdx, oldIdx: oldIdx, data: $t.data() } });
            $tab.trigger(evt);
        }
    })
    .on('click', '.dropdown:not(.hover)', function (e) {
        var $t = $(this);
        if (!$t.hasClass('open')) {
            if ($t.hasClass('ani')) {
                if (!$t.hasClass('up')) {
                    $t.children('.menu').addClass('ani-bounceinT');
                } else {
                    $t.children('.menu').addClass('ani-bounceinB');
                }
            }
            $t.addClass('open');
        } else {
            $t.removeClass('open');
        }
    }).on('mouseenter', '.dropdown.hover', function (e) {
        var $t = $(this);
        if (!$t.hasClass('open')) {
            if ($t.hasClass('ani')) {
                if (!$t.hasClass('up')) {
                    $t.children('.menu').addClass('ani-bounceinT');
                } else {
                    $t.children('.menu').addClass('ani-bounceinB');
                }
            }
            $t.addClass('open');
        }
    }).on('mouseleave', '.dropdown', function () {
        $(this).removeClass('open').removeClass('ani-bounceinT').removeClass('ani-bounceinB');
    }).on('click', function (e) {
        if (!$(e.target).is('.dropdown') && !$(e.target).is('.dropdown>a') && !$(e.target).is('.dropdown>.rf') && !$(e.target).closest('a').is('.dropdown>a')) {
            $('.dropdown').removeClass('open').removeClass('ani-bounceinT').removeClass('ani-bounceinB');
        }
    }).on('keydown', function (e) {
        if (e.keyCode == 27 || e.key == "Escape") {
            $('.dropdown').removeClass('open').removeClass('ani-bounceinT').removeClass('ani-bounceinB');
        }
    })
    .on('click', '.number:not(.disabled) .minus', function () {
        var $this = $(this);
        var $input = $this.closest('.number').find('input');
        var currentVal = $input.val().trim();
        if (!currentVal) {
            currentVal = 0;
        }
        var _temp = parseFloat(currentVal);
        if (isNaN(_temp)) {
            _temp = 0;
        }
        var step = $input.attr('step');
        if (!step) {
            step = 1;
        } else {
            step = parseFloat(step);
        }
        var indexOfPoint = (step + "").indexOf(".");
        var keep = indexOfPoint==-1?0:(step + "").substring(indexOfPoint+1).length;
        _temp -= step;
        $input.val(parseFloat(_temp.toFixed(keep)));
        $input.trigger('change');
    })
    .on('click', '.number:not(.disabled) .plus', function () {
        var $this = $(this);
        var $input = $this.closest('.number').find('input');
        var currentVal = $input.val().trim();
        if (!currentVal) {
            currentVal = 0;
        }
        var _temp = parseFloat(currentVal);
        if (isNaN(_temp)) {
            _temp = 0;
        }
        var step = $input.attr('step');
        if (!step) {
            step = 1;
        } else {
            step = parseFloat(step);
        }
        var indexOfPoint = (step + "").indexOf(".");
        var keep = indexOfPoint==-1?0:(step + "").substring(indexOfPoint+1).length;
        _temp += step;
        $input.val(parseFloat(_temp.toFixed(keep)));
        $input.trigger('change');
    }).on('click', '.alert .close', function () {
        var $a = $(this).closest('.alert');
        $a.slideUp(200, function () {
            $a.remove();
        })
    })
    .on('click', '.scroll-menu li', function (e) {
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

            var scrollLeft = $t.offsetP().left + $s.scrollLeft();//把选中菜单滚动到靠左边时的scrollLeft
            $s.animate({scrollLeft: scrollLeft + $t.outerWidth() / 2 - $s.width()/2}, 200);//选中菜单移到中间
        }
    })
    .on('click', '.switch:not(.disabled)', function () {
        var $t = $(this);
        $t.toggleClass('actived');
        var evt = $.Event("change", { detail: { value: $t.hasClass('actived') } });
        $t.trigger(evt);
    })
    .on('change', 'input[type=checkbox]', function () {
        var label = $(this).parent();
        if (label.is(".checkbox")) {
            if (this.checked) {
                if (!label.hasClass('checked')) {
                    label.addClass('checked');
                }
            } else {
                label.removeClass('checked');
            }
        }
    })
    .on('change', 'input[type=radio]', function () {
        var label = $(this).parent();
        if (label.is(".checkbox")) {
            if (this.checked) {
                if (!label.hasClass('checked')) {
                    label.addClass('checked');
                }
            } else {
                label.removeClass('checked');
            }
        }
        var name = $(this).prop('name');
        $('[name=' + name + ']').not($(this)).parent().filter('.checkbox').removeClass('checked');
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

    $(document).on('click', '.accordion dt', function () {
        var $t = $(this);
        var $accrd = $t.closest('.accordion');
        var multiple = $accrd.is('.multiple');
        var $dd = $t.next().filter('dd');
        if ($t.is('.open')) {
            $t.removeClass('open');
            $dd.slideUp(200);
        } else {
            if ($dd.length>0) {
                $t.addClass('open');
                $dd.slideDown(200);
                if (!multiple) {
                    $t.siblings().filter('dt').removeClass('open');
                    $dd.siblings().filter('dd').slideUp(200);
                }
            }
        }
    }).on('click', '.slider:not(.disabled)', function (e) {
        //非点击手柄时才移动
        if ($(e.target).is('.slider')) {
            var $s = $(this);
            sliderSlided(e, $s);
        }
    })
    .on('touchstart', ".slider:not('.disabled') .handle", sliderEventDown)
    .on('mousedown', ".slider:not('.disabled') .handle", sliderEventDown)
    .on('touchmove', ".slider:not('.disabled') .handle", sliderEventMove)
    .on('mousemove',sliderEventMove)
    .on('touchend',".slider:not('.disabled') .handle",sliderEventUp)
    .on('mouseup',sliderEventUp);
    var sliderMouseIsDown = false;
    var $currentSlider;
    function sliderEventDown(e) {
        e.stopPropagation();
        $currentSlider = $(this).closest('.slider');
        sliderMouseIsDown = true;
    }
    function sliderEventMove(e) {
        if (sliderMouseIsDown) {
            e.preventDefault();
            if (e&&e.originalEvent) {
                e = e.originalEvent;
            }
            if (e && e.changedTouches) {
                e = e.changedTouches[e.changedTouches.length - 1];
            }
            sliderSlided(e, $currentSlider);
        }
    }
    function sliderEventUp(e) {
        e.stopPropagation();
        $currentSlider = null;
        sliderMouseIsDown = false;
    };
    function sliderSlided(e, $s) {
        var $h = $s.find('.handle');
        var hw = $h.outerWidth();
        var x = e.pageX - $s.offset().left-hw/2;
        if (x < 0) {
            x = 0;
        }
        var maxX = $s.outerWidth() - hw;
        if (x > maxX) {
            x = maxX;
        }
        var step=parseFloat($s.attr('step'));
        var min = parseFloat($s.attr('min'));
        var max = parseFloat($s.attr('max'));
        if (isNaN(step)) {
            step = 1;
        }
        if (isNaN(min)) {
            min = 0;
        }
        if (isNaN(max)) {
            max = min + 100;
        }
        var val = min + (max - min) * x / maxX;//根据x计算得到的值
        val = Math.floor(val / step) * step;//根据step重新计算值
        val = parseInt(val * 10) / 10;//解决精度问题
        if (val < min) {
            val = min;
        }
        if (val > max) {
            val = max;
        }
        $s.slideTo(val);
        $s.data('value', val);
        $s.trigger($.Event("change", { detail: { value: val } }));
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
    $(window).on('resize', function () {
        //resize时设置slider手柄位置
        $('.slider').each(function (i, e) {
            $(e).slideTo($(e).data('value'));
        });
        if ($('body').is('.sidebox-open') && $(window).width() > 767) {
            toggleSideBox();
        }
    })
});

var compressImageTempUrl;
//压缩图片，Promise
function compressImage(imageFile, options) {
    //fixedWidth false:只压缩宽度>maxWidth的图片，true：无论大小，都压缩到maxWidth
    //loading/processing 加载时要调用的方法，处理图片时调用的方法
    var settings = { maxWidth: 800, fixedWidth: false, quality: 0.9, loading: null, processing: null };
    $.extend(settings, options);
    return new Promise(function (resolve, reject) {
        //读取图片为objecturl或dataurl (objecturl优先，微信dataurl有时很慢)
        if (imageFile.type.indexOf("image") < 0) {
            reject("不支持的图片格式");
        } else {
            if (settings.loading && typeof (settings.loading) == 'function') {
                settings.loading();
            }
            var imageUrl;
            if (window.URL) {
                imageUrl = window.URL.createObjectURL(imageFile);
                compressImageTempUrl = imageUrl;
                resolve(imageUrl);
            } else {
                var reader = new FileReader();
                reader.onload = function (r) {
                    imageUrl = reader.result;
                    compressImageTempUrl = imageUrl;
                    resolve(imageUrl);
                };
                reader.readAsDataURL(imageFile);
            }
        }
    }).then(function (imageUrl) {
        //加载图片
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function () {
                if (window.URL && compressImageTempUrl) {
                    window.URL.revokeObjectURL(compressImageTempUrl); compressImageTempUrl = null;
                }
                reject("加载图片失败");
            };
            img.src = imageUrl;
        });
    }).then(function (img) {
        //处理图片
        return new Promise(function (resolve, reject) {
            try {
                if (settings.processing && typeof (settings.processing) == 'function') {
                    settings.processing();
                }
                var _canvas = document.createElement('canvas');
                if (img.width > settings.maxWidth || settings.fixedWidth) {
                    _canvas.width = settings.maxWidth;
                    _canvas.height = parseInt(settings.maxWidth * img.height / img.width);
                } else {
                    _canvas.width = img.width;
                    _canvas.height = img.height;
                }
                var _context = _canvas.getContext('2d');
                _context.drawImage(img, 0, 0, _canvas.width, _canvas.height);
                var dataurl = _canvas.toDataURL("image/jpeg", settings.quality);
                if (window.URL && compressImageTempUrl) {
                    window.URL.revokeObjectURL(compressImageTempUrl); compressImageTempUrl = null;
                }
                resolve(dataurl);
            } catch (err) {
                reject("压缩图片失败")
            }
        });
    });
}
//压缩图片，普通方式
function compressImage1(imageFile, options) {
    var settings = { maxWidth: 800, fixedWidth: false, quality: 0.9, loading: null, processing: null, error: null, success: null };
    $.extend(settings, options);
    if (imageFile.type.indexOf("image") < 0) {
        if (settings.error && typeof (settings.error) == 'function') {
            settings.error("不支持的图片格式");
        }
    } else {
        if (settings.loading && typeof (settings.loading) == 'function') {
            settings.loading();
        }
        function doCompress(img) {
            try {
                if (settings.processing && typeof (settings.processing) == 'function') {
                    settings.processing();
                }
                var _canvas = document.createElement('canvas');
                if (img.width > settings.maxWidth || settings.fixedWidth) {
                    _canvas.width = settings.maxWidth;
                    _canvas.height = parseInt(settings.maxWidth * img.height / img.width);
                } else {
                    _canvas.width = img.width;
                    _canvas.height = img.height;
                }
                var _context = _canvas.getContext('2d');
                _context.drawImage(img, 0, 0, _canvas.width, _canvas.height);
                var dataurl = _canvas.toDataURL("image/jpeg", settings.quality);
                if (window.URL && compressImageTempUrl) {
                    window.URL.revokeObjectURL(compressImageTempUrl); compressImageTempUrl = null;
                }
                if (settings.success && typeof (settings.success) == 'function') {
                    settings.success(dataurl);
                }
            } catch (err) {
                if (settings.error && typeof (settings.error) == 'function') {
                    settings.error("压缩图片失败");
                }
            }
        }
        function loadImage(imageUrl) {
            var img = new Image();
            img.onload = function () {
                doCompress(img);
            };
            img.onerror = function () {
                if (window.URL && compressImageTempUrl) {
                    window.URL.revokeObjectURL(compressImageTempUrl); compressImageTempUrl = null;
                }
                if (settings.error && typeof (settings.error) == 'function') {
                    settings.error("加载图片失败");
                }
            };
            img.src = imageUrl;
        }

        var imageUrl;
        if (window.URL) {
            imageUrl = window.URL.createObjectURL(imageFile);
            compressImageTempUrl = imageUrl;
            loadImage(imageUrl);
        } else {
            var reader = new FileReader();
            reader.onload = function (r) {
                imageUrl = reader.result;
                compressImageTempUrl = imageUrl;
                loadImage(imageUrl);
            };
            reader.readAsDataURL(imageFile);
        }
    }
}
//根据图片url压缩图片，Promise
function compressImageFromUrl(imgUrl, options) {
    var settings = { maxWidth: 800, fixedWidth: false, quality: 0.9, loading: null, processing: null };
    $.extend(settings, options);
    //加载图片
    return new Promise(function (resolve, reject) {
        if (settings.loading && typeof (settings.loading) == 'function') {
            settings.loading();
        }
        var img = new Image();
        img.setAttribute('crossOrigin', 'Anonymous');
        img.onload = function () {
            resolve(img);
        };
        img.onerror = function () {
            reject("加载图片失败");
        };
        img.src = imgUrl;
    }).then(function (img) {
        //处理图片
        return new Promise(function (resolve, reject) {
            if (settings.processing && typeof (settings.processing) == 'function') {
                settings.processing();
            }
            try {
                if (settings.processing && typeof (settings.processing) == 'function') {
                    settings.processing();
                }
                var _canvas = document.createElement('canvas');
                if (img.width > settings.maxWidth || settings.fixedWidth) {
                    _canvas.width = settings.maxWidth;
                    _canvas.height = parseInt(settings.maxWidth * img.height / img.width);
                } else {
                    _canvas.width = img.width;
                    _canvas.height = img.height;
                }
                var _context = _canvas.getContext('2d');
                _context.drawImage(img, 0, 0, _canvas.width, _canvas.height);
                var dataurl = _canvas.toDataURL("image/jpeg", settings.quality);
                resolve(dataurl);
            } catch (err) {
                reject("压缩图片失败")
            }
        });
    });
}
//根据图片url压缩图片
function compressImageFromUrl1(imgUrl,options) {
    var settings = { maxWidth: 800, fixedWidth: false, quality: 0.9, loading: null, processing: null, error: null, success: null };
    $.extend(settings, options);
    if (settings.loading && typeof (settings.loading) == 'function') {
        settings.loading();
    }
    function doCompress(img) {
        try {
            if (settings.processing && typeof (settings.processing) == 'function') {
                settings.processing();
            }
            var _canvas = document.createElement('canvas');
            if (img.width > settings.maxWidth || settings.fixedWidth) {
                _canvas.width = settings.maxWidth;
                _canvas.height = parseInt(settings.maxWidth * img.height / img.width);
            } else {
                _canvas.width = img.width;
                _canvas.height = img.height;
            }
            var _context = _canvas.getContext('2d');
            _context.drawImage(img, 0, 0, _canvas.width, _canvas.height);
            var dataurl = _canvas.toDataURL("image/jpeg", settings.quality);
            if (settings.success && typeof (settings.success) == 'function') {
                settings.success(dataurl);
            }
        } catch (err) {
            if (settings.error && typeof (settings.error) == 'function') {
                settings.error("压缩图片失败");
            }
        }
    }
    function loadImage(imageUrl) {
        var img = new Image();
        img.setAttribute('crossOrigin', 'Anonymous');
        img.onload = function () {
            doCompress(img);
        };
        img.onerror = function () {
            if (settings.error && typeof (settings.error) == 'function') {
                settings.error("加载图片失败");
            }
        };
        img.src = imageUrl;
    }

    loadImage(imgUrl);
}
var _rr_msg_timeout;
var _rr_styles = ['default', 'success', 'error', 'danger', 'info', 'light'];
function showMsg(msg, opts) {
    $("#_rr_msg_box").remove();
    clearTimeout(_rr_msg_timeout);
    var settings = { bg: "rgba(0,0,0,0.85)", color: "#fff", fontSize: "15px", border: "1px solid #000", position: "middle", time: 2000, zIndex: 99990000, style: "default", end: null };
    if (opts) {
        $.extend(settings, opts);
    }
    getRMsgStyle(settings);
    $("body").append('<div id="_rr_msg_box" class="flex-vhc" style="position:fixed;left:0;top:0;bottom:0;right:0;z-index:' + settings.zIndex + '"><div id="_rr_msg" style="margin-top:12px;margin-bottom:12px;background:' + settings.bg + ';color:' + settings.color + ';font-size:' + settings.fontSize + ';border-radius:3px;text-align:center;padding:15px 20px;box-shadow:0 0 0.5em #555;max-width:300px;work-break:break-all;work-wrap:break-word">' + msg + '</div></div>');
    var $p = $("#_rr_msg_box");
    if (settings.position == "top") {
        $p.css('align-items','flex-start');
    } else if (settings.position == "bottom") {
        $p.css('align-items','flex-end');
    }
    _rr_msg_timeout = setTimeout(function () { $("#_rr_msg_box").remove(); if (typeof (settings.end) == "function") { end(); } }, settings.time);
}
function getRMsgStyle(settings) {
    if (!_rr_styles.contains(settings.style, true)) {
        settings.style = "default";
    }
    settings.style = settings.style.toLowerCase();
    if (settings.style == "success") {
        settings.bg = "#dff0d8"; settings.color = "#468847"; settings.border = "1px solid #d6e9c6";
    } else if (settings.style == "error") {
        settings.bg = "#f37b1d"; settings.color = "#fff"; settings.border = "1px solid #e56c0c";
    } else if (settings.style == "danger") {
        settings.bg = "#f2dede"; settings.color = "#b94a48"; settings.border = "1px solid #eed3d7";
    } else if (settings.style == "info") {
        settings.bg = "#d9edf7"; settings.color = "#31708f"; settings.border = "1px solid #bce8f1";
    }else if(settings.style == "light") {
        settings.bg = "#fff"; settings.color = "#000"; settings.border = "1px solid #ddd";
    }
}
function showLoading(msg, opts) {
    if (msg) {
        $("#_rr_wait_msg_box").remove();
        var settings = { bg: "rgba(0,0,0,0.85)", color: "#fff", fontSize: "15px", border: "1px solid #000", position: "middle", zIndex: 99900000, style: "default", end: null,icon:1};
        if (opts) {
            $.extend(settings, opts);
        }
        getRMsgStyle(settings);
        $("body").append('<div style="position:fixed;left:0;top:0;right:0;bottom:0;z-index:'+settings.zIndex+'" class="flex-vhc" id="_rr_wait_msg_box"><div id="_rr_wait_msg" style="margin-top:12px;margin-bottom:12px;background:' + settings.bg + ';color:' + settings.color + ';font-size:' + settings.fontSize + ';border-radius:3px;z-index;text-align:center;padding:15px 20px;box-shadow:0 0 0.5em #555">' + (settings.icon?'<div class="flex-vhc pt-5 pb-5"><div class="'+(settings.icon==1?'loading-icon':'loading-icon1')+'"></div></div>':'') + '<span>' + msg + '<span id="_rr_wait_msg_per" style="font-size:15px;color:' + settings.color + '"></span></span></div></div>');
        $p=$('#_rr_wait_msg_box');
        if (settings.position == "top") {
            $p.css('align-items','flex-start');
        } else if (settings.position == "bottom") {
            $p.css('align-items','flex-end');
        }
    } else {
        $("#_rr_wait_msg_box").remove();
    }
}
function setLoadingPercent(p) {
    $('#_rr_wait_msg_per').html(p);
}
function showMask(show, opts) {
    var settings = { opacity: 0.3, zIndex: 90000000, bg: "#000000" };
    if (show) {
        $("#_rr_mask").remove();
        if (opts) {
            $.extend(settings, opts);
        }
        $("body").append('<div id="_rr_mask" style="position:fixed;left:0;top:0;right:0;bottom:0;opacity:' + settings.opacity + ';background:' + settings.bg + ';z-index:' + settings.zIndex + ';"></div>');
    } else {
        $("#_rr_mask").remove();
    }
}
//是否可滚动
function enableScroll(enable) {
    if (!enable) {
        var top = $(document).scrollTop();
        $("html").css({"position":"fixed","top": 0 - top, "width": "100%", "overflow-y": "scroll" });
    } else {
        var top = parseInt($("html").css("top"));
        $("html").removeAttr("style");
        $(document).scrollTop(0 - top);
    }
}
function getPureUrl(url) {
    if (url.indexOf("#") != -1) {
        url = url.substr(0, url.indexOf("#"));
    }
    if (url.indexOf("!") != -1) {
        url = url.substr(0, url.indexOf("!"));
    }

    if (url.indexOf("?") != -1) {
        url = url.substr(0, url.indexOf("?"));
    }
    return url;
}
Date.prototype.addYears = function (years) {
    years = parseInt(years);
    var newDT = new Date(this.getFullYear() + years, this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
    //newDT当月天数不够，会导致newDT为下一月，date设为0回到上月最后一天
    if (newDT.getMonth() != this.getMonth()) {
        newDT = new Date(newDT.getFullYear(), newDT.getMonth(), 0, newDT.getHours(), newdt.getMinutes().newdt.getSeconds());
    }
    return newDT;
};
Date.prototype.addMonths = function (months) {
    months = parseInt(months);
    var _month = this.getMonth() + months;
    var _year = this.getFullYear();
    while (_month < 0) {
        _month = _month + 12;
        _year--;
    }
    var newDT = new Date(_year, _month, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
    if (newDT.getMonth() != _month % 12) {
        newDT = new Date(newDT.getFullYear(), newDT.getMonth(), 0, newDT.getHours(), newdt.getMinutes().newdt.getSeconds());
    }
    return newDT;
};
Date.prototype.addDays = function (days) {
    days = parseInt(days);
    var _t = this.getTime();
    var newDT = new Date(this.getFullYear(), this.getMonth(), this.getDate() + days, this.getHours(), this.getMinutes(), this.getSeconds());
    return newDT;
};
Date.prototype.addHours = function (hours) {
    hours = parseInt(hours);
    var _t = this.getTime();
    var newDT = new Date();
    newDT.setTime(_t + hours * 3600000);
    return newDT;
};
Date.prototype.addMinutes = function (minutes) {
    minutes = parseInt(minutes);
    var _t = this.getTime();
    var newDT = new Date();
    newDT.setTime(_t + minutes * 60000);
    return newDT;
};
Date.prototype.addSeconds = function (seconds) {
    seconds = parseInt(seconds);
    var _t = this.getTime();
    var newDT = new Date();
    newDT.setTime(_t + seconds * 1000);
    return newDT;
};
Date.prototype.format = function (fmt) {
    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    var date = this.getDate();
    var h = this.getHours();
    var h12 = this.getHours() % 12;
    var m = this.getMinutes();
    var s = this.getSeconds();
    fmt = fmt.replace('yyyy', year).replace('yy', (year + '').substring(2));
    fmt = fmt.replace('MM', month < 10 ? '0' + month : month).replace('M', month);
    fmt = fmt.replace('dd', date < 10 ? '0' + date : date).replace('d', date);
    fmt = fmt.replace('HH', h < 10 ? '0' + h : h).replace('H', h);
    fmt = fmt.replace('hh', h12 < 10 ? '0' + h12 : h12).replace('h', h12);
    fmt = fmt.replace('mm', m < 10 ? '0' + m : m).replace('m', m);
    fmt = fmt.replace('ss', s < 10 ? '0' + s : s).replace('s', s);
    return fmt;
};
Date.prototype.getMonthDayCount = function () {
    var nextMonth = this.addMonths(1);
    var lastDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 0);
    return lastDate.getDate();
};
Array.prototype.contains = function (v, ignoreCase) {
    for (var i = 0; i < this.length; i++) {
        if (ignoreCase) {
            if ((this[i] + "").toLowerCase() == (v + "").toLowerCase()) {
                return true;
            }
        } else {
            if (this[i] == v) {
                return true;
            }
        }
    }
    return false;
};
Array.prototype.containsObject = function (obj, propName) {
    var _v = obj[propName];
    for (var i = 0; i < this.length; i++) {
        if (this[i][propName] == _v) {
            return true;
        }
    }
    return false;
};
Array.prototype.containsObjectWithValue = function (propName, val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][propName] == val) {
            return true;
        }
    }
    return false;
};
//find all
Array.prototype.findObjectByValue = function (propName, val) {
    var finded = [];
    for (var i = 0; i < this.length; i++) {
        if (this[i][propName] == val) {
            finded.push(this[i]);
        }
    }
    return finded;
};
//find one
Array.prototype.getObjectByValue = function (propName, val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][propName] == val) {
            return this[i];
        }
    }
    return null;
};
Array.prototype.existsObjectByValue = function (propName, val) {
  for (var i = 0; i < this.length; i++) {
      if (this[i][propName] == val) {
          return true;
      }
  }
  return false;
};
Array.prototype.removeObjectByValue = function (propName, val) {
  var toRemoveIdx=[];
  for (var i = 0; i < this.length; i++) {
      if (this[i][propName] == val) {
        toRemoveIdx.push(i);
      }
  }
  for(var i=toRemoveIdx.length-1;i>=0;i--){
    this.splice(toRemoveIdx[i],1);
  }
};
Array.prototype.pushToStart=Array.prototype.prepend=function(item){
  this.splice(0,0,item);
};
Array.prototype.removeValue = function (val, ignoreCase) {
    var toRemoveIdx = [];
    for (var i = 0; i < this.length; i++) {
        if (ignoreCase) {
            if ((this[i] + '').toLowerCase() == (val + '').toLowerCase()) {
                toRemoveIdx.push(i);
            }
        } else {
            if (this[i] == val || this[i] + '' == val + '') {
                toRemoveIdx.push(i);
            }
        }
    }
    for (var i = toRemoveIdx.length - 1; i >= 0; i--) {
        this.splice(toRemoveIdx[i], 1);
    }
};
String.prototype.contains = function (s) {
    return this.indexOf(s) == -1 ? false : true;
};
String.prototype.hidePartial = function (op) {
    var options = { startVisibleLen: 4, endVisibleLen: 2, maskChar: '*', maskCharLen: 0 };
    $.extend(options, op);
    var s = this;
    if (!s) {
        return "";
    }
    var len = s.length;
    if (len < (options.startVisibleLen + options.endVisibleLen)) {
        if (len < 3) {
            options.startVisibleLen = 0;
            options.endVisibleLen = 0;
        }
        else {
            options.startVisibleLen = parseInt(len / 3);
            options.endVisibleLen = options.startVisibleLen;
        }
    }
    var start = s.substr(0, options.startVisibleLen);
    var end = s.substr(len - options.endVisibleLen);
    var newStr = "";
    newStr += start;
    var middleLen;
    if (options.maskCharLen > 0) {
        middleLen = options.maskCharLen;
    } else {
        middleLen = s.substr(options.startVisibleLen, len - options.startVisibleLen - options.endVisibleLen).length;
    }
    for (var i = 0; i < middleLen; i++) {
        newStr += options.maskChar;
    }
    newStr += end;

    return newStr;
};
//使用多个splitor拆分
String.prototype.splitAll = function (splitors) {
    var ret = this.split(splitors[0]);
    for (var i = 1; i < splitors.length; i++) {
        ret = ret.splitItems(splitors[i]);
    }
    return ret;
};
//拆分string array的字符
Array.prototype.splitItems = function (splitor) {
    var ret = [];
    for (var i = 0; i < this.length; i++) {
        var items = this[i].split(splitor);
        items.forEach(function (item) {
            ret.push(item);
        });
    }
    return ret;
};
String.prototype.notContainsAny = function (sarr) {
    for (var i = 0; i < sarr.length; i++) {
        if (this.contains(sarr[i])) {
            return false;
        }
    }
    return true;
};
String.prototype.containsAny = function (sarr) {
    for (var i = 0; i < sarr.length; i++) {
        if (this.contains(sarr[i])) {
            return true;
        }
    }
    return false;
};
String.prototype.containsAll = function (sarr) {
    for (var i = 0; i < sarr.length; i++) {
        if (!this.contains(sarr[i])) {
            return false;
        }
    }
    return true;
};

String.prototype.getExtension = function () {
    if(!this){
        return '';
    }
    if(this.indexOf('.')!=-1){
        return this.substring(this.lastIndexOf('.')).toLowerCase();
    }
    return '';
};
String.prototype.isImage=function(){
    var ext=this.getExtension();
    if (!ext) {
        return false;
    }
    return [".jpg",".jpeg",".png",".bmp",".gif",".webp"].contains(ext,true);
};

String.prototype.delExtension = function () {
    if (this.contains(".")) {
        return this.substring(0, this.lastIndexOf("."));
    } else {
        return this;
    }
};
String.prototype.getBirthdate = function () {
    if (/^(\d{18,18}|\d{17,17}(x|X))$/.test(this)) {
        var bd = this.substr(6, 4) + "-" + this.substr(10, 2) + "-" + this.substr(12, 2);
        try {
            var d = new Date(bd);
            if (d != 'Invalid Date') {
                return bd;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    } else {
        return null;
    }
};
String.prototype.getAge = function () {
    if (/^(\d{18,18}|\d{17,17}(x|X))$/.test(this)) {
        var bd = this.getBirthdate();
        if (!bd) {
            return null;
        }
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var _age = myDate.getFullYear() - parseInt(this.substring(6, 10)) - 1;
        if (parseInt(this.substring(10, 12)) < month || (parseInt(this.substring(10, 12)) == month && parseInt(this.substring(12, 14)) <= day)) {
            _age++;
        }
        if (_age < 0) {
            _age = 0;
        }
        return _age;
    } else {
        return null;
    }
};
String.prototype.getSex = function () {
    if (/^(\d{18,18}|\d{17,17}(x|X))$/.test(this)) {
        try {
            var d = this.substr(16, 1);
            if (d % 2 == 1) {
                return 1;
            } else {
                return 2;
            }
        } catch (e) {
            return 0;
        }
    } else {
        return 0;
    }
};
String.prototype.leftPart = function (need) {
    if (this == null)
        return null;
    if (!this.contains(need)) {
        return this.toString();
    }
    return this.substring(0, this.indexOf(need));
};
String.prototype.rightPart = function (need) {
    if (this == null)
        return null;
    if (!this.contains(need)) {
        return this.toString();
    }
    return this.substring(this.indexOf(need) + need.length);
};
String.prototype.lastLeftPart = function (need) {
    if (this == null)
        return null;
    if (!this.contains(need)) {
        return this.toString();
    }
    return this.substring(0, this.lastIndexOf(need));
};
String.prototype.lastRightPart = function (need) {
    if (this == null)
        return null;
    if (!this.contains(need)) {
        return this.toString();
    }
    return this.substring(this.lastIndexOf(need) + need.length);
};
function uploadFile(url, file, data, success, fail, always, progress) {
    var form = new FormData();
    if (data) {
        for (var p in data) {
            form.append(p, data[p]);
        }
    }
    form.append("file", file);
    $.ajax({
        xhr: function () {
            var xmlReq = new XMLHttpRequest();
            if (xmlReq.upload && progress) {
                xmlReq.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        progress(e.loaded, e.total, parseInt(10 * e.loaded / e.total) / 10);
                    }
                });
                xmlReq.upload.addEventListener('load', function (e) {
                    progress(e.loaded, e.total, 1);
                });
            }
            return xmlReq;
        },
        url: url, type: "post", data: form, contentType: false, processData: false, dataType: "json"
    }).done(function (r) {
        if (success) {
            success(r);
        }
    }).fail(function () {
        if (fail) {
            fail();
        }
    }).always(function () {
        if (always) {
            always();
        }
    });
}
function rGetParamFromUrl(url, name) {
    if (url.indexOf("?") == -1) { return ""; };
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var qs = url.substring(url.indexOf("?") + 1);
    var r = qs.match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    } else {
        return "";
    }
}
function rGetCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return decodeURIComponent(arr[2]);
    } else {
        return '';
    }
}
function rSetCookie(name, value, path, domain, expireSeconds) {
    if (domain && domain.indexOf(":") != -1) {
        domain = domain.substr(0, domain.indexOf(":"));
    }
    document.cookie = name + "=" + value + "; expires=" + rgetExpires(expireSeconds).toUTCString() + "; path=" + path + (domain ? ("; domain=" + domain) : "");
}
function rgetExpires(expireSeconds) { var now = new Date(); now.setTime(now.getTime() + expireSeconds * 1000); return now; }
function getScrollBarWidth() {
    var $div1 = $('<div style="width:100px;height:1px;overflow-y:scroll;overflow-x:hidden"></div>');
    var $div2 = $('<div style="width:100%;height:1px;background:blue"></div>');
    $div1.append($div2);
    $("body").append($div1);
    var scrollBarWidth = 100 - $div2.width();
    $div1.remove();
    return scrollBarWidth;
}
function getGuid(hyphen) {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return S4() + S4() + (hyphen ? '-' : '') + S4() + (hyphen ? '-' : '') + S4() + (hyphen ? '-' : '') + S4() + (hyphen ? '-' : '') + S4() + S4() + S4();
}
function objectToQueryString(obj,removeEmpty) {
    var qs = '';
    for (var p in obj) {
        var _val = obj[p];
        if (!removeEmpty || (_val != undefined && _val != null && _val != '')) {
            qs += (qs == '' ? '' : '&') + p + '=' + encodeURIComponent(_val);
        }
    }
    return qs;
}
function getOrSetUInt(key, defVal) {
    var val = parseInt(window.localStorage.getItem(key));
    if (!val && val!=0) {
        val = defVal;
        window.localStorage.setItem(key, val);
    }
    if (val < 1) {
        val = defVal;
        window.localStorage.setItem(key, val);
    }
    return val;
}
function toDisplaySize(size) {
    if (size < 1024) {
        return size + " B";
    }
    if (size < Math.pow(1024,2)) {
        return (size / 1024).toFixed(1) + ' KB';
    }
    if (size < Math.pow(1024,3)) {
        return (size /Math.pow(1024,2)).toFixed(1) + ' MB';
    }
    if (size < Math.pow(1024,4)) {
        return (size /Math.pow(1024,3)).toFixed(1) + ' GB';
    }
    if (size < Math.pow(1024,5)) {
        return (size /Math.pow(1024,4)).toFixed(1) + ' TB';
    }
}
function RCache() {
    this.set = function (key, value, expireSeconds) {
        var cacheObject = this.getCacheObject();
        var expireAt = new Date().getTime() + expireSeconds * 1000;
        cacheObject[key] = { expireAt: expireAt, value: value };
        localStorage.setItem('cacheObject', JSON.stringify(cacheObject));
    };
    this.get = function (key) {
        var cacheObject = this.getCacheObject();
        localStorage.setItem('cacheObject', JSON.stringify(cacheObject));
        if (cacheObject[key] != undefined) {
            return cacheObject[key].value;
        }
        return undefined;
    };
    this.remove = function (key) {
        var cacheObject = this.getCacheObject();
        if (cacheObject[key] != undefined) {
            delete cacheObject[key];
        }
        localStorage.setItem('cacheObject', JSON.stringify(cacheObject));
    };
    this.clear = function () {
        localStorage.removeItem('cacheObject');
    };
    this.deleteExpired=function(cacheObject) {
        var now = new Date().getTime();
        for (var key in cacheObject) {
            if (cacheObject[key].expireAt && cacheObject[key].expireAt < now) {
                delete cacheObject[key];
            }
        }
    };
    this.getCacheObject=function(){
        var cacheObjectStr = localStorage.getItem('cacheObject');
        var cacheObject;
        if (cacheObjectStr) {
            cacheObject = JSON.parse(cacheObjectStr);
            this.deleteExpired(cacheObject);
        } else {
            cacheObject = {};
        }
        return cacheObject;
    };
}
function checkDevTool() {
    var t1=new Date().getTime();
        debugger;
        var t2=new Date().getTime();
        if ((t2 - t1) > 100) {
            location.href = "about:blank";
        } else {
            setTimeout(checkDevTool,500);
        }
}
window.Cache = new RCache();
window.toast = showMsg; window.loading = showLoading; window.mask = showMask;