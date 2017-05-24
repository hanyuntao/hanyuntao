//记录得分
var dataObj = function() {
	this.fruitNum = 0;//果实数量
	this.double = 1;//记录吃到的蓝色果实数量，吃到蓝色果实得双倍的分
	this.score = 0;
	this.gameOver = false;//小鱼的颜色变白以后变true
	// gameOver状态下，大鱼不能吃到果实，也不能喂小鱼
	this.alpha = 0;
}


//写在游戏画面中
dataObj.prototype.draw = function() {
	var w =can1.width;
	var h =can1.height;

	ctx1.save();
	ctx1.shadowBlur = 10;
	ctx1.shadowColor = "white";
	ctx1.fillStyle = "white";
	ctx1.fillText("SCORE: "+this.score,w*0.5,h-20);

	if(this.gameOver) {
		this.alpha += deltaTime * 0.0005;
		if(this.alpha>1) {
			this.alpha=1;
		}
		ctx1.fillStyle = "rgba(255,255,255,"+this.alpha+")";
		ctx1.fillText("GAMEOVER",w*0.5,h*0.5);
	}
	ctx1.restore();
}

dataObj.prototype.addScore = function() {
	this.score += this.fruitNum*10*this.double;
	this.fruitNum = 0;
	this.double = 1;
}