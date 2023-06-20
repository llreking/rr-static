(function ($) {
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
            var settings = { pagingCount: 9, showLastPage: true, showJump: true, showTotal: true, pageSize: false, pageSizeKey: 'pageSize', minPageSize: 5, maxPageSize: 20};
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
                    _pageSize = settings.maxPageSize;
                    window.localStorage.setItem(settings.pageSizeKey, _pageSize);
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
    });
    $(document).on('blur', '[vrf]', function () {
        $(this).checkInput();
    }).on('keyup', '[vrf]', function () {
        $(this).checkInput();
    }).on('change', '[vrf]', function () {
        $(this).checkInput();
    });
})(jQuery);

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
    $("#_rr_msg").remove();
    clearTimeout(_rr_msg_timeout);
    var settings = { bg: "rgba(0,0,0,0.85)", color: "#fff", fontSize: "15px", border: "1px solid #000", position: "middle", time: 2000, zIndex: 99990000, style: "default", end: null };
    if (opts) {
        $.extend(settings, opts);
    }
    getRMsgStyle(settings);
    $("body").append('<div id="_rr_msg" style="background:' + settings.bg + ';color:' + settings.color + ';font-size:' + settings.fontSize + ';border-radius:3px;position:fixed;z-index:' + settings.zIndex + ';display:none;text-align:center;padding:15px 20px;box-shadow:0 0 0.5em #555;max-width:300px;work-break:break-all;work-wrap:break-word">' + msg + '</div>');
    var $p = $("#_rr_msg");
    $p.css({ left: ($(window).width() - $p.outerWidth()) / 2 });
    if (settings.y) {
        $p.css({ top: settings.y });
    } else {
        if (settings.position == "top") {
            $p.css({ top: 10 })
        } else if (settings.position == "bottom") {
            $p.css({ bottom: 10 });
        } else {
            $p.css({ top: ($(window).height() - $p.outerHeight()) / 2 });
        }
    }
    $("#_rr_msg").show();
    _rr_msg_timeout = setTimeout(function () { $("#_rr_msg").remove(); if (typeof (settings.end) == "function") { end(); } }, settings.time);
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
        $("#_rr_wait_msg").remove();
        var settings = { bg: "rgba(0,0,0,0.85)", color: "#fff", fontSize: "15px", border: "1px solid #000", position: "middle", zIndex: 99900000, style: "default", end: null };
        if (opts) {
            $.extend(settings, opts);
        }
        getRMsgStyle(settings);
        $("body").append('<div id="_rr_wait_msg" style="background:' + settings.bg + ';color:' + settings.color + ';font-size:' + settings.fontSize + ';border-radius:3px;position:fixed;z-index:' + settings.zIndex + ';text-align:center;padding:15px 20px;box-shadow:0 0 0.5em #555">' + msg + '<span id="_rr_wait_msg_per" style="font-size:15px;color:' + settings.color + '"></span></div>');
        var $p = $("#_rr_wait_msg");
        $p.css({ left: ($(window).width() - $p.outerWidth()) / 2 });
        if (settings.position == "top") {
            $p.css({ top: 0 })
        } else if (settings.position == "bottom") {
            $p.css({ bottom: 0 });
        } else {
            $p.css({ top: ($(window).height() - $p.outerHeight()) / 2 });
        }
    } else {
        $("#_rr_wait_msg").remove();
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
Array.prototype.containsObject = function (obj, uniquePropName) {
    var _v = obj[uniquePropName];
    for (var i = 0; i < this.length; i++) {
        if (this[i][uniquePropName] == _v) {
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
Array.prototype.removeObjectByValue = function (propName, val) {
    var toRemoveIdx = [];
    for (var i = 0; i < this.length; i++) {
        if (this[i][propName] == val) {
            toRemoveIdx.push(i);
        }
    }
    for (var i = toRemoveIdx.length - 1; i >= 0; i--) {
        this.splice(toRemoveIdx[i], 1);
    }
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
    if (this.contains(".")) {
        return this.substr(this.lastIndexOf(".")).toLowerCase();
    } else {
        return "";
    }
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
    return this.substring(this.indexOf(need) + 1);
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
    return this.substring(this.lastIndexOf(need) + 1);
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
window.toast = showMsg; window.loading = showLoading; window.mask = showMask;