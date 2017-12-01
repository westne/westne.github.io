var game; //游戏实例
var score = 0; // 当前分数
var isGameLoaded = false; // 是否加载资源完毕

// 初始化游戏主体
function gameModuleInit() {
    game = (new Game).init();
}

// 游戏主体  640*960
function Game() {
    this.timerOut = 13; // 总游戏时间 10s
    this.balls = []; // 撞击物组
    this.hoop = null; // 被撞击物组
    this.texts = []; // 撞击提示文字
    this.res = {}; // 图片和音频资源
    this.ballX = 170; // 球X坐标
    this.ballY = 540; // 球Y坐标
    this.ballAngle = 0; // 球角度
    this.maxBallsCount = 40; // 同屏最大球数
    this.winScore = 40; // 胜利分数
    this.sound = true; // false 是否开启音乐、音效
    this.state = "ready"; // 当前游戏状态
    this.scored = false; // 是否获得分数中
    this.arrowTimes = 0; // 闪烁计数器
    var w = (window.innerWidth || document.documentElement.clientWidth) || document.body.clientWidth;
    var h = (window.innerHeight || document.documentElement.clientHeight) || document.body.clientHeight;

    this.init = function () { // 初始化游戏
        this.setupCanvas();
        this.load();
        this.setupEventListeners();
        this.resizeToWindow();
        return this;
    };

    this.setupCanvas = function () { // 初始化配置画布
        this.canvas = document.getElementById("game_canvas");
        this.canvas.width = 640;
        this.canvas.height = 960;
    };

    this.setupEventListeners = function () { // 配置事件监听器
        this.canvas.addEventListener("touchstart", function (event) {
            if ("play" === this.state) { // 确保游戏开始
                // 判断默认行为是否可以被禁用
                if (event.cancelable) {
                    // 判断默认行为是否已经被禁用
                    if (!event.defaultPrevented) {
                        if (event.targetTouches.length === 1) { // 如果这个元素的位置内只有一个手指的话
                            var touch = event.targetTouches[0];
                            var box = this.canvas.getBoundingClientRect();
                            var x = (touch.pageX - box.left) * (this.canvas.width / box.width);
                            var y = (touch.pageY - box.top) * (this.canvas.height / box.height);
                            if (x >= 455 && x <= 625 && y >= 725 && y <= 889) {
                                this.click = true;
                                this.touch = true;
                                this.playSound("../zjfEntrance/sound/shoot.wav");
                            }
                        }
                    }
                }
            }
        }.bind(this), false);
        this.canvas.addEventListener("touchend", function () {
            this.touch = false
        }.bind(this), false);
    };

    this.resizeToWindow = function () { // 根据窗体大小调整画布
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px"
    };

    this.load = function () { // 加载图片和音频资源
        var s = 0;
        var i = this.getResources();
        for (var e = 0; e < i.length; e++) {
            var h = i[e].split(".").pop();
            if ("png" === h || "gif" === h) {
                var image = new Image;
                image.src = i[e];
                image.addEventListener("load", function () {
                    s++;
                    if (s >= i.length) {
                        isGameLoaded = true;
                    }
                }.bind(this), false);
                this.res[i[e]] = image
            } else {
                var sound = new Howl({
                    src: [i[e]]
                });
                s++;
                if (s >= i.length) {
                    isGameLoaded = true;
                }
                this.res[i[e]] = sound
            }
        }
    };

    this.getResources = function () { // 获取图片资源和声音
        return [
            "../zjfEntrance/images/background.png",
            "../zjfEntrance/images/man_0.png",
            "../zjfEntrance/images/man_1.png",
            "../zjfEntrance/images/bomb.png",
            "../zjfEntrance/images/face_0.png",
            "../zjfEntrance/images/face_1.png",
            "../zjfEntrance/images/face_2.png",
            "../zjfEntrance/images/face_3.png",
            "../zjfEntrance/images/leg.png",
            "../zjfEntrance/images/button_touch.png",
            "../zjfEntrance/images/button_un_touch.png",
            "../zjfEntrance/images/blood_lv_0.png",
            "../zjfEntrance/images/blood_lv_1.png",
            "../zjfEntrance/images/blood_lv_2.png",
            "../zjfEntrance/images/blood_lv_3.png",
            "../zjfEntrance/images/arrow.png",
            "../zjfEntrance/sound/bomb.wav",
            "../zjfEntrance/sound/shoot.wav",
            "../zjfEntrance/sound/fail.wav",
            "../zjfEntrance/sound/success.wav",
            "../zjfEntrance/images/game_fail_alert.png",
            "../zjfEntrance/images/game_fail_btn.png",
            "../zjfEntrance/images/game_success_alert.png",
            "../zjfEntrance/images/game_success_btn.png",
            "../zjfEntrance/images/1.png",
            "../zjfEntrance/images/2.png",
            "../zjfEntrance/images/3.png",
            "../zjfEntrance/images/bg.png",
            "../zjfEntrance/images/countDownTime.png"
        ]
    };

    this.start = function () {// 开始游戏
        var i = Date.now();
        setInterval(function () {
            var e = Date.now();
            var t = e - i;
            this.loop(t / 1e3);
            i = e
        }.bind(this), .06);
        this.hoop = new Hoop(246, 260);
        this.timer = setInterval(function () {
            this.timerOut = this.timerOut - 0.1;
            if ("play" === this.state && this.timerOut <= 0) {
                this.gameOver();
            }
        }.bind(this), 100);
    };

    this.loop = function (t) { // 循环刷新
        this.update(t);
        this.draw(this.canvas.getContext("2d"));
    };

    this.update = function (t) { // 刷新游戏
        if ("ready" === this.state && this.timerOut >= 1 && this.timerOut <= 10) {
            this.gameStart();
        }
        if ("play" === this.state) {
            if (score >= this.winScore) {
                this.gameOver();
            }
            for (s = 0; s < this.balls.length; s++) {
                var ball = this.balls[s];
                if (ball.falling && this.hoop.y - ball.y > 100 && !ball.scored) {
                    this.playSound("../zjfEntrance/sound/bomb.wav");
                    ball.setAngle(90);
                    score += 1;
                    this.texts.push(new PopText("-1", 565, 80));
                    ball.scored = true
                }
                ball.update(t);
                if (ball.y > 960) { // 移除球组
                    this.balls.splice(s, 1);
                }
            }
            if (this.click && this.ballY <= 950 && this.balls.length < this.maxBallsCount) {
                var newBall = new Ball(this.ballX, this.ballY);
                newBall.drawAngle = this.ballAngle;
                newBall.shoot(1480);
                this.balls.push(newBall);
                this.ballY = 700;
            }
            for (var s = 0; s < this.texts.length; s++) {
                this.texts[s].update(t)
            }
            this.click = false; // 刷新可点击
        }
    };

    this.draw = function (t) { // 绘制游戏 按遮盖层级升序
        // 绘制背景
        drawImage(t, this.res["../zjfEntrance/images/background.png"], 0, 0, 0, 0, 640, 960, 0, 0, 0, 640, 960);
        // 绘制被撞击物
        this.hoop.draw(t);
        // 绘制按钮、人、手上炸药包
        if (this.touch) {
            drawImage(t, this.res["../zjfEntrance/images/button_touch.png"], 455, 725, 0, 0, 170, 164, 0, 0, 0, 170, 164);
            drawImage(t, this.res["../zjfEntrance/images/man_1.png"], 125, 602, 0, 0, 380, 358, 0, 0, 0, 380, 358);
        } else {
            drawImage(t, this.res["../zjfEntrance/images/button_un_touch.png"], 455, 725, 0, 0, 170, 164, 0, 0, 0, 170, 164);
            drawImage(t, this.res["../zjfEntrance/images/bomb.png"], 170, 540, 0, 0, 281, 200, 0, 0, 0, 281, 200);
            drawImage(t, this.res["../zjfEntrance/images/man_0.png"], 125, 602, 0, 0, 380, 358, 0, 0, 0, 380, 358);
        }
        // 绘制血条
        if (score < 10) {
            drawImage(t, this.res["../zjfEntrance/images/blood_lv_1.png"], 565, 80, 0, 0, 64, 310, 0, 0, 0, 64, 310);
        } else if (score < 20) {
            drawImage(t, this.res["../zjfEntrance/images/blood_lv_2.png"], 565, 80, 0, 0, 64, 310, 0, 0, 0, 64, 310);
        } else {
            drawImage(t, this.res["../zjfEntrance/images/blood_lv_3.png"], 565, 80, 0, 0, 64, 310, 0, 0, 0, 64, 310);
        }
        drawImage(t, this.res["../zjfEntrance/images/blood_lv_0.png"], 565, 80, 0, 0, 64, 7.75 * score, 0, 0, 0, 64, 7.75 * score);
        // 绘制得分
        // this.drawText(t, score + "分", 550, 64, 40);
        // 绘制计时器
        this.drawText(t, this.timerOut <= 10.0 ? parseFloat(this.timerOut).toFixed(1) + "S" : 10.0 + "S", 184, 64, 34, "#FF6868");
        // 准备阶段绘制
        if ("ready" === this.state) {
            drawImage(t, this.res["../zjfEntrance/images/bg.png"], 0, 0, 0, 0, 1, 1, 0, 0, 0, 640, 960);
            drawImage(t, this.res["../zjfEntrance/images/countDownTime.png"], 250, 160, 0, 0, 312, 437, 0, 0, 0, 260, 325);
            if (this.timerOut > 12) {
                drawImage(t, this.res["../zjfEntrance/images/3.png"], 250, 300, 0, 0, 260, 325, 0, 0, 0, 260, 325);
            } else if (this.timerOut > 11) {
                drawImage(t, this.res["../zjfEntrance/images/2.png"], 250, 300, 0, 0, 260, 325, 0, 0, 0, 260, 325);
            } else if (this.timerOut > 10) {
                drawImage(t, this.res["../zjfEntrance/images/1.png"], 270, 300, 0, 0, 260, 325, 0, 0, 0, 260, 325);
            }


            //（1/60）/图
            var x = Math.floor(this.arrowTimes / 60);
            var y = x % 2;
            if (y === 0) {
                drawImage(t, this.res["../zjfEntrance/images/arrow.png"], 520, 630, 0, 0, 52, 68, 0, 0, 0, 52, 68);
                drawImage(t, this.res["../zjfEntrance/images/button_un_touch.png"], 455, 725, 0, 0, 170, 164, 0, 0, 0, 170, 164);
            } else {
                drawImage(t, this.res["../zjfEntrance/images/arrow.png"], 520, 650, 0, 0, 52, 68, 0, 0, 0, 52, 68);
                drawImage(t, this.res["../zjfEntrance/images/button_touch.png"], 455, 725, 0, 0, 170, 164, 0, 0, 0, 170, 164);
            }
            this.arrowTimes++;
        }
        // 游戏阶段绘制
        if ("play" === this.state) {
            for (s = 0; s < this.balls.length; s++) { // 绘制运动上抛撞击物_下降
                if (this.balls[s].y <= 80) { // 上抛撞击物_下降到一定位置不显示
                    this.balls[s].falling && this.balls[s].draw(t);
                }
            }
            for (s = 0; s < this.balls.length; s++) { // 绘制运动上抛撞击物_上升
                this.balls[s].falling || this.balls[s].draw(t);
            }
            for (s = 0; s < this.texts.length; s++) { // 绘制提示文字
                this.texts[s].draw(t)
            }
        }
        // 游戏结束绘制
        if ("over" === this.state) {

        }
    };

    // 游戏开始
    this.gameStart = function () {
        this.state = "play";
    };

    // 游戏结束
    this.gameOver = function () {
        clearInterval(this.timer);
        this.scored = false;
        this.click = true;
        this.balls = [];
        if ("over" !== this.state) {
            var game_alert_box = document.getElementById("game_alert_box");
            var game_alert_mask = document.getElementById("game_alert_mask");
            var game_alert_button = document.getElementById("game_alert_button");
            var time = (10-this.timerOut).toFixed(1);
            if (score >= 40) { // win
                this.playSound("../zjfEntrance/sound/success.wav");
                game_alert_box.style.backgroundImage = "url('../zjfEntrance/images/game_success_alert.png')"; //改变背景图片
                $("#game_alert_button").attr("src","../zjfEntrance/images/game_success_btn.png");
                $(".timeColor").html(time + "秒");
            } else { // lost
                this.playSound("../zjfEntrance/sound/fail.wav");
                game_alert_box.style.backgroundImage = "url('../zjfEntrance/images/game_fail_alert.png')"; //改变背景图片
                $("#game_alert_button").attr("src","../zjfEntrance/images/game_fail_btn.png");
                $("#gameOverText").html("很遗憾,虽然你已经很努力,但是妈妈的火气值还是很高啊!");
            }
            game_alert_mask.style.display = 'block';

            if(musicBtn.flag){
                this.src = "../zjfEntrance/images/musicBtnOff.png";
                // this.flag = false;
                this.className = "musicBtn";
                oAu.pause();
            }

            game_alert_button.onclick = function () {
                Navigator.pushControllerWithID('third-page');
                // if(musicBtn.flag){
                //     musicBtn.src = "../zjfEntrance/images/musicBtn.png";
                //     musicBtn.className = "animate3 musicBtn";
                //     oAu.play();
                // }
                // alert("成功");
            }
        }
        this.state = "over";
        //score = 0;
        //this.timerOut = 0;
    };

    // 绘制文本
    this.drawText = function (t, text, i, e, h, color) {
        t.font = h + "px Arial";
        t.strokeStyle = color;
        t.strokeText(text, i, e);
        t.fillStyle = color;
        t.fillText(text, i, e)
    };

    // 播放音效
    this.playSound = function (t) {
        if (this.sound) {
            this.res[t].play();
        }
    };

}

