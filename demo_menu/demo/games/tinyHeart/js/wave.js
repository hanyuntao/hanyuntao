var waveObj = function() {
	this.x = [];
	this.y = [];//圆圈的位置
	this.alive = [];
	this.r = [];//圈的半径
	this.alpha = 0;//圆的透明度
}
waveObj.prototype.num = 10;
waveObj.prototype.init = function() {
	for (var i = 0; i < this.num; i++) {
		this.alive[i] = false;
		this.r[i] = 0;
	}
}
waveObj.prototype.draw = function() {
	ctx1.save();
	ctx1.lineWidth = 2;
	ctx1.shadowBlur = 10;
	ctx1.shadowColor = "white";
	for (var i = 0; i < this.num; i++) {
		if(this.alive[i]) {
			//draw
			//绘制一个圆圈
			this.r[i] += deltaTime*0.04;
			if(this.r[i] >50) {
				this.alive[i] = false;
				break;
			}
			this.alpha = 1-this.r[i]/50;
			ctx1.beginPath();
			ctx1.strokeStyle = "rgba(255,255,255,"+this.alpha+")";
			ctx1.arc(this.x[i],this.y[i],this.r[i],0,Math.PI*2);
			ctx1.closePath;
			ctx1.stroke();
		}
	}
	ctx1.restore();
}
waveObj.prototype.born = function(x,y) {
	for (var i = 0; i < this.num; i++) {
		if(!this.alive[i]) {
			this.alive[i] = true;
			this.r[i] = 20;
			this.x[i] = x;
			this.y[i] = y;
			return;//只出生一个就好
		}
	}
}