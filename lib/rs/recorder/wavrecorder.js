﻿!(function (root,factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery',"recorder"], function ($,recorder) {
            return factory($,recorder)
        });
    } else {
        root.WAVRecorder=factory(jQuery,Recorder);
    }
})(this, function ($,recorder) {
    var wavRecorder = {
        recording:false,
        recorder:null,
        stream:null,
        settings:{success:null,error:null,cancel:null,complete:null,channelCount:1,sampleRate:16000,sampleSize:16,volume:1},
        start: function (options) {
            if (this.recording) {
                return;
            }
            var that=this;
            $.extend(this.settings,options);
            this.recording=true;
            this.closeCurrentStream();
            if (!navigator.mediaDevices) {
                navigator.mediaDevices = {};
            }
            
            if (!navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia = function (ops) {
                    var getUserMedia=avigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia;
                    if (!getUserMedia) {
                        return Promise.reject("当前浏览器不支持录音功能");
                    }
                    
                    return new Promise(function (resolve, reject) {
                        getUserMedia.call(navigator,ops,resolve,reject);
                    });
                };
            }
            navigator.mediaDevices.getUserMedia({ audio: {channelCount:this.settings.channelCount,sampleRate:this.settings.channelCount,sampleSize:this.settings.sampleSize,volume:this.settings.volume}})
            .then(function (stream){
                that.stream=stream;
                var context = new AudioContext({sampleRate:that.settings.sampleRate});//samplerate只能在构造函数中设置
                //context.sampleRate=that.settings.sampleRate;
                var input=context.createMediaStreamSource(stream);
                that.recorder = new recorder(input, {numChannels:that.settings.channelCount});
                that.recorder.record();
            }).catch(function (err) {
                if (that.settings.error) {
                    that.settings.error(err+"");
                }
                that.recording=false;
                that.closeCurrentStream();
                if (that.settings.complete) {
                    that.settings.complete();
                }
                that.recorder=null;
            })
        }, closeCurrentStream: function () {
            if (this.stream) {
                this.stream.getTracks().forEach(function (track) {
                    track.stop();
                    track.enabled=false;
                });
                this.stream=null;
            }
        }, stop:function() {
            if (!this.recording) {
                return;
            }
            var that=this;
            this.recording=false;
            this.recorder.stop();
            this.closeCurrentStream();
            this.recorder.exportWAV(function (blob) {
                if (that.settings.success) {
                    that.settings.success(blob);
                }
            });
            if (that.settings.complete) {
                that.settings.complete();
            }
            that.recorder=null;
        }, cancel: function () {
            this.recording=false;
            this.recorder.stop();
            this.closeCurrentStream();
            if (this.settings.cancel) {
                this.settings.cancel();
            }
            if (this.settings.complete) {
                this.settings.complete();
            }
            this.recorder=null;
        }
    };

    return wavRecorder;
});