// 被撞击物
function Hoop(x, y) {
    this.x = x;
    this.y = y;
    this.faceTimes = 0;
    this.legTimes = 0;

    //TODO:雪碧图获取轻微抖动
    this.draw = function (t) {
        // 脸 0-24 （3/60）/图
        var x = Math.floor(this.faceTimes / 3);
        var y = x % 5;
        var s = Math.floor(x / 5);
        drawImage(t, this.getFaceImgByScore(), 20, -80, 600 * y + y, 667 * s + s, 600, 667, 0, 0, 0, 600, 667);
        this.faceTimes === 74 ? this.faceTimes = 0 : this.faceTimes++;
        // 腿 0-9 （6/60）/图
        var xx = Math.floor(this.legTimes / 6);
        var yy = xx % 5;
        var ss = Math.floor(xx / 5);
        drawImage(t, game.res["../zjfEntrance/images/leg.png"], 140, 435, 350 * yy + yy, 160 * ss + ss, 350, 160, 0, 0, 0, 350, 160);
        this.legTimes === 59 ? this.legTimes = 0 : this.legTimes++;
    };

    this.getFaceImgByScore = function () {
        if (score < 10) {
            return game.res["../zjfEntrance/images/face_0.png"];
        } else if (score < 20) {
            return game.res["../zjfEntrance/images/face_1.png"];
        } else if (score < 30) {
            return game.res["../zjfEntrance/images/face_2.png"];
        } else {
            return game.res["../zjfEntrance/images/face_3.png"];
        }
    };

}

