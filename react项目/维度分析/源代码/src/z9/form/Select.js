import Form from './Form'
import $ from 'jquery'
import '../style/Select.css'
class Select extends Form {
	constructor(opts) {
		super(opts);
		this.handlers = {}
		this.config = {
			selector:"",     //组件容器css选择器          type:String    
			multiple:false,  //是否多选                   type:Boolean 
			minLength:-1,    //最少选中项                 type:Number
			maxLength:-1,    //最多选中项                 type:Number
			placeholder:"",  //值为空中的占位提示文字     type:String 
			validateFn:function(){
				return true
			},               //自定义验证规则(返回Boolean)type:Function 
			data:[]          //数据                       type:Array     如 ：[{value,text},{value,text}]
		};
		this.config = $.extend({}, this.config, opts);			
		this._cacheData(this.config.data);
		this.createDOM(this.data);
		this._initListContainerSize();
		this._initMenuClick();
		this._initShowClick();
		this._initInputMatch();
		$(document).on("click",(e)=>{
			if($("body").find("div[data-component-uid='"+this.uid+"']").is(".show")){
				this.hideList();
			}
		});
	}
	/**
	 *功能说明 : 储存数据
	 */	
	_cacheData(data){
		this.data = data.concat([]);
	}
	/**
	 *功能说明 ：创建DOM
	 **/
	createDOM(data){
		var uid = this.uid;
		$("div.z9-select[data-component-uid='"+uid+"']").remove();
		function createList(list){
			var listHTML = "";
			for(let i=0;i<list.length;i++){
				listHTML += ("<li data-value='" + list[i].value+"'><i class='z9-icon-select-multiple'></i><span title='"+ list[i].text +"'>" + list[i].text + "</span></li>")
			}
			return listHTML;
		}
		var htmlTemp = `<div class="z9-select" data-component-uid=${uid}>
							<ul>
								${createList(data)}
							</ul>
						</div>`;
		$("body").append(htmlTemp);
		$(this.config.selector).attr("data-component-uid",uid).attr("placeholder",this.config.placeholder);
	}
	/**
	 *初始化下拉列表大小
	 *
	 */
	_initListContainerSize(){
		var uid = this.uid;
		var height = $(this.config.selector).height();
		var width = $(this.config.selector).width();
		var top = $(this.config.selector).position().top + height + 15;
		var left = $(this.config.selector).position().left;
		$("div.z9-select[data-component-uid='"+uid+"']").css({
			width:width,
			top:top,
			left:left
		});
	}
	/**
	 *点击输入框展现下拉
     */
    _initShowClick(){
    	var me = this;
    	var uid = me.uid;
    	$(this.config.selector).on("click",function(e){
    		e.stopPropagation();
    		$("body").find("div[data-component-uid='"+uid+"']").toggleClass('show');
    		me.on("beforeShowList",null)
    	})
    }
    /**
	 *点击输入框展现下拉
     */
    showList(){
    	var uid = this.uid;
    	$("body").find("div[data-component-uid='"+uid+"']").addClass('show');
    }
    /**
	 *点击列表项隐藏列表
     */
	hideList(){
		var uid = this.uid;
		$("body").find("div[data-component-uid='"+uid+"']").removeClass('show');
	}
	/**
	 *注册下拉列表点击事件
	 */
	_initMenuClick(){
		var me = this;
		var uid = me.uid;
		$("body").find("div[data-component-uid='"+uid+"']").on("click",function(e){
			e.stopPropagation();
		});
		$("body").find("div[data-component-uid='"+uid+"']").on("click","li",function(e){
			e.stopPropagation();
			var opts = {
				value : $(this).attr("data-value"),
				text: $(this).text() 
			};
			var values = [];
			var indexs = [];
			if(me.config.multiple === true){
				$(this).toggleClass("selected");
				$("div[data-component-uid='"+uid+"'] li.selected").each(function(index,item){
					values.push($(item).text());
					indexs.push(index);
				});
				$(me.config.selector).val(values.join(", "));
				//重置组件值
				me.value = [];
				me.value = me.data.filter(function(item,index){
						 return item.value === values[index]
				});
				for(let i=0;i<values.length;i++){
					let v = me.data.filter(function(item,index){
									 return item.text === values[i]
					})[0];
					me.value.push(v)
				}
			}
			else{
				$(this).addClass("selected").siblings("li").removeClass("selected");
				$(me.config.selector).val(opts.text);
				//重置组件值
				me.value = [];
				for(let i=0;i<me.data.length;i++){
					if(me.data[i].text === opts.text )
					me.value.push( me.data[i] )
				}
				me.hideList();
			}
			me.on("menuClick",opts)
		})
	}
	/**
	 *输入模糊匹配
	 *
	 */
	_initInputMatch(){
		var me = this;
		$(this.config.selector).on("input",function(e){
			var value = e.target.value;
			if(value.trim() === ""){
				me.createDOM(me.data);
			}
			var matchs = me.data.filter(function(item,index){
				return (item.text+"").indexOf(value) !==-1
			});
			
			me.createDOM(matchs);
    		me._initListContainerSize();
    		me._initMenuClick();
    		me.showList();
			console.log(matchs);
			me.on("beforeSearch")
		});
	}    
    /**
     *设置组件数据
     *参数 data [Array[{value,text},{value,text}...]]
     */
    setData(data){
    	var uid = this.getUID();
    	if(data instanceof Array){
    		this.data = data;
    		$("div[data-component-uid='"+uid+"']").remove();
    		this._cacheData(data);
    		this.createDOM(data);
    		this._initListContainerSize();
    		this._initMenuClick();
    		this.showList();
    	}
    	else{
    		console.warn("数据格式要求为数组，请检查传入的数据")
    	}
    }
    /**
     *设置组件值
     *参数 value [Object{value,text}]
     */
    setValue(value){
    	var uid = this.getUID();
    	//先验证数据有效性
    	for(let i=0;i<value.length;i++){
    		if( !this.data.some(function(val,idx){
    			return val.value === value[i].value
    		}) ){
    			console.warn("设置组件值失败，设置的数据不存在于组件中。请检查")
    			return; 
    		}
    	}
    	if(this.config.multiple === true){
    		this.value = value;
    		$("body").find("div[data-component-uid='"+uid+"'] li").removeClass("selected");
    		for(let i=0;i<value.length;i++){
    			$("body").find("div[data-component-uid='"+uid+"'] li").filter(function(index,item){
	    			return $(item).attr("data-value") === value[i].value;
	    		}).addClass("selected");
    		}
    		$(this.config.selector).val(value.map(function(value,index){
    			return value.text
    		}).join(", "));
    	}else{
    		if( $.type(value) !== "object" ){
    			console.warn("单选下拉组件设置值value参数类型为{value,text}的对象,请检查输入的数据类型")
    			return;
    		}
    		this.value = [value];
    		$("body").find("div[data-component-uid='"+uid+"'] li").filter(function(index,item){
    			return $(item).attr("data-value") === value.value;
    		}).addClass("selected").siblings('li').removeClass('selected');
    		$(this.config.selector).val(value.text);
    	}
    }
    /**
     *验证规则是否通过
     *
     **/
    check(){
    	return this.config.validateFn();
    }
};
export default Select;