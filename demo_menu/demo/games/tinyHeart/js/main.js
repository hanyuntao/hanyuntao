var can1;//canvas1
var can2;//canvas2
var ctx1;//context1
var ctx2;//context1
var canWidth;//画布的宽
var canHeight;//画布的高
var lastTime;//上一次执行的时间
var deltaTime;//两次执行的时间间隔
var bgPic = new Image();//背景图片
var ane;//海葵
var fruit;//果实
var mom;//大鱼妈妈
var mx;//鼠标x坐标
var my;//鼠标y坐标
var babyTail = new Array();//定义小鱼尾巴的图片数组
var babyEye = new Array();//定义小鱼眼睛的图片数组
var babyBody = new Array();//定义小鱼身体的图片数组

var momTail = new Array();//定义大鱼尾巴的图片数组
var momEye = new Array();//定义大鱼眼睛的图片数组
var momBodyOrange =new Array();
var momBodyBlue =new Array();

var data;//记录得分

var wave;//吃到果实后发出的圈

var halo;//大鱼喂到小鱼绘制圆圈特效

var dust;//漂浮物
var dustPic = [];//存放漂浮物图片的数组
document.body.onload = game;
//主程序
function game() {
	init();
	lastTime = Date.now();
	deltaTime = 0;
	gameloop();
}
//初始化
function init() {
	//获得canvas context
	can1 = document.getElementById("canvas1");//fishes,dust,UI,circle
	can2 = document.getElementById("canvas2");//background,ane,fruits
	ctx1 = can1.getContext("2d");
	ctx2 = can2.getContext("2d");

	can1.addEventListener("mousemove",onMouseMove,false);

	bgPic.src = "./images/background.jpg";

	canWidth = can1.width;
	canHeight = can1.height;

	ane = new aneObj();
	ane.init();

	fruit = new fruitObj();
	fruit.init();

	mom = new momObj();
	mom.init();

	baby = new babyObj();
	baby.init();

	mx = canWidth*0.5;
	my = canHeight*0.5;

	for (var i = 0; i < 8; i++) {
		babyTail[i] = new Image();
		babyTail[i].src = "./images/babyTail"+i+".png";
	}

	for (var i = 0; i < 2; i++) {
		babyEye[i] = new Image();
		babyEye[i].src = "./images/babyEye"+i+".png";
	}

	for (var i = 0; i < 20; i++) {
		babyBody[i] = new Image();
		babyBody[i].src = "./images/babyFade"+i+".png";
	}

	for (var i = 0; i < 8; i++) {
		momTail[i] = new Image();
		momTail[i].src = "./images/bigTail"+i+".png";
	}

	for (var i = 0; i < 2; i++) {
		momEye[i] = new Image();
		momEye[i].src = "./images/bigEye"+i+".png";
	}

	data = new dataObj();

	for (var i = 0; i < 8; i++) {
		momBodyOrange[i] = new Image();
		momBodyBlue[i] = new Image();
		momBodyOrange[i].src = "./images/bigSwim"+i+".png";
		momBodyBlue[i].src = "./images/bigSwimBlue"+i+".png";
	}

	ctx1.font = "30px Verdana";
	ctx1.textAlign = "center";

	wave = new waveObj();
	wave.init();

	halo = new haloObj();
	halo.init();
	for (var i = 0; i < 7; i++) {
		dustPic[i] = new Image();
		dustPic[i].src = "./images/dust"+i+".png";
	}
	dust = new dustObj();
	dust.init();
}

//每一帧都会刷新该函数
function gameloop() {
	window.requestAnimFrame(gameloop);//根据计算机的性能智能决定绘制频率
	var now = Date.now();
	deltaTime = now-lastTime;
	lastTime = now;
	if(deltaTime > 50) {
		deltaTime = 50;
	}
	drawBackground();//绘制背景
	ane.draw();//绘制海葵
	fruitMonitor();//每一帧都要进行判断果实数是否小于15
	fruit.draw();//绘制果实

	//每一次绘制的时候需要把canvas1画布清空
	ctx1.clearRect(0,0,canWidth,canHeight);
	mom.draw();//绘制大鱼
	momFruitCollision();//大鱼吃果实
	momBabyCollision();//大鱼喂小鱼
	baby.draw();

	data.draw();
	wave.draw();
	halo.draw();
	dust.draw();
}

//捕获鼠标运动
function onMouseMove(e) {
	if(e.offSetX || e.layerX) {
		mx = e.offSetX == undefined?e.layerX:e.offSetX;
		my = e.offSetY == undefined?e.layerY:e.offSetY;
	}
}