!(function (root,factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery', 'jsqr'], function ($,jsqr) {
            return factory($,jsqr)
        });
    } else {
        root.Scanner=factory(jQuery,jsQR);
    }
})(this, function ($,jsqr) {
    var scanner = {
        isScanning:false,
        stream:null,
        streamUrl:null,
        settings:{dark:0,backround:'#fff',maxWidth:400,success:null,error:null,cancel:null,audio:false},
        context:null,
        video:null,
        show: function (options) {
            if (this.isScanning) {
                return false;
            }
            var that=this;
            $.extend(this.settings,options);
            this.isScanning=true;
            var maxWidth=(typeof (this.settings.maxWidth) == 'number' || (!(this.settings.maxWidth + '').contains('%') && !(this.settings.maxWidth + '').contains('px')) ? this.settings.maxWidth + 'px' : this.settings.maxWidth);
            $('body').append(`
                <div class="scanner-mask" style="position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:50000000">
                    <div class="scanner-box" style="width:100%;height:100%;max-width:${maxWidth};margin:auto;display:flex;justify-content:center;flex-direction:column;background:#2B2A2A">
                        <div style="position:relative;width:100%;padding-top:100%;background:#000">
                            <canvas class="scan-view" width="320px" height="320px" style="width:100%;height:100%;position:absolute;left:0;top:0;display:none"></canvas>
                            <video class="scan-video" width="320px" height="320px" autoplay playsinline style="width:100%;height:100%;position:absolute;left:0;top:0;object-fit:fill" control></video>
                        </div>
                        <div class="flex-vhc t" style="padding-top:10px">
                            扫描二维码
                        </div>
                        <div class="flex-vhc" style="padding-top:50px">
                            <a class="btn btn-default radius l btn-cancel-scan" style="width:60%">取消</a>
                        </div>
                    </div>
                </div>
            `);
            this.context = $('.scan-view')[0].getContext('2d', {willReadFrequently:true});
            this.closeCurrentStream();
            this.video=$(".scan-video")[0];
            if (!navigator.mediaDevices) {
                navigator.mediaDevices = {};
            }
            
            if (!navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia = function (ops) {
                    var getUserMedia=avigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia;
                    if (!getUserMedia) {
                        return Promise.reject("当前浏览器不支持调用摄像头");
                    }
                    
                    return new Promise(function (resolve, reject) {
                        getUserMedia.call(navigator,ops,resolve,reject);
                    });
                };
            }
            navigator.mediaDevices.getUserMedia({ audio: this.settings.audio, video: { width: 320, height: 320, facingMode: 'environment' } })
            .then(function (stream){
                that.stream=stream;
                that.video.srcObject=stream;
                //that.streamUrl=window.URL.createObjectURL(stream);//新浏览器不再支持
                function appendToCanvas() {
                    if (that.isScanning) {
                        that.context.clearRect(0,0,320,320);
                        that.context.drawImage(that.video,0,0,320,320);
                        var imgData= that.context.getImageData(0,0,320,320);
                        var ret = jsqr(imgData.data, 320, 320);
                        if (!ret||!ret.data) {
                            requestAnimationFrame(appendToCanvas);
                        } else {
                            that.close();
                            if (that.settings.success) {
                                that.settings.success(ret.data);
                            }
                        }
                    }
                }
                that.video.onloadedmetadata = function () {
                    that.video.play();
                    appendToCanvas();
                };
            }).catch(function (err) {
                if (that.settings.error) {
                    that.settings.error(err+"");
                }
                that.close();
            })
        }, closeCurrentStream: function () {
            if (this.stream) {
                this.stream.getTracks().forEach(function (track) {
                    track.stop();
                    track.enabled=false;
                });
                this.stream=null;
            }
            if (this.streamUrl) {
                window.URL.revokeObjectURL(this.streamUrl);
                this.streamUrl=null;
            }
            if (this.video) {
                this.video.pause();
                this.video.srcObject=null;
                this.video=null;
            }
        }, close: function () {
            this.isScanning=false;
            this.context=null;
            $('.scanner-mask').remove();
            this.closeCurrentStream();
        }
    };
    $(document).on('click', '.btn-cancel-scan', function () {
        if (scanner.settings.cancel) {
            scanner.settings.cancel();
        }
        scanner.close();
    });

    return scanner;
});