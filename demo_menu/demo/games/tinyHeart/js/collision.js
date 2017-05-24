//判断大鱼和果实的距离
function momFruitCollision() {
	if(data.gameOver) {
		return;
	}
	for (var i = 0; i < fruit.num; i++) {
		if(fruit.alive[i]) {
			//calculate length
			//数学上的平方差求距离
			var l = calLength2(fruit.x[i],fruit.y[i],mom.x,mom.y);
			if(l<900) {
				//fruit eated
				fruit.dead(i);
				//吃到果实，fruitNum加1，分数加1，
				data.fruitNum++;
				//吃到果实大鱼的身体发生颜色变化
				mom.momBodyCount++;
				if(mom.momBodyCount >7 ) {
					mom.momBodyCount = 7;
				}
				//蓝色果实加倍
				if (fruit.fruitType[i] == "blue") {
					data.double = 2;
				}
				wave.born(fruit.x[i],fruit.y[i]);
			}
		}
	}
	
}

//大鱼喂小鱼
//mom baby collision
function momBabyCollision() {
	if(data.gameOver) {
		return;
	}
	//只有大鱼肚子里有果实，才算有效碰撞
	if (data.fruitNum > 0) {
		var l = calLength2(mom.x,mom.y,baby.x,baby.y);
		if (l < 900) {
			//小鱼身体计数器恢复到0，也就是满血图片状态
			//大鱼的果实数量清零
			baby.babyBodyCount = 0;
			mom.momBodyCount = 0;
			//score update
			data.addScore();
			//draw halo
			halo.born(baby.x,baby.y);
		}
	}
}