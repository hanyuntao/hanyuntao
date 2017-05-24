var momObj = function() {
	this.x;
	this.y;
	this.angle;//鱼妈妈和鼠标的角度

	this.momTailTimer = 0;
	this.momTailCount = 0;

	this.momEyeTimer = 0;
	this.momEyeCount = 0;
	//眨眼睛的时间间隔
	this.momEyeInterval = 1000;

	this.momBodyCount = 0;
}
momObj.prototype.init = function() {
	this.x = canWidth*0.5;
	this.y = canHeight*0.5;
	this.angle = 0;
}
momObj.prototype.draw = function() {
	//lerp x,y
	//使鱼妈妈的位置趋向鼠标的位置
	//该函数在commonFunction.js文件夹内
	this.x = lerpDistance(mx,this.x,0.94);
	this.y = lerpDistance(my,this.y,0.94);

	//delta angle计算角度差
	//Math.atan2(y,x)计算反正切值
	//y值是大鱼和鼠标的坐标差
	var deltaY = my-this.y;
	var deltaX = mx-this.x;
	var beta = Math.atan2(deltaY,deltaX) + Math.PI;

	//lerp angle
	this.angle = lerpAngle(beta,this.angle,0.9);

	//mom tail
	//大鱼摇尾巴
	this.momTailTimer += deltaTime;
	if (this.momTailTimer > 50) {
		this.momTailCount = (this.momTailCount + 1) % 8;
		this.momTailTimer %= 50;
	}

	//mom eye
	this.momEyeTimer += deltaTime;
	if (this.momEyeTimer > this.momEyeInterval) {
		this.momEyeCount = (this.momEyeCount+1) % 2;
		this.momEyeTimer %= this.momEyeInterval;
		if (this.momEyeCount == 0) {
			this.momEyeInterval = Math.random()*1500+2000;//[2000,3500)
		}
		else {
			this.momEyeInterval = 200;
		}
	}

	ctx1.save();
	ctx1.translate(this.x,this.y);
	ctx1.rotate(this.angle);//旋转画布

	var momTailCount = this.momTailCount;
	ctx1.drawImage(momTail[momTailCount],-momTail[momTailCount].width*0.5+30,-momTail[momTailCount].height*0.5);
	var momBodyCount = this.momBodyCount;
	//判断吃到什么果实
	if (data.double == 1) {//orange
		ctx1.drawImage(momBodyOrange[momBodyCount],-momBodyOrange[momBodyCount].width*0.5,-momBodyOrange[momBodyCount].height*0.5);
	}
	else {//blue
		ctx1.drawImage(momBodyBlue[momBodyCount],-momBodyBlue[momBodyCount].width*0.5,-momBodyBlue[momBodyCount].height*0.5);
	}
	var momEyeCount = this.momEyeCount;
	ctx1.drawImage(momEye[momEyeCount],-momEye[momEyeCount].width*0.5,-momEye[momEyeCount].height*0.5);
	ctx1.restore();
}