// 撞击物
function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.speed = 100;
    this.angle = 270;
    this.gravity = 0;
    this.falling = 0;
    this.scored = 0;
    this.drawAngle = 0;
    this.angleVel = 100;

    this.setAngle = function (t) {
        this.angle = t;
        this.vx = this.speed * Math.cos(this.angle * Math.PI / 180);
        this.vy = this.speed * Math.sin(this.angle * Math.PI / 180);
        this.gravity = 0
    };

    this.shoot = function (t) {
        this.speed = t + Math.floor(40 * Math.random());
        this.setAngle(270)
    };

    this.update = function (t) {
        this.y += this.gravity * t;
        this.gravity += 1500 * t;
        this.x += this.vx * t;
        this.y += this.vy * t;
        this.vx > 500 && (this.vx = 500);
        this.vy > 500 && (this.vy = 500);
        this.gravity > this.speed && (this.falling = true); // 下落
        this.drawAngle += this.angleVel * t
    };

    this.draw = function (t) {
        var x = 2 - 0.01 * this.drawAngle > 0.7 ? 0.7 : 2 - 0.01 * this.drawAngle;
        drawImage(t, game.res["../zjfEntrance/images/bomb.png"], this.x, Math.floor(this.y - 100), 0, 0, 281, 200, 140.5, 100, this.drawAngle, x * 281, x * 200);
    }

}

// 绘制pop文字 +1
function PopText(t, s, i) {
    this.string = t;
    this.x = s;
    this.y = i;
    this.vy = -300;
    this.opacity = 1;
    this.update = function (t) {
        this.y += this.vy * t;
        this.vy += 1e3 * t;
        this.vy > 0 && this.opacity > 0 && (this.opacity -= 2 * t);
        this.opacity <= 0 && (this.opacity = 0)
    };
    this.draw = function (t) {
        t.globalAlpha = this.opacity;
        game.drawText(t, this.string, this.x + 15, this.y, 30, "#FF6868");
        t.globalAlpha = 1
    }
}

// 绘制图片
function drawImage(t, img, i, e, sx, sy, sWidth, sHeight, x, y, rotate, width, height) {
    t.save();
    t.translate(i + x, e + y);
    t.rotate(rotate * Math.PI / 180);
    t.drawImage(img, sx, sy, sWidth, sHeight, -x, -y, width, height);
    t.restore()
}