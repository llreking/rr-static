(function (win, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        win.AudioPlayer = factory();
    }

})(this, function () {
    this.settings = {alwaysShow:false};
    var that = this;
    var progressPressed = false;
    var seeking = false;
    var sliderMax = 200;
    this.init = function (options) {
        $('#a-player-box').remove();
        $.extend(that.settings, options);
        that.playingInfo = { url: null, title: null, artist: null, cover: null };
        that.box = $('<div class="a-player-box"' + (that.settings.alwaysShow?'':' style="display:none"') + '><audio id="a-player" style="display:none"></audio><div class="a-player"><div class="a-cover"></div><div class="a-body"></div><div class="a-btn-box"><a class="rf rf-bofang" id="a-btn-play"></a></div><div class="a-btn-box"><a class="rf rf-tingzhi" id="a-btn-stop"></a></div></div></div>');
        $('body').append(that.box);
        that.body = this.box.find('.a-body');
        that.btnplay = this.box.find('#a-btn-play');
        that.btnstop=this.box.find('#a-btn-stop');
        that.player = $('#a-player')[0];
        that.body.append('<div class="cl"><div class="a-title">音频</div><div class="a-duration"><span id="a-current">00:00</span>/<span id="a-total">00:00</span></div></div><div class="slider" id="a-progress" min="0" max="' + sliderMax + '" step="1"><span class="handle"></span></div>');
        that.progress = that.body.find('#a-progress');
        that.player.onloadedmetadata = setDuration;
        that.player.ondurationchange = setDuration;
        that.player.ontimeupdate = setCurrentTime;
        that.player.onended = playEnded;
        that.player.onpause = playPaused;
        that.player.onplay = playStarted;
        that.player.onerror = errorHappened;
        that.player.onseeked = function () {
            seeking = false;
        };

        var to;
        that.progress[0].addEventListener('touchstart', function () {
            clearTimeout(to);
            progressPressed = true;
            seeking = true;
        }, false);
        that.progress[0].addEventListener('mousedown', function () {
            clearTimeout(to);
            progressPressed = true;
            seeking = true;
        }, false);
        
        that.progress[0].addEventListener('touchend', function () {
            progressPressed = false;
            setTimeout(function () {
                seeking = false;
            }, 600);
        }, false);
        $(document).on('mouseup', function () {
            progressPressed = false;
            setTimeout(function () {
                seeking = false;
            }, 500);
        });

        var to1;
        that.progress.on('change', function (e) {
            var v = e.detail.value;
            clearTimeout(to1);
            to1 = setTimeout(function () {
                var p = v / sliderMax;
                if (p > 1) {
                    p = 1;
                }
                seekTo(p);
            }, 300);
        });

        that.btnplay.on('click', function () {
            if (that.btnplay.is('.rf-bofang')) {
                that.play();
            } else {
                that.player.pause();
            }
        });
        that.btnstop.on('click', function () {
            that.box.hide();
            that.player.pause();
        });
    };
    
    this.play = function (url, title, artist, cover) {
        if (url) {
            that.playingInfo.url = url;
            that.playingInfo.title = title || url.lastLeftPart('?').lastRightPart('/');
            that.playingInfo.artist = artist;
            that.playingInfo.cover = cover || '/lib/rs/img/music.jpg';
            startPlayNew();
        } else {
            continuePlay();
        }
    };
    function playEnded() {
        that.btnplay.removeClass('rf-zanting');
        that.btnplay.addClass('rf-bofang');
        if (!that.settings.alwaysShow) {
            that.box.hide();
        }
        if (typeof (that.settings.onEnd) === 'function') {
            that.settings.onEnd.call(that);
        }
        if (typeof (that.settings.onend) === 'function') {
            that.settings.onend.call(that);
        }
    }
    function playPaused() {
        that.btnplay.removeClass('rf-zanting');
        that.btnplay.addClass('rf-bofang');
        if (typeof (that.settings.onPause) === 'function') {
            that.settings.onPause.call(that);
        }
        if (typeof (that.settings.onpause) === 'function') {
            that.settings.onpause.call(that);
        }
    }
    function playStarted() {
        that.btnplay.removeClass('rf-bofang');
        that.btnplay.addClass('rf-zanting');
        that.box.show();
        if (typeof (that.settings.onPlay) === 'function') {
            that.settings.onPlay.call(that);
        }
        if (typeof (that.settings.onplay) === 'function') {
            that.settings.onplay.call(that);
        }
    }
    function errorHappened() {
        if (typeof (that.settings.onError) === 'function') {
            that.settings.onError.call(that);
        }
        if (typeof (that.settings.onerror) === 'function') {
            that.settings.onerror.call(that);
        }
    }
    //修改进度
    function seekTo(percent) {
        if (that.player.duration) {
            that.player.currentTime = that.player.duration * percent;
            that.player.play();
        } else {
            $('#a-progress').slideTo(0);
        }
    }
    //总时长
    function setDuration() {
        var d = that.player.duration;
        var m = parseInt(d / 60);
        var s = parseInt(d % 60);
        $('#a-total').html((m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s :s));
    }
    //当前位置
    function setCurrentTime() {
        var d = that.player.currentTime;
        var m = parseInt(d / 60);
        var s = parseInt(d % 60);
        $('#a-current').html((m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));

        //手动手动进度过程中不更新进度手柄位置
        if (!progressPressed && !seeking && that.player.duration) {
            $('#a-progress').slideTo((d / that.player.duration) * sliderMax);
        }
    }
    //继续播放
    function continuePlay() {
        that.player.play();
    }
    //播放新的音频
    function startPlayNew() {
        that.player.src = "";
        that.player.src = that.playingInfo.url;
        that.box.find('.a-cover').css('background-image', 'url(' + that.playingInfo.cover + ')');
        that.box.find('.a-title').html(that.playingInfo.title + (that.playingInfo.artist ? ' - ' + that.playingInfo.artist : ''));
        setTimeout(function () {
            that.player.play();
        }, 500);
    }

    Window.AudioPlay = this;
    return this;
});