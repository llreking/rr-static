UE.registerUI('135editor', function (editor, uiName) {
    // var dialog = new UE.ui.Dialog({
    //     iframeUrl: editor.options.UEDITOR_HOME_URL+'dialogs/135editor/135EditorDialogPage.html',
    //     cssRules:"width:"+ parseInt(document.body.clientWidth*0.9) +"px;height:"+(window.innerHeight -50)+"px;",
    //     editor:editor,
    //     name:uiName,
    //     title:"135编辑器"
    // });
    // dialog.fullscreen = false;
    // dialog.draggable = false;
    var btn = new UE.ui.Button({
        name: 'btn-dialog-' + uiName,
        className: 'edui-for-135editor',
        title: '使用135编辑器编辑文档',
        onclick: function () {
            // dialog.render();
            // dialog.open();

            // 由于登录存在跨域问题，请使用如下方式调用135编辑器
            var editor135 = window.open('https://www.135editor.com/simple_editor.html?callback=true&appkey=')

            //addEventListner多次add会重复，且多个editor时如果都打开过多个135会同时setContent
            window.onmessage = function (event) {
                if (event.originalEvent) {
                    event = event.originalEvent;
                }
                if (typeof event.data !== 'string') {
                    if (event.data.ready) {
                        editor135.postMessage(editor.getContent(), '*');
                    }
                    return;
                };
                editor.setContent(event.data);
                editor.fireEvent("catchRemoteImage");
            }
            //window.addEventListener('message', function (event) {
            //    if (typeof event.data !== 'string') {
            //        if(event.data.ready) {
            //            editor135.postMessage(editor.getContent(), '*');
            //            //console.log(editor.getContent())
            //        }
            //        return;
            //    };
            //    editor.setContent(event.data);
            //    editor.fireEvent("catchRemoteImage");
            //}, false);
        }
    });
    return btn;
}, undefined);
// 修改最后的undefined参数为数字序号，比如5，可调整135编辑器按钮的顺序。默认出现在最后面