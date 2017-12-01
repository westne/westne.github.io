/**
 * Created by ZYQ on 2017/11/30.
 */
var appId,
    timestamp,
    nonceStr,
    ticket,
    signature,
    str;

function jsSDKMethod() {
    $.ajax({
        url:"http://apptest.zhixue.com/zjf/home/jsSDKMethod",
        success:function (res) {
            var result = res.result;
            appId = result.appId;
            nonceStr = result.nonceStr;
            ticket = result.ticket;
            timestamp = result.timestamp;

            str = "jsapi_ticket=" + ticket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + window.location.href.split("#")[0];
            signature = hex_sha1(str);

            wx.config({
                debug: true,
                appId:appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                ]
            });

            wx.ready(function () {
                // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
                wx.checkJsApi({
                    jsApiList: [
                        'getNetworkType',
                        'previewImage'
                    ],
                    success: function (res) {
                        console.log(JSON.stringify(res));
                    }
                });

                // 2. 分享接口
                // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareAppMessage({
                    title: _title,
                    desc: _desc,
                    link: basePath + _link,
                    imgUrl: _img,
                    trigger: function (res) {
                        console.log('用户点击发送给朋友');
                    },
                    success: function (res) {
                        console.log('已分享');
                    },
                    cancel: function (res) {
                        console.log('已取消');
                    },
                    fail: function (res) {
                        console.log(JSON.stringify(res));
                    }
                });

                // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareTimeline({
                    title: _title,
                    link: basePath + _link,
                    imgUrl: _img,
                    trigger: function (res) {
                        console.log('用户点击分享到朋友圈');
                    },
                    success: function (res) {
                        console.log('已分享');
                    },
                    cancel: function (res) {
                        console.log('已取消');
                    },
                    fail: function (res) {
                        console.log(JSON.stringify(res));
                    }
                });


                // var shareData = typeof(shareData) === 'undefined' ? {
                //         title: 'Javen 微信JSSDK测试',
                //         desc: '微信JS-SDK,帮助第三方为用户提供更优质的移动web服务',
                //         link: 'http://www.cnblogs.com/zyw-205520/',
                //         imgUrl: 'http://g.hiphotos.baidu.com/imgad/pic/item/a8773912b31bb051be533b24317adab44aede043.jpg'
                //     } : shareData;
                //
                // wx.onMenuShareAppMessage(shareData);
                // wx.onMenuShareTimeline(shareData);
            });

            wx.error(function (res) {
                console.log(res.errMsg);
            });
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