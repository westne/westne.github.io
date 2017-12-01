/**
 * Created by ZYQ on 2017/11/22.
 */
/**
 * Created by Admin on 2017/11/21.
 */
var processWidth = parseInt($('.progressBar').width());
var musicBtn = document.getElementsByClassName("musicBtn")[0];
var oAu = document.getElementsByTagName("audio")[0];
var activityId;
musicBtn.flag = true;
(function () {
    checkActivityIsValid("zjfEntrance");
    var ModuleA = {

    };

    window.ModuleA = ModuleA;

    if(window.AppInterface && window.AppInterface.setTitle){
        // 安卓
        window.AppInterface.setTitle("我妈急的上火了");
    }

    progressBar();

    audioAutoPlay('playMusic');

    $('html').one('touchstart',function(){
        oAu.play();
    });

})();

window.onload = function() {
    start();
};

function progressBar(){
    //初始化js进度条
    $("#bar").css("width","0px");
    //进度条的速度，越小越快
    var speed = 100;
    var percentum;
    bar = setInterval(function() {
        nowWidth = parseInt($("#bar").width());

        //宽度要不能大于进度条的总宽度
        if(nowWidth <= processWidth) {
            barWidth = (nowWidth + 1) + "px";
            $("#bar").css("width",barWidth);
        } else {
            //进度条读满后，停止
            clearInterval(bar);
        }

        // 进度百分数
        percentum = parseInt((nowWidth/processWidth)*100);
        if(percentum > 100){
            percentum = 100;
        }
        $('.percentNum').html(percentum + "%");

    }, speed);
}

function start() {
    clearInterval(bar);
    $("#bar").css("width", '2.506rem');
    $('.percentNum').html("100%");
    setTimeout(function() {
        $('.barContainer').hide();
    }, 500);

    //音乐暂停播放
    musicBtn.onclick = function(){
        if(musicBtn.flag){
            this.src = "../zjfEntrance/images/musicBtnOff.png";
            this.flag = false;
            this.className = "musicBtn";
            oAu.pause();
            game.sound = false;
        }else{
            this.src = "../zjfEntrance/images/musicBtn.png";
            this.flag = true;
            this.className = "animate3 musicBtn";
            oAu.play();
            game.sound = true;
        }
    };

    // 文字显隐
    wordMove();

    var oDiv=document.querySelector(".firstPageBtn");
    setTimeout(function () {
        oDiv.className="firstPageBtn animate1";
    },1500)
}

function wordMove() {
    var index = 0;
    time = setInterval(function () {
        $('.momWord').eq(index).fadeOut(500).siblings('.momWord').fadeIn(500);
        index++;
        if(index == 2){
            index = 0;
        }
    },1000)
}

//必须在微信Weixin JSAPI的WeixinJSBridgeReady才能生效
function audioAutoPlay(id){
    var audio = document.getElementById(id);
    audio.play();
    document.addEventListener("WeixinJSBridgeReady", function () {
        audio.play();
    }, false);
    document.addEventListener('YixinJSBridgeReady', function() {
        audio.play();
    }, false);
}

// 判断活动是否有效
function checkActivityIsValid(name) {
    $.ajax({
        url:basePath + "/zjfActivity/checkActivityIsValid",
        data:{
            name:name
        },
        success:function (res) {
            console.log(res);
            activityId = res.result.activityId;
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
