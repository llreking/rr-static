﻿!(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery', 'rs'], function ($) {
            return factory($);
        });
    } else {
        root.MobileLogin=factory(jQuery);
    }
})(this, function ($) {
    var mlogin= {
        loginWin:null,
        regWin:null,
        resetWin:null,
        settings:{dark:0,maxWidth:380,login:null,register:null,reset:null,loginUrl:'/account/login',registerUrl:'/account/register',resetUrl:'/account/resetpwd',sendCodeUrl:'/account/sendmcode',extra:null},
        show: function (options) {
            $.extend(this.settings,options);
            var that=this;
            if (this.regWin) {
                this.regWin.close();
            }
            if (this.resetWin) {
                this.resetWin.close();
            }
            var html = `
            <div class="pd-10">
                <div id="login-win">
                    <div class="input-row noborder" style="background:transparent">
                        <span class="input-label" style="width:57px">手机号</span>
                        <input id="mobile" type="text" autocomplete="off" class="input-text radius bordered l" vrf required regex="^1[\\d]{10}$"/>
                    </div>
                    <div class="input-row noborder" style="background:transparent">
                        <span class="input-label" style="width:57px">密码</span>
                        <input id="password" type="password" class="input-text radius bordered l" vrf required/>
                    </div>
                    <div class="input-row noborder" style="background:transparent">
                        <span class="input-label" style="width:57px">验证码</span>
                        <input id="code" type="text" class="input-text radius bordered l" vrf required length="4,4"/>
                        <a class="flex-vhc ml-10" id="ml-refresh-vcode"><img src="" class="mlvcode" style="width:100px;height:30px"/></a>
                    </div>
                    <div class="flex-vhc pt-15 pb-15">
                        <a class="btn btn-primary radius l" id="ml-btn-login" style="width:90%">登录</a>
                    </div>
                    <div class="flex-vhc">
                        <a class="ml-btn-reg" style="color:#0066CC">新用户？ 注册账号</a><a class="ml-btn-reset ml-50" style="color:#0066CC">找回密码</a>
                    </div>
                </div>
            </div>
            `;
            that.loginWin=$.alert({
                title: '登录', content: html, buttons: false, showClose: 1, maxWidth: that.settings.maxWidth, contentCenter: 0,dark:that.settings.dark,
                success: function () {
                    that.refreshVCode();
                },
                close: function () {
                    that.loginWin = null;
                }
            });
        },
        showRegister: function () {
            var that=this;
            if (this.loginWin) {
                this.loginWin.close();
            }
            if (this.resetWin) {
                this.resetWin.close();
            }
            var html = `
            <div id="reg-win">
                <div class="input-row noborder">
                    <input type="hidden" id="extra"/>
                    <span class="input-label" style="width:80px">手机号</span>
                    <input id="mobile" type="text" autocomplete="off" class="input-text radius bordered l" vrf required regex="^1[\\d]{10}$"/>
                </div>
                <div class="input-row noborder">
                    <span class="input-label" style="width:80px">验证码</span>
                    <input id="code" type="text" autocomplete="off" class="input-text radius bordered l" placeholder="短信验证码" vrf required length="6,6"/>
                    <a class="btn btn-default radius ml-5 l" id="ml-btn-send-code" action="register">发送</a>
                </div>
                <div class="input-row noborder">
                    <span class="input-label" style="width:80px">密码</span>
                    <input id="password" type="password" class="input-text radius bordered l" placeholder="8-20位，包含数字和字母" vrf required regex="^(?=.*[a-zA-Z])(?=.*[1-9]).{8,20}$"/>
                </div>
                <div class="input-row noborder">
                    <span class="input-label" style="width:80px">确认密码</span>
                    <input id="repassword" type="password" class="input-text radius bordered l" placeholder="再次确认您的密码" vrf required equalTo="#password" regex="^(?=.*[a-zA-Z])(?=.*[1-9]).{8,30}$"/>
                </div>
                <div class="flex-vhc pt-15 pb-15">
                    <a class="btn btn-primary radius l" id="ml-btn-reg" style="width:90%">注册</a>
                </div>
                <div class="flex-vhc">
                    <a class="ml-btn-login" style="color:#0066CC">已有账号？ 登录</a>
                </div>
            </div>
            `;
            that.regWin=$.alert({
                title: '新用户注册', content: html, buttons: false, showClose: 1, maxWidth: that.settings.maxWidth, contentCenter: 0,dark:that.settings.dark,
                success: function () {
                    if (that.settings.extra) {
                        $('#reg-win #extra').val(that.settings.extra);
                    }
                },
                close: function () {
                    that.regWin = null;
                }
            });
        },
        showReset: function () {
            var that=this;
            if (this.loginWin) {
                this.loginWin.close();
            }
            if (this.regWin) {
                this.regWin.close();
            }
            var html = `
            <div class="pd-10">
                <div id="reset-win">
                    <div class="input-row noborder">
                        <span class="input-label" style="width:80px">手机号</span>
                        <input id="mobile" type="text" autocomplete="off" class="input-text radius bordered l" vrf required regex="^1[\\d]{10}$"/>
                    </div>
                    <div class="input-row noborder">
                        <span class="input-label" style="width:80px">验证码</span>
                        <input id="code" type="text" autocomplete="off" class="input-text radius bordered l" placeholder="短信验证码" vrf required length="6,6"/>
                        <a class="btn btn-default radius ml-5 l" id="ml-btn-send-code" action="reset">发送</a>
                    </div>
                    <div class="input-row noborder">
                        <span class="input-label" style="width:80px">新密码</span>
                        <input id="password" type="password" class="input-text radius bordered l" placeholder="8-20位，包含数字和字母" vrf required regex="^(?=.*[a-zA-Z])(?=.*[1-9]).{8,20}$"/>
                    </div>
                    <div class="input-row noborder">
                        <span class="input-label" style="width:80px">确认密码</span>
                        <input id="repassword" type="password" class="input-text radius bordered l" placeholder="再次确认您的密码" vrf required equalTo="#password" regex="^(?=.*[a-zA-Z])(?=.*[1-9]).{8,30}$"/>
                    </div>
                    <div class="flex-vhc pt-15 pb-15">
                        <a class="btn btn-primary radius l" id="ml-btn-reset" style="width:90%">重置</a>
                    </div>
                    <div class="flex-vhc">
                        <a class="ml-btn-login" style="color:#0066CC">登录</a>
                    </div>
                </div>
            </div>
            `;
            that.resetWin = $.alert({
                title: '重置密码', content: html, buttons: false, showClose: 1, maxWidth: that.settings.maxWidth, contentCenter: 0,dark:that.settings.dark,
                close: function () {
                    that.resetWin = null;
                }
            });
        },
        refreshVCode: function () {
            $('.mlvcode').prop('src', '/vcode?rd=' + Math.random());
            $('#login-win #code').val('');
        }
    };

    $(document).on('click', '#ml-refresh-vcode', function () {mlogin.refreshVCode();})
    .on('click', '.ml-btn-reg', function () { mlogin.showRegister();})
    .on('click','.ml-btn-reset',function(){mlogin.showReset();})
    .on('click','.ml-btn-login',function(){mlogin.show();})
    .on('click', '#ml-btn-login', function () {
        if ($('#login-win').checkInput()) {
            var data = $('#login-win').getJson();
            mask(1); loading('登录中');
            $.post(mlogin.settings.loginUrl, data)
                .done(function (r) {
                    if (r.errorCode == 0) {
                        toast('登录成功');
                        mlogin.loginWin.close();
                        if (mlogin.settings.login) {
                            mlogin.settings.login();
                        }
                    } else {
                        toast(r.errorMessage);
                        mlogin.refreshVCode();
                    }
                })
                .fail(function (r) {
                    mlogin.refreshVCode();
                    toast('登录失败，再试试呢');
                })
                .always(function () {
                    mask(0); loading(0);
                })
        } else {
            toast('填写有误');
        }
    }).on('click', '#ml-btn-send-code', function () {
        var action=$(this).attr('action');
        var mb = $('#mobile').val().trim();
        if (!mb) {
            toast('请输入手机号');
            return;
        }
        if (!$('#mobile').checkInput()) {
            toast('手机号格式有误');
            return;
        }
        mask(1); loading('发送中');
        $.post(mlogin.settings.sendCodeUrl, { mobile: mb, action: action })
            .done(function (r) {
                if (r.errorCode == 0) {
                    toast('验证码发送成功');
                } else {
                    toast(r.errorMessage);
                }
            })
            .fail(function () {
                toast('发送失败')
            })
            .always(function () {
                mask(0); loading(0);
            })
    }).on('click', '#ml-btn-reg', function () {
        if ($('#reg-win').checkInput()) {
            var data = $('#reg-win').getJson();
            mask(1); loading('注册中');
            $.post(mlogin.settings.registerUrl, data)
                .done(function (r) {
                    if (r.errorCode == 0) {
                        toast('注册成功');
                        mlogin.regWin.close();
                        if (mlogin.settings.register) {
                            mlogin.settings.register();
                        }
                    } else {
                        toast(r.errorMessage);
                    }
                })
                .fail(function (r) {
                    toast('注册失败，再试试呢');
                })
                .always(function () {
                    mask(0); loading(0);
                })
        } else {
            toast('填写有误');
        }
    }).on('click', '#ml-btn-reset', function () {
        if ($('#reset-win').checkInput()) {
            var data = $('#reset-win').getJson();
            mask(1); loading('重置中');
            $.post(mlogin.settings.resetUrl, data)
                .done(function (r) {
                    if (r.errorCode == 0) {
                        toast('重置成功');
                        mlogin.resetWin.close();
                        if (mlogin.settings.reset) {
                            mlogin.settings.reset();
                        }
                    } else {
                        toast(r.errorMessage);
                    }
                })
                .fail(function (r) {
                    toast('重置失败，再试试呢');
                })
                .always(function () {
                    mask(0); loading(0);
                })
        } else {
            toast('填写有误');
        }
    });
                   
    return mlogin;
})