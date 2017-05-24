(function(){
    $(document).ready(function(){
        //-----------------------------------------------------------------------------------------------------
        // 4*4矩阵保存方块，通过矩阵旋转变换方块，旋转后将方块移至矩阵左上角，产生原地旋转的效果
        // 方块下落过程 记录方块位置及方块上一时刻位置,每更新一次 擦除上时刻,绘制这时刻
        //判断左右下是否出界
        //用一矩阵B记录已下落的方块,绘制时判断该位置是否已有方块,若有,当方块向下时,方块停止(end=1);当方块向左右，动作无效。
        //随机产生两个随机数，对应方块形状和颜色，产生并显示下一块，记录下一块的随机数。
        // 当矩阵B有一行全部有方块时，得一分，并将这行删除，在顶部加一行空数组。此时将Dom中样式从该行开始全部下移一行
        //2016-09-07 By Cissy
        //-----------------------------------------------------------------------------------------------------
        var height = 16; //画布高
        var width = 10;//宽高暂时没用上
        var block_now, block_next; //当前，下一方块对象
        var start;//计时器
        var speed = 1000;//方块下落速度（ms）
        var score = 0; //得分
        var rn1, rn2, rm1, rm2;//随机数
        var high;//最高分

        var beforeBlock = new Array();//16*10的方块 方块上一时刻的位置，用于擦除上一秒
        for (var i = 0; i < 16; i++) {
                beforeBlock[i] = new Array();
            }  
        var allBlock = new Array();//16*10的方块 已完成方块
        for (var i = 0; i < 16; i++) {
                allBlock[i] = new Array();
            }
        var ground = new Array();//16*10的画布
        for (var i = 0; i < 16; i++) {
            ground[i]= $($("#j-box tr")[i]).find("td");
        }
        var groundNext = new Array();//4*4的画布
        for (var i = 0; i < 4; i++) {
            groundNext[i]= $($(".next-block tr")[i]).find("td");
        }
        //-------------------------------------------
        //-------------方块类--------------------------------
        function Block() {
            this.dir = 40;
            this.end = 0;
            this.shape = new Array();//4*4的方块
            for (var i = 0; i < 4; i++) {
                this.shape[i] = new Array();
            }
            this.pos = [0, 3];//所在行，列
            this.color = ["#FFAEC9", "#B5E61D", "#99D9EA", "#C8BFE7", "#B97A57"];
        }
        Block.prototype = {
            //打印方块
            printBlock : function() {
                //判断是否超出边界
                //右
                var q; 
                loop1:
                for (var i = 3; i >= 0; i--) {
                    for (var j = 0; j < 4; j++) {
                        if (this.shape[j][i]) {
                            q = i+1;
                            break loop1;
                        }
                    }
                }
                if ((this.pos[1]+q-10) >= 0) {
                    this.pos[1] = 10-q;
                }
                //下
                var p;
                loop2:
                for (var i = 3; i >= 0; i--) {
                    for (var j = 0; j < 4; j++) {
                        if (this.shape[i][j]) {
                            p = i+1;
                            break loop2;
                        }
                    }
                }
                if (this.pos[0] > 16-p) {
                    this.end = 1;
                    clear(beforeBlock);
                    return;
                }
                clearBefore();
                //判断左右是否有方块
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if(this.shape[i][j] == 1){
                            if ($(ground[i + this.pos[0]][j + this.pos[1]]).css("z-index") == "1" && this.dir == 39) {
                                   this.pos[1]--;
                                } else if ($(ground[i + this.pos[0]][j + this.pos[1]]).css("z-index") == "1" && this.dir == 37){
                                    this.pos[1]++;
                                }
                        }    
                    }
                }
                //绘制方块
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if(this.shape[i][j] == 1) {
                            var x = i + this.pos[0];
                            var y = j + this.pos[1];
                            if (x < 15) {
                                if ($(ground[x+1][y]).css("z-index") == "1") {
                                    this.end = 1;
                                }
                            } else {
                                this.end = 1; 
                            }
                            $(ground[x][y]).css({"background" : this.color, "z-index" : 1});
                            beforeBlock[x][y] = 1;
                            //}
                        }
                    }
                }
                //若方块下落完毕，将方块加入到已下落方块矩阵中
                if (this.end == 1) {
                    for (var i = 0; i < 4; i++) {
                        for (var j = 0; j < 4; j++) {
                            if(this.shape[i][j]) {
                                allBlock[i + this.pos[0]][j + this.pos[1]] = 1;
                            }
                        }
                    }
                // test(); 
                }
            },
            //顺时针旋转方块90度
            changeBlock : function() { 
                var tmp = new Array();
                for (var i = 0; i < 4; i++) {
                    tmp[i] = new Array();
                }
                //顺时针旋转矩阵90度 
                for(var i = 0,dst = 3;i < 4;i++, dst--){
                    for(var j = 0;j < 4;j++)  
                        tmp[j][dst] = this.shape[i][j]; 
                }
                //将旋转后的图像移到矩阵左上角
                for(var i = 0;i < 4;i++){
                    var flag = 1;
                    for(var j = 0;j < 4;j++){
                        if (tmp[j][0]) {
                            flag = 0;
                        }
                    }
                    if (flag) {
                        for(var j = 0;j < 4;j++){
                            tmp[j].shift();
                            tmp[j].push(0);
                        }
                    }
                    // console.log(flag)
                }         
                //将旋转后的矩阵保存回原来的矩阵  
                for(var i = 0;i < 4;i++)  
                    for(var j = 0;j < 4;j++)  
                        this.shape[i][j] = tmp[i][j];   
            },
            //移动方块
            // 左(37) 上(38) 右(39) 下(40)
            moveBlock : function(keyCode) {
                if (!this.end) {
                    switch (keyCode) {
                        case 38 : {
                            this.dir = 38;
                            this.changeBlock();
                            this.printBlock();
                            break;
                        }
                        case 37 : {
                            this.dir = 37;
                            if (this.pos[1] > 0) {
                                this.pos[1]--;
                                this.printBlock();
                            }
                            break;
                        }
                        case 39 : {
                            this.dir = 39;
                            this.pos[1]++;
                            this.printBlock();
                            break;
                        }
                        case 40 : {
                            this.dir = 40;
                            this.goToEnd();
                            this.printBlock();
                            break;
                        }
                    }
                }
            },
            //速降
            goToEnd : function(){
                if (!this.end) {
                    var l,b,y1;
                    //得出方块的右边界
                    loop5:
                    for (var i = 3; i >= 0; i--) {
                        for (var j = 0; j < 4; j++) {
                            if (this.shape[j][i]) {
                                l = i;
                                break loop5;
                            }
                        }
                    }
                    //得出方块的下边界及最下的部分的列数
                    loop6:
                    for (var i = 3; i >= 0; i--) {
                        for (var j = 0; j < 4; j++) {
                            if (this.shape[i][j]) {
                                b = i;
                                y1 = j;
                                break loop6;
                            }
                        }
                    }
                    var x1 = this.pos[1];
                    var x2 = l + this.pos[1];
                    var x3 = -1;
                    var x4;
                    // test();
                    loop7:
                    //下方有方块时，下方方块最顶的块的行列
                    for (var i = 0; i < 16; i++) {
                        for (var j = x1; j <= x2; j++) {
                            if (allBlock[i][j]) {
                                x3 = i;//第几行已有方块
                                x2 = j;
                                break loop7;
                            }
                        }
                    }
                    //下方有方块时，上方块最底的块对应下方的块的行列
                    for (var i = 0; i < 16; i++) {
                        if (allBlock[i][y1+this.pos[1]]) {
                            x4 = i;
                            break;
                        } else {
                            x4 = 16;
                        }
                    }
                    console.log("y1:"+y1,"x4:"+x4,"b:"+b,this.pos[0],this.pos[1])
                    //方块下方没有方块时
                    if (x3 == -1) {
                        this.pos[0] = 15 - b;
                        this.end = 1;
                        return;
                    }
                    //算出下方最顶方块距离上方块对应位置距离
                    for (var i = 3; i >= 0; i--) {
                        if (this.shape[i][x2-this.pos[1]]){
                            x2 = x3 - i-this.pos[0] -1;
                            break;
                        }
                    }
                    //取较小距离，后者为上方方块最底距离下方对应方块距离
                    var x5 = Math.min(x2, (x4-b-1-this.pos[0]))
                    // this.pos[0] = x2+this.pos[0];
                    // console.log(x4,b,x4-b-1-this.pos[0],x5)
                    //将方块移动至该位置
                    this.pos[0] = x5+this.pos[0];
                    this.end = 1;
                }
            }
        }
        //--------------------------------------
        //--7种形状的方块继承Block----------------
        function Block_i() {
            Block.call(this);
            this.shape = [
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
        }
        Block_i.prototype = new Block();
        function Block_s() {
            Block.call(this);
            this.shape = [
                [0, 1, 1, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
        }
        Block_s.prototype = new Block();
        function Block_j() {
            Block.call(this);
            this.shape = [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0]
            ];
        }
        Block_j.prototype = new Block();
        function Block_o() {
            Block.call(this);
            this.shape = [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
        }
        Block_o.prototype = new Block();
        function Block_z() {
            Block.call(this);
            this.shape = [
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
        }
        Block_z.prototype = new Block();
        function Block_t() {
            Block.call(this);
            this.shape = [
                [0, 1, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
        }
        Block_t.prototype = new Block();
        function Block_l() {
            Block.call(this);
            this.shape = [
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0]
            ];
        }
        Block_l.prototype = new Block();
        //------------------------------------------------
        //产生一个方块
        function createBlock(r1, r2) {
            // var r = 0;
            switch (r1) {
                case 0: block_new = new Block_i();break;
                case 1: block_new = new Block_j();break;
                case 2: block_new = new Block_l();break;
                case 3: block_new = new Block_o();break;
                case 4: block_new = new Block_s();break;
                case 5: block_new = new Block_t();break;
                case 6: block_new = new Block_z();break;
            }
            block_new.color = block_new.color[r2];
            return block_new;
        }
        //用于清零16*10的矩阵（beforeBlock和allBlock）
        function clear(clearBlock) {
            for (var i = 0; i < 16; i++) {
                for (var j = 0; j < 10; j++) {
                    clearBlock[i][j] = 0;
                }
            }
        }
        //擦除上一时刻方块
        function clearBefore() {
            for (var i = 0; i < 16; i++) {
                for (var j = 0; j < 10; j++) {
                    if (beforeBlock[i][j]) {
                        $(ground[i][j]).css({"background" : "white", "z-index" : 0});
                        beforeBlock[i][j] = 0;   
                    }
                }
            }
        }
        //用于测试输出ground或allBlock
        function test() {
            console.log("----------------------------------------------------------");
            /*var testp = new Array();
            for (var i = 0; i < 16; i++) {
                testp[i] = new Array();
            }
            for (var i = 0; i < 16; i++) {
                for (var j = 0; j < 10; j++) {
                    testp[i][j] = $(ground[i][j]).css("z-index");
                }
            }
            for (var i = 0; i < 16; i++) {
                console.log(testp[i])
            }*/
            for (var i = 0; i < 16; i++) {
                console.log(allBlock[i])
            }
        }
        //得到分数，并判断是否为历史最高分并写入缓存
        function getScore() {
            var s;
            for (var i = 0; i < 16; i++) {
                s = 0;
                for (var j = 0; j < 10; j++) {
                    if (allBlock[i][j]) {
                        s++;
                    }
                }
                if (s == 10) {
                    $(".great").show();
                    setTimeout(function(){
                        $(".great").hide();
                    },200);
                    score = score+1;
                    allBlock.splice(i, 1);
                    allBlock.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                    clearBefore();
                    for (var k = i; k > 0; k--) {
                        for (var l = 0; l < 10; l++) {
                            $(ground[k][l]).css({"background":$(ground[k-1][l]).css("background"),
                                "z-index":$(ground[k-1][l]).css("z-index")});
                        }
                    }
                }
            }
            $("#score").html(score);
            if (high < score) {
                high = score;
                $("#high").html(high);
                document.cookie = "highScore ="+ high;
            }
        }
        //从缓存中获得历史最高分
        function getHighScore() {
            var cookie_arr = document.cookie.split(";");
            for (var i = 0; i < cookie_arr.length; i++) {
                var tip = cookie_arr[i].trim();
                if (tip.indexOf("highScore") == 0) {
                    return tip.substring("highScore".length+1, tip.length);
                }
            }
            return 0;
        }
        // console.log(document.cookie)
        // document.cookie = "highScore = 0";
        //初始化
        function init(){
            clear(allBlock);
            rn1 = Math.round(Math.random()*6);
            rn2 = Math.round(Math.random()*4);
            high = getHighScore();
            $("#high").html(high);
        }
        //显示下一块方块
        function printNext() {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    $(groundNext[i][j]).css("background","white");
                }
            }
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (block_next.shape[i][j]) {
                        $(groundNext[i][j]).css("background",block_next.color);
                    }
                }
            }
        }
        //主程序
        function play(){
            clear(beforeBlock);
            rm1 = rn1;
            rm2 = rn2;
            block_now = createBlock(rm1, rm2);
            block_now.printBlock();
            rn1 = Math.round(Math.random()*6);
            rn2 = Math.round(Math.random()*4);
            block_next = createBlock(rn1, rn2);
            printNext();
            start = setInterval(function(){
                block_now.printBlock();
                if (block_now.end) {
                    clearInterval(start);
                    if (block_now.pos[0] == 1) {
                        alert("Game Over !!");
                        location.reload();
                    } else {
                        play();
                    }
                }
                getScore();
                block_now.pos[0]++;
            },speed);
        }
        //---------------------------事件绑定------------------------------
        $(window).keydown(function(event){
            if ( 36 < event.keyCode && event.keyCode < 41 ) {
                block_now.moveBlock(event.keyCode);
            }
        })
        $("#j-stop").click(function(){
            if ($(this).html() == "开始游戏") {
                init();
                play();
                $(this).html("暂停").css("background","#FFC90E");
            }else if ($(this).html() == "暂停") {
                clearInterval(start);
                $(this).html("继续");
            }else if ($(this).html() == "继续") {
                start = setInterval(function(){
                block_now.printBlock();
                if (block_now.end) {
                    clearInterval(start);
                    if (block_now.pos[0] == 1) {
                        alert("Game Over !!");
                        location.reload();
                    } else {
                        play();
                    }
                }
                getScore();
                block_now.pos[0]++;
            },speed);
                $(this).html("暂停");
            }
        });
        $("#j-clear").click(function(){
            // document.cookie = "highScore = ''; expires="+(new Date(0)).toGMTString();
            document.cookie = "highScore = 0";//并不是清除掉缓存，只是将最高分清零
        })
        $("#restart").click(function(){
            location.reload();
        })
        //-----------------------------------------------------------------------------
    });
})();