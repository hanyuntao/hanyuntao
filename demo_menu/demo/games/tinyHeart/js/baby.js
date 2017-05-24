var babyObj = function() {
	this.x;
	this.y;
	this.angle;

	//计时器
	this.babyTailTimer = 0;
	//记录图片序号
	this.babyTailCount = 0;

	this.babyEyeTimer = 0;
	this.babyEyeCount = 0;
	//当前的图片持续多长时间  ms
	this.babyEyeInterval = 1000;

	this.babyBodyTimer = 0;
	this.babyBodyCount = 0;

}
babyObj.prototype.init = function() {
	this.x = canWidth*0.5-50;
	this.y = canHeight*0.5-50;
	this.angle = 0;
	// this.babyBody.src = "./images/babyFade0.png";
}
babyObj.prototype.draw = function() {
	//lerp x,y
	//使小鱼的位置趋向鱼妈妈的位置
	//该函数在commonFunction.js文件夹内
	this.x = lerpDistance(mom.x-30,this.x,0.98);
	this.y = lerpDistance(mom.y-30,this.y,0.98);

	//delta angle计算角度差
	//Math.atan2(y,x)计算反正切值
	//y值是小鱼和大鱼的坐标差
	var deltaY = mom.y-this.y;
	var deltaX = mom.x-this.x;
	var beta = Math.atan2(deltaY,deltaX) + Math.PI;

	//lerp angle
	this.angle = lerpAngle(beta,this.angle,0.8);

	//baby  tail
	this.babyTailTimer += deltaTime;//两帧之间的时间差
	if(this.babyTailTimer > 50) {
		//this.babyTailCount的值一直是0~7
		this.babyTailCount = (this.babyTailCount + 1)%8;
		//复原计时器
		this.babyTailTimer%=50;
	}

	//	baby eye
	this.babyEyeTimer += deltaTime;
	if (this.babyEyeTimer > this.babyEyeInterval) {
		this.babyEyeCount = (this.babyEyeCount + 1)%2;
		this.babyEyeTimer %= this.babyEyeInterval;

		if(this.babyEyeCount == 0) {
			//睁着眼睛的时间不确定
			this.babyEyeInterval = Math.random() *1500+2000;//[2000,3500)
		}
		else {
			//小鱼眼睛闭起来的时间是固定的
			this.babyEyeInterval = 200;
		}
	}

	//	baby body
	this.babyBodyTimer +=deltaTime;
	if (this.babyBodyTimer > 300) {
		this.babyBodyCount = (this.babyBodyCount+1);
		if (this.babyBodyCount >= 20) {
			this.babyBodyCount = 19;
			//game over
			data.gameOver = true;
		}
		this.babyBodyTimer %= 300;
	}


	ctx1.save();
	ctx1.translate(this.x,this.y);
	ctx1.rotate(this.angle);//旋转画布

	var babyTailCount = this.babyTailCount;
	ctx1.drawImage(babyTail[babyTailCount],-babyTail[babyTailCount].width*0.5+23,-babyTail[babyTailCount].height*0.5);
	var babyBodyCount = this.babyBodyCount;
	ctx1.drawImage(babyBody[babyBodyCount],-babyBody[babyBodyCount].width*0.5,-babyBody[babyBodyCount].height*0.5);
	var babyEyeCount = this.babyEyeCount;
	ctx1.drawImage(babyEye[babyEyeCount],-babyEye[babyEyeCount].width*0.5,-babyEye[babyEyeCount].height*0.5);
	ctx1.restore();
}