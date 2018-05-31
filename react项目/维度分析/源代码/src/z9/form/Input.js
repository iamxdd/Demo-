import Form from './Form'
//import {reNumber} from '../util/regular'             //正则表达式通过webpack打包出来的引用有问题(暂未找到根因)
import $ from 'jquery'
class Input extends Form {
	constructor(props) {
		super(props);
		this.config = {
			selector:"",        //组件容器css选择器                                     type:String
			type:"string",      //输入文本类型 (string | number | phoneNumber )         type:String
			value:{value:"",text:""}, //值{value:"",text:""}                            type:Object
			placeholder:"",     //值为空中的占位提示文字                                type:String
			minLength:-1,       //最大输入长度(-1表示没有最大长度限制)                  type:Number
			maxLength:-1,       //最大输入长度(-1表示没有最大长度限制)                  type:Number
			validateFn:function(){      //自定义验证规则(返回Boolean)                   type:Function                    
				return true;
			}
		};	
		this.config = $.extend({}, this.config, props);
		this._initValue();
		$(this.config.selector).on("input",(e)=>{
			var reNumber = /^\s*\d*(?:\.{0,1})\d*\s*$/gi;
			var maxLength = this.config.maxLength;
			var value = $(e.target).val();
			//超出字符最大限制处理
			if(maxLength!==-1 && typeof(maxLength) === "number" && value.length>maxLength){
				$(e.target).val( value.slice(0,this.config.maxLength) )
			}
			//非数字处理
			if(this.config.type.trim() === "number"){
				$(e.target).val( $(e.target).val().replace(/[^\d\.]/gi,"") );
				let value = $(e.target).val();
				if( !reNumber.test( value ) ){
					$(e.target).val( $(e.target).val().slice(0,-1) );
				}
			}
		});
	}
	/**
	 * 设置初始值
	 *
	 */
	_initValue(){
		$(this.config.selector)
		.val(this.config.value.text)
		.attr("data-value",this.config.value.value)
		.attr("data-component-uid",this.uid);
		this.value = this.config.value;
	}
	/**
	 * 设置组件值
	 * params value [type:Object]   {value,text} 
	 */
	setValue(value){
		$(this.config.selector).val(value.text).attr("data-value",value.value);
		this.value = value;
	}
	/**
	 * 
	 */
	getValue(){
		return this.value;
	}
};
export default Input;