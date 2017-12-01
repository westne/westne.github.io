
/**
 * IOS分享功能
 * @param arg1 分享类型
 * @param arg2 分享标题
 * @param arg3 分享描述
 * @param arg4 分享链接
 * @param arg5 分享图片
 * @param arg6 分享回调
 */
function setShareAction(arg1,arg2,arg3,arg4,arg5,arg6){
	 if(arg1 == "QQ"){
	 window.location.href = "http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent(arg4)+"&desc="+arg3+"&pics=&flash=&site=智学网&style=202&width=24&height=24";
	 }else if(arg1 == "QZone"){
	 window.location.href = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+encodeURIComponent(arg4)+"&showcount=0&desc="+arg3+"&summary="+arg3+"&title="+arg2+"&site=智学网&pics=&style=203&width=98&height=22";
	 }else if(arg1 == "WXCIRCLE"){
		 $('#code').empty();
	     $('#code').qrcode(arg4);
	     $(".qrCode").show();
	     $(".qrClose").click(function(){
	         $(".qrCode").hide();
	     });
	 }else if(arg1 == "WX"){
		 $('#code').empty();
	     $('#code').qrcode(arg4);
	     $(".qrCode").show();
	     $(".qrClose").click(function(){
	         $(".qrCode").hide();
	     });
	 }
}

function shareMiniProgramWithParams(url,title,description,thumbnail) {
    $('#code').empty();
    $('#code').qrcode(url);
    $(".qrCode").show();
    $(".qrClose").click(function(){
        $(".qrCode").hide();
    });
}

// 页面载入前执行
(function(win){
    var errorCode;
    win.jQueryElements = win.jQueryElements || {};
    // var wxImg = basePath + '/public/module/global/image-specstar/wx.png';
    $(function(){
        //控制分享面板的显示隐藏
        templateStatus();
        // 执行分享函数
        setShareUrl(function(baseUrl){
            var options = {};
            options.friend = "javascript:;";
            options.wechat = "javascript:;";
            // 判断分享到qq、qqzone、weibo的方式
            if(window.AppInterface && window.AppInterface.share){
                // 安卓唤起应用
                options.qq = "javascript:;";
                options.zone = "javascript:;";
                options.weibo = "javascript:;";
                $("#btnQQ").click(function(){
                    $(".maskBox").hide();
                    //sendVoucher();
                    // 日志埋点
                    _czc.push(['_trackEvent', 'QQ家长群', '点击', um_param + '-分享到QQ家长群']);
                    if(window.AppInterface && window.AppInterface.share){
                        window.AppInterface.share("QQ",_title,_desc,baseUrl,_img,"shareMethod");
                    }
                });
                $("#btnZone").click(function(){
                    $(".maskBox").hide();
                    //sendVoucher();
                    _czc.push(['_trackEvent', 'QQ空间', '点击', um_param + '-分享到QQ空间']);
                    if(window.AppInterface && window.AppInterface.share){
                        window.AppInterface.share("QQZONE",_title,_desc,baseUrl,_img,"shareMethod");
                    }
                });
            }else if(setShareAction){
                // ios唤起应用
                options.qq = "javascript:;";
                options.zone = "javascript:;";
                options.weibo = "javascript:;";
                $("#btnQQ").click(function(){
                    $(".maskBox").hide();
                    //sendVoucher();
                    _czc.push(['_trackEvent', 'QQ家长群', '点击', um_param + '-分享到QQ家长群']);
                    setShareAction("QQ",_title,_desc,baseUrl,_img,"shareMethod");
                });
                $("#btnZone").click(function(){
                    $(".maskBox").hide();
                    //sendVoucher();
                    _czc.push(['_trackEvent', 'QQ空间', '点击', um_param + '-分享到QQ空间']);
                    setShareAction("QZone",_title,_desc,baseUrl,_img,"shareMethod");
                });
            }else{
                // 点击链接
                options.qq = "http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent(baseUrl)+"&desc="+_desc+"&title="+_title+"&pics=&flash=&site=智学网&style=202&width=24&height=24";
                options.zone = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+encodeURIComponent(baseUrl)+"&showcount=0&desc="+_desc+"&summary="+_desc+"&title="+_title+"&site=智学网&pics=&style=203&width=98&height=22";
                options.weibo = "http://v.t.sina.com.cn/share/share.php?url="+encodeURIComponent(baseUrl)+"&title="+_desc;
                $("#sharePanel").html(__shareTemplate__(options));
            }

            jQueryElements.btnWechat = $("#btnWechat");
            jQueryElements.btnFriend = $("#btnFriend");
            // 点击分享到朋友圈
            jQueryElements.btnWechat.click(function(){
                $(".maskBox").hide();
                //sendVoucher();
                _czc.push(['_trackEvent', '朋友圈', '点击', um_param + '-分享到朋友圈']);
                if(window.AppInterface && window.AppInterface.share){
                    // 安卓
                    window.AppInterface.share("WXCIRCLE",_title,_title,baseUrl,_img,"shareMethod");
                }else if(setShareAction){
                    // ios
                    setShareAction("WXCIRCLE",_title,_title,baseUrl,_img,"shareMethod");
                }else{
                    // web，生成二维码
                    $('#code').empty();
                    $('#code').qrcode(baseUrl);
                    $(".qrCode").show();
                    $(".qrClose").click(function(){
                        $(".qrCode").hide();
                    });
                }
            });
            // 点击分享给微信好友
            jQueryElements.btnFriend.click(function(){
                $(".maskBox").hide();
                //sendVoucher();
                _czc.push(['_trackEvent', '微信家长群', '点击', um_param + '-分享到微信家长群']);
                if(window.AppInterface && window.AppInterface.share){
                    // 安卓
                    window.AppInterface.share("WX",_title,_desc,baseUrl,_img,"shareMethod");
                }else if(setShareAction){
                    // ios
                    // setShareAction("WX",_title,_desc,baseUrl,_img,"shareMethod");
                    shareMiniProgramWithParams(baseUrl,_minititle,_minidesc,_miniimg);
                }else{
                    // web，生成二维码
                    $('#code').empty();
                    $('#code').qrcode(baseUrl);
                    $(".qrCode").show();
                    $(".qrClose").click(function(){
                        $(".qrCode").hide();
                    });
                }
            });
        });
    });
})(window);

// 分享回调函数
function shareMethod(flag){

}

// 显示分享链接
function setShareUrl(callback){
    var url = basePath + _link;
    callback(url);
}

//分享模板显示隐藏
function templateStatus(){
    $(".cancel_btn").click(function(){
        $(".maskBox").hide();
    });
}