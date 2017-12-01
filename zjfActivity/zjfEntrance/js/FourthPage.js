/**
 * Created by yqzhou2 on 2017/11/27.
 */
$(document).ready(function () {
    //点击分享到微信
    $(".contentShareBtn").click(function(){
        //日志埋点
        _czc.push(['_trackEvent', '分享领取', '点击', '我妈急的上火了-第四页']);
        var flag = isPopupMask();
        var flag1 = isWeiXin();
        console.log(flag1)
        if(flag){
            activityRewardS(userId,activityId);

            $(".shareMask").show();
            $(".shareMask").click(function(){
                $(".shareMask").hide();
            })
        } else if(flag1){
            activityRewardS(userId,activityId);
            $(".shareMask").show();
            $(".shareMask").click(function(){
                $(".shareMask").hide();
            });
            jsSDKMethod();

        } else {
            $(".maskBox").show();
        }
    });

    /**
     * 点击分享图标获取奖励
     */
    $(".shareIcon").click(function () {
        activityRewardS(userId,activityId);
    })
});

//判断浏览器内核
function isPopupMask() {
    var isPopupMask = false, u = navigator.userAgent;
    if(!!u.match(/AppleWebKit.*Mobile.*/)) {
        var ua = navigator.userAgent.toLowerCase();
        //if(ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/WeiBo/i) == "weibo" || ((ua.indexOf('qq/') > -1) && ua.match(/mac/i))) {
        if(ua.match(/WeiBo/i) == "weibo" || (ua.indexOf('qq/') > -1)) {

            isPopupMask = true;
        }
    }
    return isPopupMask;
}

//判断微信浏览器内核
function isWeiXin() {
    var isWeiXin = false, u = navigator.userAgent;
    if(!!u.match(/AppleWebKit.*Mobile.*/)) {
        var ua = navigator.userAgent.toLowerCase();
        //if(ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/WeiBo/i) == "weibo" || ((ua.indexOf('qq/') > -1) && ua.match(/mac/i))) {
        if(ua.match(/MicroMessenger/i) == "micromessenger") {

            isWeiXin = true;
        }
    }
    return isWeiXin;
}

// 分享获取奖励
function activityRewardS(userId,activityId) {
    $.ajax({
        url:basePath + "/zjfActivity/activityReward",
        data:{
            userId:userId,
            activityId:activityId,
            activityStage:"SHARE"
        },
        // headers:{
        //     terminal:"web"
        // },
        success:function (res) {
            console.log(res)
            if(res.errorCode == 0){
                console.log("分享成功");

            }else if(res.errorCode == 2404){
                console.log("活动奖励已达到上限");
            }
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