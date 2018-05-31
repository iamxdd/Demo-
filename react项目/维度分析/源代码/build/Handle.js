var Handle = Class.extend({
	init:function(opts) {
			this.handlers = {}
	},
	/**
	 *功能说明 ：添加自定义事件
	 *参数说明 ：
	 *参数type-自定义事件类型(名称)
	 *参数hander-自定义事件类型对应的事件执行函数
	 **/
	on:function(type, handler) {
			var me = this;
			if (typeof me.handlers[type] === "undefined") {
				me.handlers[type] = [];
			}
			me.handlers[type].push(handler);
	},
	/**
	 *功能说明 ：触发自定义事件
	 *参数说明 ：
	 *参数type-自定义事件类型(名称)
	 *参数data-自定义事件类型对应的事件执行函数的参数
	 **/
	fire:function(type, data) {
		var me = this;
		if (me.handlers[type] instanceof Array) {
			var handlers = me.handlers[type];
			for (var i = 0; i < handlers.length; i++) {
				handlers[i](data);
			}
		}
	}
});