/**
 * Created by ZYQ on 2017/11/22.
 */
var flag = false;
var timer;
var userId = "";

$(document).ready(function () {
    /**
     * 点击一键领取
     */
    $(".freeReceiveBtn").click(function () {
        // zxQuickSignUpOrIn("0001ab2a-e6e9-4657-a97e-8b0c9866a0ab");
        // zxQuickSignUpOrIn("000");
        zxQuickSignUpOrIn(token);
    });

    $(".phonenuber").click(function () {
        $(".mobile").focus();
    });

    $(".code").click(function () {
        $(".code").focus();
    });

    /**
     * 点击获取验证码
     */
    $(".getyzm").click(function () {
        var reg = new RegExp("^((13[0-­9])|15[^4]|18[0-­9]|17[01235678]|(147,145,149))\\d{8}$");
        var reem = new RegExp(" ", "g");
        var mobile = $(".mobile").val().replace(reem, "");
        if (mobile == "") {
            $(".errorBox").html("请输入手机号码");
        } else if (mobile != "" && (!reg.exec(mobile))) {
            $(".errorBox").html("手机号输入错误");
        } else if (mobile != "" && reg.exec(mobile)) {
            sendVerifyCode(mobile);
        }

    });
    /**
     * 登陆注册按钮变化
     */
    $('input').bind('input propertychange', function() {

        if(($('.mobile').val() !="") && ($('.code').val() !="")){
            $('.receiveGiftBtn').css('background','#0DC2B3');
            $(".receiveGiftBtn").removeAttr("disabled");
        } else {
            $('.receiveGiftBtn').css('background','#BBBBBB');
            $(".receiveGiftBtn").attr({"disabled": "disabled"});
        }

    });

    /**
     * 注册弹窗——点击一键领取注册登录
     */
    $(".registerLogin").click(function () {
        var reg = new RegExp("^((13[0-­9])|15[^4]|18[0-­9]|17[01235678]|(147,145,149))\\d{8}$");
        var reem = new RegExp(" ", "g");
        var mobile = $(".mobile").val().replace(reem, "");
        var verifyCode = $(".code").val();
        if (mobile != "" && reg.exec(mobile) && verifyCode != "") {
            mobileSignUpOrIn(mobile,verifyCode);
        } else if (mobile == "") {
            $(".errorBox").html("请输入手机号码");
        } else if (mobile != "" && (!reg.exec(mobile))) {
            $(".errorBox").html("手机号输入错误");
        } else if (verifyCode == "") {
            $(".errorBox").html("请输入验证码");
        }
    });


    /**
     * 活动规则
     */
    $(".actRulesBtn").click(function () {
        $(".pagesMask").show();
        $(".activityRules").show();
    });

    $(".rulesClose").click(function () {
        $(".pagesMask").hide();
        $(".activityRules").hide();
    });

    $(".pagesMask").click(function () {
        $(".pagesMask").hide();
        $(".activityRules").hide();
        $(".registerBox").hide();
        clearInterval(timer);
        $(".getyzm").removeAttr("disabled");
        $('.getyzm').val('获取验证码');
        $(".getyzm").css({"background":"#0DC2B3"});
        $(".mobile").val("");
        $(".code").val("");
        $(".errorBox").html("");
        $('.receiveGiftBtn').css('background','#BBBBBB');
        $(".receiveGiftBtn").attr({"disabled": "disabled"});
    });
});

//倒计时
function resetCode(){
    $('.getyzm').val('(60S)重新获取');
    var second = 60;
    timer  = setInterval(function(){
        second -= 1;
        if(second >0 ){
            $('.getyzm').val("(" + second + "S)重新获取");
        }else{
            clearInterval(timer);
            $(".getyzm").removeAttr("disabled");
            $('.getyzm').val('获取验证码');
            $(".getyzm").css({"background":"#0DC2B3"});
        }
    },1000);
}

