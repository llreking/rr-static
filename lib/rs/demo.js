require.config({
    urlArgs:'',
    paths: {
        jquery: rcdnconfig.JS.jquery,
        rs: "/lib/rs/rs",
        player: "/lib/rs/audioplayer",
        hammer: rcdnconfig.JS.hammer,
        easing:rcdnconfig.JS.jqueryeasing
    }, shim: {
        //util: ['jquery'],
        //rs:['util'],
        easing:['jquery'],
        rs: ['easing', 'hammer'],
        player:['rs']
    }
});
require(['jquery','audioplayer','easing',  'rs'], function ($,player) {
    $(function () {

        player.init()
        $('#play').click(function () {
             player.play("/testaudio.mp3", "", "张三", '/static/images/demo2_1.jpg');
        })
        $('#cplay').click(function () {
             player.play();
        })
        prettyPrint();

        $('#mypicker').cascade({
            title: '请选择地区', labels: ['省', '市', '区/县'],
            data: districts, onselect: function (e) {
                console.log(e)
            }, maxWidth:400
        });
        $('#tab1').on('tab.change', function (e) {
            console.log(e.detail)
        })
        $('#mymenu').on('menu.change', function (e) {
            console.log(e.detail)
        })
        $('#aa').marquee();
        $('#switch1').on('change', function (e) {
            console.log(e.detail)
        })
        $(document).on('scroll.in', '.scroll-trigger', function (e) {
            console.log($(this).attr('id') + "进入");
        }).on('scroll.out', '.scroll-trigger', function (e) {
            console.log($(this).attr('id') + "退出");
        }).on('click', '#clickme', function () {
            $.bbox({
                title: "hi", content: "hello<br/>这是底部弹出窗口<br/>maxWidth:最大宽度，默认767", maxWidth: 500,
                buttons: {
                    "不关闭": {
                        action: function () {
                            toast("return false点击后不会关闭");
                            return false
                        }
                    }, "自定义样式": {
                        style: "background:blue;color:#fff",
                        action() {
                            var that = this;
                            toast('自定义按钮样式；即将关闭(this.close())');
                            setTimeout(function () { that.close() }, 2000);
                            return false
                        }
                    }, "默认最后一个按钮颜色": {
                        action() {
                            toast('不return 或 return true 点击后会关闭')
                        }
                    }
                }, success() {
                    
                }, close() {
                }
            })
        }).on('change', '#slider1', function (e) {
            $('#slider-value-1').html(e.detail.value);
        }).on('change', 'input[type=checkbox],input[type=radio]', function () {
            var json = $('#cks').getJson({ checkboxValToString: false });
            $('#ckvals').html(JSON.stringify(json));
        }).on('click', '#btn-progress', function () {
            $('.progress').progress(Math.random());
        }).on('click', '#alert1', function () {
            $.alert({
                title: '你好',//default:提示
                content: 'Hello World!<br/>This is a confirm demo !',
            })
        }).on('click', '#alert2', function () {
            $.alert({
                title: '你好',//default:提示
                content: 'Hello World!<br/>This is a confirm demo !',
                titleCenter: true, textCenter: true,//default:true
                buttons: {//default:确定
                    "取消": {
                    },
                    "Styled": {
                        style: 'background:red;color:#fff',
                        action() {
                            toast('这是按钮自定义样式');
                            return false;
                        }
                    },
                    "确定": {
                        action() {
                            toast('OK');
                            return false;
                        }
                    }
                },
                success() {
                    //toast('shown');
                }, close() {
                    toast('close');
                }
            })
        }).on('click', '#action1', function () {
            $.actionSheet({
                title: '标题 （title:不设置或false不显示）',//空或false不显示
                maskClose:false,//是否可点击遮罩关闭，default:true
                maxWidth: 400,
                menu:['修改','删除'] ,
                success() {
                    //toast('shown');
                }, close() {
                    //toast('closed');
                }, select(data) {
                    toast(JSON.stringify(data))
                }
            })
        });
    });
})