(function ($) {
    //$.event.special.touchstart = {
    //    setup: function (_, ns, handle) {
    //        this.addEventListener("touchstart", handle, {
    //            passive: false,
    //        });
    //    }
    //};
    //$.event.special.touchmove = {
    //    setup: function (_, ns, handle) {
    //        this.addEventListener("touchmove", handle, {
    //            passive: false,
    //        });
    //    }
    //};
    $.fn.extend({
        getImage: function (imageType, quality) {
            var rcanvas = this[0];
            if (imageType) {
                imageType = imageType.toLowerCase();
            } else {
                //def png
                imageType = "png";
            }
            if (!quality || quality < 0) {
                quality = 1;
            }
            if (imageType.indexOf("png") != -1) {
                return rcanvas.toDataURL("image/png");
            } else {
                return rcanvas.toDataURL("image/jpeg", quality);
            }
        },
        getFillRate: function () {
            var rcanvas = this[0];
            var rctx = rcanvas.getContext("2d");
            var data = rctx.getImageData(0, 0, rcanvas.width, rcanvas.height).data;
            var j = 0;
            for (var i = 0, j = 0; i < data.length; i += 4) {
                if (data[i] || data[i + 1] || data[i + 2] || data[i + 3]) {
                    j++;
                }
            }
            return j / (rcanvas.width * rcanvas.height);
        },
        clearCanvas: function (bgColor) {
            var rcanvas = this[0];
            var rctx = rcanvas.getContext("2d");
            rctx.beginPath();
            rctx.clearRect(0, 0, rcanvas.width, rcanvas.height);
            if (bgColor) {
                rctx.fillStyle = bgColor;
                rctx.fillRect(0, 0, rcanvas.width, rcanvas.height);
            }
            rctx.closePath();
        },
        rsign: function (options) {
            var $this = this;
            var settings = {
                lineWidth: 5, strokeColor: "black", bgColor: null, shadowBlur: 1, shadowColor:"black"
            };
            $.extend(settings, options);
            var rcanvas = $this[0];
            var rctx = rcanvas.getContext("2d");
            var rstartX, rstartY;
            var mousedown = false;
            function clear() {
                rctx.beginPath();
                if (settings.bgColor) {
                    rctx.fillStyle = settings.bgColor;
                    rctx.fillRect(0, 0, rcanvas.width, rcanvas.height);
                } else {
                    rctx.clearRect(0, 0, rcanvas.width, rcanvas.height);
                }
                rctx.closePath();
            }
            rcanvas.clear = clear;
            rcanvas.getImage = function (imageType, quality) {
                if (imageType) {
                    imageType = imageType.toLowerCase();
                } else {
                    imageType = "png";
                }
                if (!quality || quality < 0) {
                    quality = 1;
                }
                if (imageType.indexOf("png") != -1) {
                    return rcanvas.toDataURL("image/png");
                } else {
                    return rcanvas.toDataURL("image/jpeg", quality);
                }
            };
            function getFillRate() {
                var data = rctx.getImageData(0, 0, rcanvas.width, rcanvas.height).data;
                var j=0;
                for (var i = 0, j = 0; i < data.length; i += 4) {
                    if (data[i] || data[i + 1] || data[i + 2] || data[i + 3]) {
                        j++;
                    }
                }
                return j / (rcanvas.width * rcanvas.height);
            }
            rcanvas.getFillRate = getFillRate;
            function eventDown(e) {
                e.preventDefault();
                if (e.originalEvent && e.originalEvent.changedTouches) {
                    e = e.originalEvent.changedTouches[e.originalEvent.changedTouches.length - 1];
                }
                rctx.beginPath();
                var roffsetX = $this.offset().left, roffsetY = $this.offset().top;
                rstartX = e.pageX - roffsetX;
                rstartY = e.pageY - roffsetY;
                mousedown = true;
            }

            function eventUp(e) {
                e.preventDefault();
                mousedown = false;
                rctx.closePath();
            }

            function eventMove(e) {
                e.preventDefault();
                if (mousedown) {
                    if (e.originalEvent && e.originalEvent.changedTouches) {
                        e = e.originalEvent.changedTouches[e.originalEvent.changedTouches.length - 1];
                    }
                    var roffsetX = $this.offset().left, roffsetY = $this.offset().top;
                    var x = e.pageX - roffsetX,
                        y = e.pageY - roffsetY;
                    rctx.moveTo(rstartX, rstartY);
                    rctx.lineTo(x, y);
                    rctx.lineCap = "round";//线条末端的样式
                    rctx.lineJoin = "round";//线交汇时为圆形边角
                    rctx.strokeStyle = settings.strokeColor;//颜色
                    rctx.lineWidth = settings.lineWidth;//宽度
                    rctx.shadowBlur = settings.shadowBlur;//blur一点，看起来没那么生硬
                    rctx.shadowColor = settings.shadowColor;
                    rctx.stroke();
                    rstartX = x;
                    rstartY = y;
                }
            }
            $this.unbind();
            $this.on("touchstart", eventDown);
            $this.on("touchend", eventUp);
            $this.on("touchmove", eventMove);
            $this.on("mousedown", eventDown);
            $this.on("mouseup", eventUp);
            $this.on("mousemove", eventMove);
        }
    });
})(jQuery);