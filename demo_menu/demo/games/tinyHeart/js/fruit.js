var fruitObj = function() {
	this.alive = [];//是否活着
	this.x = [];//果实的位置
	this.y = [];
	this.aneNo = [];//果实对应哪一个海葵number
	this.l = [];//果实的长度，从零到有，慢慢变大
	this.spd = [];//果实成长及移动的速度（个性化一下）
	this.fruitType = [];//果实类型
	this.orange = new Image();
	this.blue = new Image();
}
fruitObj.prototype.num = 30;
fruitObj.prototype.init = function() {
	for (var i = 0; i < this.num; i++) {
		this.alive[i] = false;
		this.x[i] = 0;
		this.y[i] = 0;
		this.aneNo[i] = 0;
		this.l[i] = 0;//果实的半径大小
		this.spd[i] = Math.random()*0.017+0.003;//[0.02,0.017)
		this.fruitType[i] = "";
	}
	this.orange.src = "./images/fruit.png";
	this.blue.src = "./images/blue.png";
}
fruitObj.prototype.draw = function() {
	for (var i = 0; i < this.num; i++) {
		//draw
		//find an ane,grow,fly up
		var pic;
		if(this.fruitType[i] == "blue") {
			pic=this.blue;
		}
		else {
			pic=this.orange;
		}
		if(this.alive[i]) {
			if(this.l[i] <= 14) {//果实半径小于14的时候一直在增大
				var NO = this.aneNo[i];
				this.x[i] = ane.headx[NO];
				this.y[i] = ane.heady[NO];
				this.l[i] += this.spd[i]*deltaTime;
			}
			else {//大于14以后脱离海葵
				this.y[i] -= this.spd[i]*7*deltaTime;
			}
			ctx2.drawImage(pic,this.x[i]-this.l[i]*0.5,this.y[i]-this.l[i]*0.5,this.l[i],this.l[i]);
			if(this.y[i] < 10) {
				this.alive[i] = false;
			}
		}
	}
}
fruitObj.prototype.born = function(i) {
	//随机找一个海葵安家
	//海葵出生的时候会长在哪一个海葵上
	this.aneNo[i] = Math.floor(Math.random()*ane.num);//从0到49,会有重复值
	this.l[i] = 0;
	this.alive[i] = true;
	var ran = Math.random();
	//随机生成蓝色或者黄色果实
	if(ran < 0.2) {
		this.fruitType[i] = "blue";
	}
	else {
		this.fruitType[i] = "orange";
	}
}
//果实被大鱼吃掉
fruitObj.prototype.dead = function(i) {
	this.alive[i] = false;
}
// //屏幕中少于15个果实时，新生一个果实
// fruitObj.prototype.update = function() {
// 	var num = 0;
// 	for (var i = 0; i < this.num; i++) {
// 		if(this.alive[i]==true) {
// 			num++;
// 		}
// 	}
// }
//监视功能
//如果屏幕中小于15个果实，则新生一个果实
function fruitMonitor() {
	var num = 0;
	for (var i = 0; i < fruit.num; i++) {
		if(fruit.alive[i]) {
			num++;
		}
	}
	if(num<15) {
		sendFruit();
		return;
	}
}
function sendFruit() {
	for (var i = 0; i < fruit.num; i++) {
		if(!fruit.alive[i]) {
			fruit.born(i);
			return;
		}
	}
}
