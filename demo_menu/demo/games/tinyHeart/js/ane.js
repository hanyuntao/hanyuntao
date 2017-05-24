//定义海葵的类
var aneObj = function() {
	//start point,control point,end point
	this.rootx = [];//海葵的根部
	this.headx = [];
	this.heady = [];
	this.amp = [];//海葵的振幅
	this.alpha = 0;//正弦函数的角度

}
aneObj.prototype.num = 50;//数量

// 海葵的初始化工作
aneObj.prototype.init = function() {
	for (var i = 0; i < this.num; i++) {
		this.rootx[i] = i*16+Math.random()*20;//随机设置海葵的位置
		this.headx[i] = this.rootx[i];
		this.heady[i] = canHeight - 250 +Math.random()*50;
		this.amp[i] = Math.random()*50 +50;
	}
}
aneObj.prototype.draw = function() {
	this.alpha += deltaTime*0.0006;
	var l = Math.sin(this.alpha);
	ctx2.save();
	ctx2.globalAlpha = 0.6;
	ctx2.strokeStyle = "#3b154e";
	ctx2.lineWidth = 20;
	ctx2.lineCap = "round";
	for (var i = 0; i < this.num; i++) {
		//beginPath,moveTo,lineTo,stroke,strokeStyle.lineWidth,lineCap,globalAlpha
		ctx2.beginPath();
		ctx2.moveTo(this.rootx[i],canHeight);
		this.headx[i] = this.rootx[i] + l*this.amp[i];
		ctx2.quadraticCurveTo(this.rootx[i],canHeight-100,this.headx[i],this.heady[i]);
		ctx2.stroke();
	}
	ctx2.restore();
}