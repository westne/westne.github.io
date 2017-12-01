/**
 * Created by xyyang3@iflytek.com on 15-10-27.
 */

/**
 * 公共方法
 * @type {Object}
 */

var CommonUtil = (function(){

    return {

        /**
         * 获取URL参数
         * @param item
         * @returns {String}
         */
        queryString: function (item) {
            var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
            return svalue ? svalue[1] : svalue;
        },

        /**
         * 设置字体
         */
        setFontSizeByHTML:function(){
            var iWidth = document.documentElement.clientWidth;
            var iHeight = document.documentElement.clientHeight;
            document.getElementsByTagName('html')[0].style.fontSize = iWidth / 16 + 'px';
        },

        /**
         * 格式化时间戳显示
         * @param x 待显示的日期时间，例如new Date()
         * @param y 需要显示的格式，例如"yyyy-MM-dd hh:mm:ss"
         * @returns {XML|string}
         * @example dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
         *          或 dateFormat(new Date(1392912000 * 1000),"yyyy/MM/dd hh:mm:ss") 结果为 "2014/02/21 00:00:00"
         */
        dateFormat : function (x, y) {
            var z = {M: x.getMonth() + 1, d: x.getDate(), h: x.getHours(), m: x.getMinutes(), s: x.getSeconds()};
            y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
                return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
            });
            return y.replace(/(y+)/g, function (v) {
                return x.getFullYear().toString().slice(-v.length)
            });
        },

        /**
         * Object转换成json
         * @param obj {Object} js对象
         * @returns {String}
         */
        toJSONString : function(obj){
            try{
                return JSON.stringify(obj);
            }catch (e){
                return null;
            }
        },

        /**
         * json转换成js对象
         * @param data {String} json
         * @returns {Object}
         */
        parseObject:function(data){
            try{
                if(typeof data === 'string' && JSON.parse){
                    return JSON.parse(data);
                }else if(typeof data === 'string'){
                    return eval('('+data+')');
                }else{
                    return data;
                }
            }catch (e){
                return {};
            }
        },

        /**
         * 发送异步请求
         * @param params 请求参数（必须）
         */
        sendRequest:function(params){
            $.ajax({
                type: params.type ? params.type : "GET",
                url: params.url,
                data: params.data ? params.data : {},
                dataType: params.dataType ? params.dataType : "json",
                success: function (data) {
                    if(params.success && typeof params.success === "function"){
                        params.success(CommonUtil.parseObject(data));
                    }
                },
                error: function (msg) {
                    if(params.error && typeof params.error === "function"){
                        params.error({});
                    }
                }
            });
        },
        cutStrLength : function(str,Ilength){
            var tmp = 0;
            var len = 0;
            var okLen = 0
            for(var i = 0;i < Ilength;i++){
                if(str.charCodeAt(i)>255){
                    tmp += 2;
                }else{
                    len += 1;
                    //okLen += 1;
                }
                okLen += 1;
                if(tmp + len == Ilength){
                    return (str.substring(0,okLen));
                    break;
                }
                if(tmp + len > Ilength){
                    return (str.substring(0,okLen-1)+"");
                    break;
                }
            }
        },
        checkFieldLength : function (element,fieldLength){
            var str = element.val();
            var theLen = 0;
            var teststr = '';
            for(i=0;i<str.length;i++){
                teststr = str.charAt(i);
                if(str.charCodeAt(i)>255){
                    theLen = theLen+2;
                }else{
                    theLen = theLen+1;
                }
            }
            //console.log(str+theLen);
            if(theLen > fieldLength){
                element.val(this.cutStrLength(str,fieldLength));
                return false;
            }else{
                return true;
            }
        }
    }
})();

var YUIDialog = (function(){
    return {
        tips:function(option){
            if(!option){
                return;
            }
            var dialog = $('<div class="y-tips yui_warn">'+option+'</div>');
            $('body').append(dialog);
            setTimeout(function(){
                //dialog.css({webkitTransform:'scale(.7)'});
                var height = dialog.height();
                dialog.css({'-webkit-transform':'translate(0,-'+height+'px)'});
                dialog.css({'-moz-transform':'translate(0,-'+height+'px)'});
                dialog.animate({opacity:0},100,function(){
                    dialog.remove();
                });
            },1500);
        },

        /**
         * 吐司弹框
         * @param option
         */
        toast:function(option){
            var content;
            var timeout = 1000;
            if(typeof option === 'string'){
                content = option;
            }else if(typeof option === 'object'){
                content = option.content;
            }
            if(!content){
                return;
            }
            var dialog = $('<div class="wap_dialog"></div>');
            var word = $('<p>'+content+'</p>');
            var mask = $('<div class="wap_dialog_bg"></div>');
            setTimeout(function(){
                dialog.css({webkitTransform:'scale(.7)'});
                dialog.animate({opacity:0},100,function(){
                    dialog.remove();
                });
            },timeout);
            dialog.append(word);
            dialog.append(mask);
            $('body').append(dialog);
            dialog.css({webkitTransform:'scale(1)',top:'48%','left':'50%',marginTop:-dialog.outerHeight()/2,marginLeft:-dialog.outerWidth()/2});
            dialog.animate({opacity:1},100);
        },

        dialog:function(option){
            var content;
            var title;
            var okBtn;
            var cancelBtn;
            if(typeof option === 'string'){
                content = option;
            }else if(typeof option === 'object'){
                content = option.content;
                title = option.title;
                okBtn = option.ok;
                cancelBtn = option.cancel;
            }
            if(!content || (!okBtn && typeof okBtn !== 'function')){
                return;
            }
            var panel = $('<div class="yui_dialog_alert"></div>');
            var dialog = $('<div class="yui_dialog"></div>');
            var head = $('<div class="yui_dialog_hd"></div>');
            if(title){
                var headTxt = $('<strong class="yui_dialog_title">'+title+'</strong>');
                head.append(headTxt);
            }
            var body = $('<div class="yui_dialog_bd">'+content+'</div>');
            var foot = $('<div class="yui_dialog_ft"></div>');
            var ok = $('<a href="javascript:;" class="yui_btn_dialog primary">确定</a>');
            if(cancelBtn && typeof cancelBtn === 'function'){
                var cancel = $('<a href="javascript:;" class="yui_btn_dialog default">取消</a>');
                foot.append(cancel);
                cancel.on("click",function(){
                    cancelBtn();
                    panel.remove();
                });
            }
            foot.append(ok);
            ok.on("click",function(){
                okBtn();
                panel.remove();
            });
            dialog.append(head);
            dialog.append(body);
            dialog.append(foot);
            var mask = $('<div class="yui_mask"></div>');
            panel.append(dialog);
            panel.append(mask);
            $('body').append(panel);
        }
    }
})();