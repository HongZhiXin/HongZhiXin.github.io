(function () {
	var dir = ['l', 'lt', 't', 'rt'],//方向数组
		dDir = ['r', 'rb', 'b', 'lb'],//反方向数组
		colorType = { black: 1, white: 2 };
	/**
	 * 根据对象val来获取key
	 */
	function getKey(obj, val) {
		for (var item in obj)
			if (obj[item] == val) return item;
	}
	/**
	 * 保存棋盘上各个节点的信息，保存在data中
	 */
	var Board = function (num) {
		this.$num = num = num + 1;
		var xArr = [],
			yArr = null;
		this.data = xArr = [];
		for (var i = 0; i < num; i++) {
			yArr = [];
			for (var j = 0; j < num; j++)
				yArr.push(this.createObj(i, j));

			xArr.push(yArr);
		}
		this.connect(xArr);
	}

	var bProto = Board.prototype;
	/**
	 * 创建节点对象
	 */
	bProto.createObj = function (x, y) {
		return {
			x: x,
			y: y,
			type: null,
			connect: {}
		}
	}
	/**
	 * 将各个节点对象间按照一定的关系进行链接
	 * data  二维数组
	 */
	bProto.connect = function (data) {
		var dataLen = data.length,
			len = 0;
		for (var i = 0; i < dataLen; i++) {
			len = data[i].length;
			for (var j = 0; j < len; j++)
				this.connectNode(i, j, data);
		}
	}
	/**
	 * 根据下标对数据进行链接
	 * x num 横坐标
	 * y num 纵坐标
	 * data  二维数组  Board节点信息
	 */
	bProto.connectNode = function (x, y, data) {
		var connect = data[x][y].connect,
			max = this.$num - 1;
		if (x * y != 0)
			connect.lt = data[x - 1][y - 1];
		if (y != 0)
			connect.t = data[x][y - 1];
		if (x != max && y != 0)
			connect.rt = data[x + 1][y - 1];
		if (x != max)
			connect.r = data[x + 1][y];
		if (x != max && y != max)
			connect.rb = data[x + 1][y + 1];
		if (y != max)
			connect.b = data[x][y + 1];
		if (y != max && x != 0)
			connect.lb = data[x - 1][y + 1];
		if (x != 0)
			connect.l = data[x - 1][y];
	}
	/**
	 * 修改某一节点的信息
	 * x num 横坐标
	 * y num 纵坐标
	 * type  num  棋子颜色
	 */
	bProto.play = function (x, y, type) {
		this.data[x][y].type = type;
		return this.isOver(x, y, type);
	}
	/**
	 * 判定游戏是否结束，结束返回胜者type，否则返回undefined
	 * x  y num  坐标
	 * type num  棋子颜色
	 */
	bProto.isOver = function (x, y, type) {
		var count = 0,
			len = dir.length,
			node = this.data[x][y],
			child = null;
		for (var i = 0; i < len; i++) {
			count = 0;
			child = node;
			for (; child; child = child.connect[dir[i]]) {
				if (type != child.type) break;
				count++;
			}
			child = node.connect[dDir[i]];
			for (; child; child = child.connect[dDir[i]]) {
				if (type != child.type) break;
				count++;
			}
			if (count > 4) return type;
		}
	}
	/**
	 * 游戏记录存储对象
	 * record  数组  栈的方式存储游戏记录
	 * forget  数组  栈的方式存储可能需要撤销的操作
	 */
	var Record = function () {
		this.record = [];
		this.forget = [];
	}

	var rProto = Record.prototype;
	/**
	 * 将arr1的最后一个元素转存到arr2
	 */
	rProto.move = function (arr1, arr2) {
		if (arr1.length == 0) return;
		var save = arr1.pop();
		arr2.push(save);
		return save;
	}
	/**
	 * 悔棋操作
	 */
	rProto.forgetIt = function () {
		return this.move(this.record, this.forget);
	}
	/**
	 * 撤销悔棋操作
	 */
	rProto.rememberIt = function () {
		return this.move(this.forget, this.record);
	}
	/**
	 * 增加游戏记录并清空forget
	 */
	rProto.add = function (item) {
		this.record.push(item);
		this.forget.length = 0;
	}

	/**
	 * 弹出层对象 包括 alert chose 两种
	 */
	window.Tip = {
		TIP_CSS_STR: 'width:400px;position:fixed;top:10%;left:-200px;box-shadow: 5px 5px 5px #000;line-height:50px;'
		+ 'background-color:#EEB750;margin:0 50%;text-align:center;z-index:10;border:1px solid #000;border-radius:6px;',
		alert: function (str, m) {
			var mask = this.mask(),
				tip = this.create(this.TIP_CSS_STR, str),
				eCssStr =
					'width:60px;height:20px;line-height:20px;left:-30px;margin:16px auto;'
					+ 'border:1px solid #000;border-radius:2px;cursor:pointer;',
				enter = this.create(eCssStr, '确定', function () {
					m && m();
					tip.remove();
					mask.remove();
				});
			tip.appendChild(enter);
			document.body.appendChild(tip);
		},
		chose: function (str, o1, m1, o2, m2) {
			var mask = this.mask(),
				tip = this.create(this.TIP_CSS_STR, str),
				o1CssStr =
					'width:60px;height:20px;line-height:20px;float:left;'
					+ 'border:1px solid #000;border-radius:2px;cursor:pointer;',
				option1 = this.create(o1CssStr, o1, function () {
					m1 && m1();
					tip.remove();
					mask.remove();
				}),
				o2CssStr = o1CssStr.replace('left', 'right'),
				option2 = this.create(o2CssStr, o2, function () {
					m2 && m2();
					tip.remove();
					mask.remove();
				}),
				clear = this.create('clear:both;height:0;line-height:0;font-size:0;'),
				warp = this.create('width:60%;margin:20px auto;');
			warp.appendChild(option1);
			warp.appendChild(option2);
			warp.appendChild(clear);
			tip.appendChild(warp);
			document.body.appendChild(tip);
		},
		create: function (cssStr, text, m) {
			var node = document.createElement('div');
			node.style.cssText = cssStr;
			if (text) node.innerText = text;
			m && node.addEventListener('click', function (e) {
				m();
			});
			return node;
		},
		mask: function () {
			var mask = document.createElement('div');
			mask.style.cssText =
				'position:fixed;top:0;width:100%;height:100%;background-color:#000;opacity:0.5;z-index:9;';
			document.body.appendChild(mask);
			return mask;
		}
	}
	/**
	 * Game对象
	 * initGame  方法  初始化游戏
	 * drawNode  方法  下棋画点函数
	 * type  数值  棋子颜色类型
	 * el  字符  棋子将要添加的元素位置
	 * num  数值  棋盘网格数
	 */
	var Game = function (initGame, drawNode, type, el, num) {
		this.$el = el = el.nodeType ?
			el : document.querySelector(el);//el 可以直接传递元素
		this.$unit = initGame(el);  //initGame返回棋盘每个格子的宽度/单元
		this.$curType = type;
		this.$num = num || 18;
		this.$board = new Board(this.$num);//存储Board
		this.$record = new Record();//存储Record
		this.$isOver = false;
		this._drawNode = drawNode;//画点函数
		this.addEnent(el, this);//增加事件监听
		this.choseFirst();
	}

	var gProto = Game.prototype;
	/**
	 * 选择先手棋子
	 */
	gProto.choseFirst = function () {
		var me = this;
		Tip.chose('请选择先手方...', '黑棋', function () {
			me.change(colorType.black);
		}, '白棋', function () {
			me.change(colorType.white);
		});
	}
	/**
	 * 根据点击位置获取棋子应该出现的正确位置
	 * loca 数组 点击位置数组
	 */
	gProto.getLoca = function (loca) {
		var unit = this.$unit,
			x = Math.round(loca[0] / unit),
			y = Math.round(loca[1] / unit);
		return [x, y];
	}
	/**
	 * 增加事件监听
	 */
	gProto.addEnent = function (el, me) {
		el.addEventListener('click', function (e) {
			if (me.$isOver) return;
			var x = e.clientX + el.parentNode.parentNode.scrollLeft
				- el.parentNode.offsetLeft - 20,
				y = e.clientY + el.parentNode.parentNode.scrollTop
					- el.parentNode.offsetTop - 20,
				loca = me.getLoca([x, y]),
				node = null;
			if ((loca[0] < 0 || loca[0] > me.$num)
				|| (loca[1] < 0 || loca[1] > me.$num)) return;
			if (me.$board.data[loca[0]][loca[1]].type) return;
			node = me._drawNode(el, loca[0] * me.$unit,
				loca[1] * me.$unit, me.getCloor()); //将返回的节点保存在node中
			node.bLoca[0] = loca[0];
			node.bLoca[1] = loca[1];//存储Board对象中节点相应的坐标
			me.$record.add(node);//将节点保存在Record中
			me.check(loca) && me.over(me.$curType);//检查游戏是否结束
			me.change();//修改当前棋子
		});
	}
	/**
	 * 修改当前棋子颜色
	 * type num? 可为空
	 */
	gProto.change = function (type) {
		this.$curType = type ? type :
			(this.$curType == colorType.black ?
				colorType.white : colorType.black);

		var curColor = document.getElementById('curType');
		if (curColor)
			curColor.style.backgroundColor =
				this.$curType == colorType.black ?
					'black' : 'white';
	}
	/**
	 * 获取当前节点颜色
	 */
	gProto.getCloor = function () {
		return getKey(colorType, this.$curType);
	}
	/**
	 * 修改Board中节点数据，并检查游戏结果
	 * lcoa 数组  Board中对应节点的坐标
	 * 返回值 type||undefined
	 */
	gProto.check = function (loca) {
		return this.$board.play(loca[0], loca[1], this.$curType);
	}
	/**
	 * 悔棋操作
	 * forget 方法
	 */
	gProto.forgetIt = function (forget) {
		this.makeIt('forgetIt', forget, null);
	}
	/**
	 * 撤销悔棋操作
	 * remember 方法
	 */
	gProto.rememberIt = function (remember) {
		this.makeIt('rememberIt', remember, this.$curType);
	}
	/**
	 * 对Record对象的操作函数
	 * make 字符串 对应的Record中的方法名
	 * method 方法 对应执行的操作
	 * type num 类型 无则为null
	 */
	gProto.makeIt = function (make, method, type) {
		if (this.$isOver) return;
		var record = this.$record[make]();
		if (!record) return;
		method(record, this.$el);
		this.$board.data[record.bLoca[0]][record.bLoca[1]].type = type;
		this.change();
	}
	/**
	 * 游戏结束提示方法
	 */
	gProto.over = function (re) {
		Tip.alert((re == colorType.black ? '黑棋' : '白棋')
			+ '获胜 ！', function () { });
		this.$isOver = true;
	}

	window.Game = Game;
})()