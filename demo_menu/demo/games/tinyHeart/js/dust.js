var dustObj = function() {
	this.x = [];
	this.y = [];
	this.amp = [];
	this.NO = [];//dust用哪一张图片

	this.alpha;
}
dustObj.prototype.num = 30;
dustObj.prototype.init = function() {
	for (var i = 0; i < this.num; i++) {
		this.x[i] = Math.random()*canWidth;//漂浮物随机分布在画面上
		this.y[i] = Math.random()*canHeight;
		this.amp[i] = 20 + Math.random()*25;
		this.NO[i] = Math.floor(Math.random()*7);//[0,6]的整数值
		this.alpha = 0;//摇摆的角度从零开始
	}
}
dustObj.prototype.draw = function() {
	this.alpha += deltaTime*0.0006;
	var l = Math.sin(this.alpha);
	for (var i = 0; i < this.num; i++) {
		var no = this.NO[i];
		ctx1.drawImage(dustPic[no],this.x[i] + this.amp[i]*l,this.y[i]);
	}
}