// 获取用户信息
function zxQuickSignUpOrIn(token) {
    $.ajax({
        url:basePath + "/reg/zxQuickSignUpOrIn",
        data:{
            token:token
        },
        // headers:{
        //     terminal:"web"
        // },
        success:function (res) {
            console.log(res);
            if(res.errorCode == 0){
                userId = res.result.userExpand.userId;
                if(res.result.isRegister){
                    flag = true;
                    Navigator.pushControllerWithID('fourth-page');
                }else{
                    // 跳转老用户的分享页面
                    flag = false;
                    Navigator.pushControllerWithID('fourth-page');
                    $(".sharePageOld").show();
                    $(".sharePageNew").hide();

                    $(".pagesMask").hide();
                    $(".registerBox").hide();
                    clearInterval(timer);
                    $(".getyzm").removeAttr("disabled");
                    $('.getyzm').val('获取验证码');
                    $(".getyzm").css({"background":"#0DC2B3"});
                    $(".mobile").val("");
                    $(".code").val("");
                    $(".errorBox").html("");
                    $('.receiveGiftBtn').css('background','#BBBBBB');
                    $(".receiveGiftBtn").attr({"disabled": "disabled"});
                }

            }else if(res.errorCode == 1000){
                $(".pagesMask").show();
                $(".registerBox").show();
                $(".mobile").focus();
                // $(".mobile").trigger("focus");
            }else if(res.errorCode == -1){
                $(".toastBox").show();
                $(".toastBox").html("系统异常");
                setTimeout(function () {
                    $(".toastBox").hide();
                },500)
            }

            // 新用户获取奖励
            if(flag){
                activityRewardR(userId,activityId);
            }
        },
        error:function (res) {
            $(".toastBox").show();
            $(".toastBox").html("系统异常");
            setTimeout(function () {
                $(".toastBox").hide();
            },500)
        }
    });
}

// 获取验证码
function sendVerifyCode(mobile) {
    $.ajax({
        url:basePath + "/reg/sendVerifyCode",
        data: {
            mobile: mobile
        },
        success: function (res) {
            if (res.errorCode === 0) {
                // $(".errorBox").html("验证码发送成功");
                $(".code").focus();
                $(".getyzm").attr({"disabled": "disabled"});
                $(".getyzm").css({"background": "#BBBBBB"});
                resetCode();
            } else if (res.errorCode === 7001) {
                $(".errorBox").html("系统异常");
            } else if (res.errorCode === 7002) {
                $(".errorBox").html("重复获取验证码");
            } else if (res.errorCode === 7003) {
                $(".errorBox").html("尝试次数达上限");
            } else if (res.errorCode === -1) {
                $(".errorBox").html("系统异常");
            }
        },
        error:function () {
            $(".toastBox").show();
            $(".toastBox").html("系统异常");
            setTimeout(function () {
                $(".toastBox").hide();
            },500)
        }
    })
}

//注册登录
function mobileSignUpOrIn(mobile,verifyCode) {
    $.ajax({
        url: basePath + '/reg/mobileSignUpOrIn',
        data: {
            mobile: mobile,
            verifyCode: verifyCode
        },
        // headers:{
        //     terminal:"web"
        // },
        success: function (res) {
            console.log(res)
            if (res.errorCode === 0) {
                $(".pagesMask").hide();
                $(".registerBox").hide();
                clearInterval(timer);
                $(".getyzm").removeAttr("disabled");
                $('.getyzm').val('获取验证码');
                $(".getyzm").css({"background":"#0DC2B3"});
                $(".mobile").val("");
                $(".code").val("");
                $(".errorBox").html("");
                $('.receiveGiftBtn').css('background','#BBBBBB');
                $(".receiveGiftBtn").attr({"disabled": "disabled"});

                userId = res.result.userExpand.userId;

                if(res.result.isRegister){
                    flag = true;
                    Navigator.pushControllerWithID('fourth-page');
                }else{
                    // 跳转老用户的分享页面
                    flag = false;
                    Navigator.pushControllerWithID('fourth-page');
                    $(".sharePageOld").show();
                    $(".sharePageNew").hide();
                }
            } else if (res.errorCode === 1003) {
                $(".errorBox").html("系统异常");
            } else if (res.errorCode === 7004) {
                $(".errorBox").html("验证码已过期");
            } else if (res.errorCode === 7005) {
                $(".errorBox").html("验证码错误次数达上限");
            } else if (res.errorCode === 7006) {
                $(".errorBox").html("验证码输入错误");
            } else if (res.errorCode === -1){
                $(".errorBox").html("系统异常");
            }

            // 新用户获取奖励
            if(flag){
                activityRewardR(userId,activityId);
            }
        },
        error:function (res) {
            $(".toastBox").show();
            $(".toastBox").html("系统异常");
            setTimeout(function () {
                $(".toastBox").hide();
            },500)
        }
    });
}

// 注册新用户获取奖励
function activityRewardR(userId,activityId) {
    $.ajax({
        url:basePath + "/zjfActivity/activityReward",
        data:{
            userId:userId,
            activityId:activityId,
            activityStage:"REG"
        },
        // headers:{
        //     terminal:"web"
        // },
        success:function (res) {
            console.log(res)
        },
        error:function (res) {
            $(".toastBox").show();
            $(".toastBox").html("系统异常");
            setTimeout(function () {
                $(".toastBox").hide();
            },500)
        }
    })
}