window.onload = function () {
    var edge = 20;//画布边框长度
    /**
     * 画点
     * el 元素 画点的位置元素
     * x y num 坐标
     * type string 棋子颜色
     * r num 棋子半径
     * return 节点位置信息
     */
    function drawNode(el, x, y, type, r) {
        r = r || 8;
        var context = el.getContext('2d');
        context.beginPath();
        context.arc(x + edge, y + edge, r, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = type;
        context.fill();
        return { 
            info: [x, y, type],
            bLoca: [] 
        };
    }
    /**
     * 画网格
     * el  元素  画网格的位置元素
     * num num 网格的数量
     * return num 棋盘网格每个格子的宽度/高度
     */
    function drawGride(el,num) {
        var gridEl = document.querySelector('#demo-canvas');
        num = num || 18;
        el.width = el.height = gridEl.width = gridEl.height = 460;
        var context = gridEl.getContext('2d'),
            width = gridEl.width - 2 * edge,
            unit = width / num,
            loca = 0;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(edge, edge);
        context.lineTo(edge, width + edge);
        context.lineTo(width + edge, width + edge);
        context.lineTo(width + edge, edge);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.lineWidth = 1;
        for (var i = 1; i < num; i++) {
            loca = i * unit + edge;
            context.moveTo(loca, edge);
            context.lineTo(loca, width + edge);
            context.moveTo(edge, loca);
            context.lineTo(width + edge, loca);
        }
        context.closePath();
        context.stroke();

        return unit;
    }
    /**
     * 清除制定位置的棋子
     * el 元素 画点的位置元素
     * x y num 坐标
     * width height num 宽度 高度
     */
    function clear(el, x, y, width, height) {
        var context = el.getContext('2d');
        context.clearRect(x-width/2-1+edge,y-height/2-1+edge,width+1,height+1);
    }
    /**
     * 悔棋操作
     */
    function forgetIt() {
        game.forgetIt(function (loca, el) {
            loca && clear(el, loca.info[0], loca.info[1], 17, 17);
        });
    }
    /**
     * 撤销悔棋操作
     */
    function rememberIt() {
        game.rememberIt(function (loca, el) {
            loca && drawNode(el, loca.info[0], loca.info[1], loca.info[2]);
        });
    }
    /**
     * 开始游戏
     * return Game Game对象
     */
    function start() {
        return new Game(initGame, drawNode, 1, '#demo-chess');
    }
    /**
     * 重新开始游戏
     */
    function reStart() {
        game = start();
    }
    /**
     * 初始化游戏
     * el 元素 网格位置
     * num num  网格数量
     */
    function initGame(el, num) {
        return drawGride(el,num);
    }

    document.getElementById('forgetIt').addEventListener('click', forgetIt);
    document.getElementById('rememberIt').addEventListener('click', rememberIt);
    document.getElementById('reStart').addEventListener('click', reStart);

    
    var game = start();//启动游戏
}
