//用法
//<div class="file-upload radius s50" data-max="5" data-maxwidth="200" data-format="jpeg" data-quality="75" data-maxsize="52428800" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.7z,.rar;4,.txt,.jpeg,.jpg,.png,.webp,.bmp" url="/upload/uploadFile" delurl="/upload/deleteFiles">
//    <div class="file-title"><span>附件上传<span class="file-count"></span></span><a class="file-clear" title="清空"><i class="rf rf-del2"></i></a></div>
//    <div class="file-list">
//    </div>
//    <div class="file-add">
//        <i class="rf rf-add"></i>
//    </div>
//</div>
$(function () {
    $.fn.extend({
        appendUploadedFile: function (fileurl,orgname,isnew) {
            this.find('.file-list').append('<div class="file-box" _src="'+fileurl+'" _name="'+orgname+'" '+(isnew?'isnew':'')+'><div class="file-box-wrap"><a class="file-view" href="'+fileurl+'" target="_blank">'+(orgname.isImage()?'<img class="img-view" src="'+fileurl+'"/>':'<i class="file-ico rf rf-news"></i>')+'</a><a class="file-name" href="'+fileurl+'" target="_blank">'+orgname+'</a><div class="file-op"><a class="file-del"><i class="rf rf-del2"></i></a></div></div></div>');
            this.find('.file-count').html(this.find('.file-box').length);
            if (!this.find('.file-clear').is(':visible')) {
                this.find('.file-clear').show();
            }
        },
        getUploadedFile: function () {
            var files=[];
            this.find('.file-box').each(function (i,j) {
                var fileUrl = $(j).attr('_src');
                var fileName = $(j).attr('_name');
                files.push({url:fileUrl,fileName:fileName});
            });
            return files;
        },
        getNewUploadedFile: function () {
            var files=[];
            this.find('.file-box').each(function (i,j) {
                if ($(j).is('[isnew]')) {
                    var fileUrl = $(j).attr('_src');
                    var fileName = $(j).attr('_name');
                    files.push({url:fileUrl,fileName:fileName});
                }
            });
            return files;
        }
    });
    var _accept=[];
    $(document).on('click', '.file-upload .file-add', function () {
        var $fileupload=$(this).closest('.file-upload');
        var data=$fileupload.data();
        if (!data.max) {
            data.max=1;
        }
        var currentCount=$fileupload.find('.file-box').length;
        if (currentCount >= data.max) {
            toast('最多只能添加' + data.max + '个文件', {time:1000});
            return;
        }
        if (!data.maxwidth) {
            data.maxwidth=1920;
        }
        if (!data.quality) {
            data.quality=80;
        }
        if (!data.maxsize) {
            data.maxsize="52428800"
        }
        if (!data.format || data.format=="jpg") {
            data.format="jpeg"
        }
        var accept=$fileupload.attr('accept');
        if (!accept) {
            accept='.pdf,.doc,.docx,.xls,.xlsx,.zip,.7z,.rar;4,.txt,.jpeg,.jpg,.png,.webp,.bmp';
        }
        _accept=accept.split(',');
        var $selector=$fileupload.find('input[type="file"]');
        if ($selector.length == 0) {
            $selector=$('<input type="file" accept="'+accept+'" multiple style="display:none"/>');
            $fileupload.append($selector);
        }
        $selector.off();
        $selector.on('change', function () {
            _fileSelected($selector,$fileupload,data,currentCount);
        });
        setTimeout(function () {
            $selector.trigger('click');
        },10);
    }).on('click', '.file-upload .file-del', function () {
        var $fileupload=$(this).closest('.file-upload');
        var item=$(this).closest('.file-box');
        var deletedUrl = item.attr('_src');
        try {
            if (item.is('[isnew]')) {
                var delUrl = $fileupload.attr('delurl');
                if (delUrl) {
                    $.post(delUrl, { file: deletedUrl});
                }
            }
        } catch(ex){}
        $(this).closest('.file-box').remove();
        var fileCount=$fileupload.find('.file-box').length;
        $fileupload.find('.file-count').html(fileCount>0?fileCount:'');
        if (fileCount < 1) {
            $fileupload.find('.file-clear').hide();
        }
    }).on('click', '.file-upload .file-clear', function () {
        var $t=$(this);
        $.alert({
            content:"确认清空所有文件？",
            buttons: {
                '取消': {},
                '确认': {
                    action: function () {
                        var $fileupload=$t.closest('.file-upload');
                        var newFiles=$fileupload.getNewUploadedFile();
                        if (newFiles.length > 0) {
                            var _f='';
                            newFiles.forEach(function (i) {
                                _f+=(_f?',':'')+i.url;
                            })
                            var delUrl = $fileupload.attr('delurl');
                            if (delUrl) {
                                $.post(delUrl, { file: _f});
                            }
                        }
                        $fileupload.find('.file-box').remove();
                        $fileupload.find('.file-clear').hide();
                        $fileupload.find('.file-count').html('');
                    }
                }
            }
        });
    });

    function _fileSelected($selector,$fileupload,data,currentCount) {
        var files=$selector[0].files;
        if (files.length == 0) {
            return;
        }
        var fileList=[];
        for (var i = 0; i < files.length; i++) {
            var filename=files[i].name;
            if (_accept.contains('.'+filename.lastRightPart('.').toLowerCase()) && files[i].size<=data.maxsize) {
                fileList.push(files[i]);
            }
        }
        if (fileList.length == 0) {
            $selector.val('');
            toast('无有效的文件', {time:1500});
            return;
        }
        var leftCount=data.max-currentCount;
        if (leftCount<1) {
            $selector.val('');
            toast('最多只能添加'+data.max+'个文件', {time:1000});
            return;
        }

        fileList=fileList.splice(0,leftCount);
        $selector.val('');
        _uploadFile(fileList,$fileupload,data);
    }

    function _uploadFile(files,$fileupload,data) {
        var url=$fileupload.attr('url');
        if (!url) {
            url='/upload/file';
        }
        var totalCount=files.length;
        var current=0;
        var successCount=0;
        function uploadNext() {
            if (files.length == 0) {
                loading(0);
                if (successCount == 0) {
                    toast('上传失败');
                } else {
                    toast(totalCount == 1 ? '上传成功' : '共上传成功 ' + successCount + '个文件',{time:1000});
                }
            } else {
                current++;
                loading('上传中 '+current+'/'+totalCount);
                var file=files.splice(0,1)[0];
                uploadFile(url, file,data, function (r) {
                    if (r.errorCode == 0) {
                        successCount++;
                        $fileupload.appendUploadedFile(r.data.url,r.data.fileName,true);
                    }
                }, function () { 
                    //fail
                }, function () {
                    setTimeout(uploadNext,10);
                });
            }
        }
        uploadNext();
    }
})