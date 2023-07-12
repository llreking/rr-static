!(function (root,factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery', 'cropper', 'rs'], function ($,Cropper) {
            factory($,Cropper)
        });
    } else {
        factory(jQuery,Cropper);
    }
})(this, function ($,Cropper) {
    
    $.fn.extend({
        avatar: function (options) {
            var settings = {aspectRatio:1,viewMode:1,title:'修改头像',url:'/usercenter/saveAvatar',dark:0,maxWidth:400,paramName:'base64'};
            $.extend(settings,options);
            var imgUrl;
            var crp;
            var cropTimeout;
            if ($('#image-selector').length == 0) {
                $('body').append('<input type="file" id="image-selector" style="display:none" accept="image/*"/>');
            }
            
            var $slt=$('#image-selector');
            this.off().on('click', function () {
                $slt.trigger('click');
            });
            $slt.off('change').on('change', function () {
                var f=$slt[0].files[0];
                $slt.val('');
                if (f.type.indexOf("image") < 0) {
                    toast('不支持的图片式');
                } else {
                    readImage(f);
                }
            });

            function readImage(file){
                if (window.URL && window.URL.createObjectURL) {
                    imgUrl = window.URL.createObjectURL(file);
                    beginCrop();
                } else {
                    var reader = new FileReader();
                    reader.onload = function (r) {
                        imgUrl = reader.result;
                        beginCrop();
                    };
                    reader.readAsDataURL(file);
                }
            }
            function beginCrop() {
                $.alert({
                    title:settings.title,
                    dark:settings.dark,
                    maxWidth:settings.maxWidth,
                    buttons:false,
                    content:`
                    <div class="pd-10">
                        <div style="padding-top:60%;position:relative">
                            <div style="width:100%;height:100%;position:absolute;left:0;top:0">
                                <img id="new_avatar" style="width:100%;height:100%" src="${imgUrl}"/>
                            </div>
                        </div>
                        <div class="pt-5 text-c">
                            <img id="avatar_preview" src="${imgUrl}" style="width:80px;height:80px;border-radius:100%;border:1px solid #ddd"/>
                        </div>
                        <div class="pt-10 txt_center">
                            <a class="btn btn-defaut l radius btn-cancel-avt" style="width:40%"><i class="rf">&#xe66b;</i> 取消</a>
                            <a class="btn btn-primary l radius btn-save-avt ml-10" style="width:40%"><i class="rf">&#xe632;</i> 保存</a>
                        </div>
                    </div>
                    `,
                    success: function () {
                        var that=this;
                        crp = new Cropper($('#new_avatar')[0], {
                            aspectRatio:settings.aspectRatio,viewMode:settings.viewMode,
                            crop: function () {
                                clearTimeout(cropTimeout);
                                cropTimeout = setTimeout(function () {
                                    var _src = crp.getCroppedCanvas({ width: 200, height: 200 }).toDataURL();
                                    $('#avatar_preview').prop('src', _src);
                                }, 150);
                            }
                        });
                        $('.btn-cancel-avt').click(function () {
                            that.close();
                        });
                        $('.btn-save-avt').click(function () {
                            var _src = crp.getCroppedCanvas({ width: 200, height: 200 }).toDataURL();
                            var base64=_src.rightPart(',');
                            mask(1);
                            loading('保存中...');
                            var data = {};
                            data[settings.paramName]=base64;
                            $.post(settings.url,data).done( function (r) {
                                    if (r.errorCode == 0) {
                                        that.close();
                                        toast('保存成功');
                                        if (settings.success&&typeof(settings.success)=='function') {
                                            settings.success(r.data);
                                        }
                                    } else {
                                        toast(r.errorMessage);
                                    }
                                })
                                .fail(function () { toast("上传失败");})
                                .always(function () {mask(0); loading(0); });
                        });
                    }, close: function () {
                        if (window.URL && window.URL.revokeObjectURL) {
                            window.URL.revokeObjectURL(imgUrl);
                        }
                        crp.destroy();
                    }
                });
            }
        }
    });
});