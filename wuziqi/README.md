某公司前端笔试题。
作品详细介绍如下：

##提交文档解析
文档结构较为简单，文件夹中dom.html为dom版本，canvas.html为canvas版本，js文件夹包含三个js文件：conmmon.js，dom.js，canvas.js，css文件夹包含common.css文件。
***
##文件内容介绍
###common.js
此文件为两个版本公用文件，使用IIF封装，内部包含4个对象：Board，Record，Tip，Game；下面我分别介绍每个对象的作用：
####Board
Board对象为存储棋盘各个坐标信息的对象，实现了下图所示的结构：

![Board](http://img.blog.csdn.net/20170226141741255?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvamlhbjY3ODk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

将棋盘对象保存在一个二维数组（Board.data）中，且Board对象包含检测游戏胜利的方法play及isOver，当点击事件触发时，会先触发play方法，在play中修改Board.data内对应位置对象的type属性，然后play内部触发检查方法isOver，并返回检查结果（若结束则为胜利方的type值，否则返回undefined）；对于isOver，判定游戏胜利采用了先在4个方向（l，lt，t，rt）进行统计相同颜色的棋子，统计结束后再沿反方向进行遍历统计，统计完成后输出结果。

```
	var dir = ['l', 'lt', 't', 'rt'],//方向数组
		dDir = ['r', 'rb', 'b', 'lb'],//反方向数组
		
	//play方法
	play: function (x, y, type) {
		this.data[x][y].type = type;
		return this.isOver(x, y, type);//触发isOver
	}
```
####Record
Record对象存储游戏记录，实现下图所示结构：

![Record](http://img.blog.csdn.net/20170226145358026?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvamlhbjY3ODk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

将游戏记录保存在此对象中，对象中包含两个数组forget及record，forget为悔棋后保存或许将要撤销的操作，record保存游戏记录；对象中有三个方法rememberIt，forgetIt，add：rememberIt为撤销悔棋操作，forgetIt为悔棋操作，add为增加记录操作。
####Tip
Tip对象实现了弹出框及选择框，并将其暴露在全局；
####Game
Game对象为游戏相关方法的集合，较为简单，详细请看代码中注释内容。
###dom.js及canvas.js
两个文件都包含了drawNode，drawGrid，initGame方法，其中仅实现原理不同，功能都相同。
###其余文件不介绍

作者：jian6789

邮箱：569628556@qq.com


2017年2月26日

杨健
