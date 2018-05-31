import BaseComponent from '../baseComponent/BaseComponent'
import $ from "jquery"
import createUID from '../util/createUID'
class Form extends BaseComponent {
	constructor(props) {
		super(props);
		this.type = "Form";     //组件类型
		this.version = "1.0";   //组件版本
		this.eventNames = [];   //组件相关自定义事件   
		this.data = [];         //组件数据
		this.value = [];        //组件值
		this.uid = createUID(6);
	}
	/**
	 *设置组件数据
	 */
	setData(){

	}
	/**
	 *获取组件数据
	 *return [{value,text},{value,text}]
	 */
	getData(){
		return this.data;
	}
	/**
	 *获取组件值
	 *return [{value,text}]
	 */
	getValue(){
		return this.value;
	}
	/**
	 *设置组件值
	 */
	setValue(){

	}
	/**
	 *设置组件是否可用状态
	 */
	setDisabled(){

	}
	/**
	 *获取组件是否可用状态
	 *return boolean
	 */
	getDisabled(){

	}
	/**
	 *验证组件值是否符合规则
	 *return boolean
	 */
	check(){
		
	}
	/**
	 *销毁组件
	 */
	destroy(){
		$("[data-component-uid="+this.uid+"]").off().find("*").off();
		$("[data-component-uid="+this.uid+"]").filter((index,elem)=>{
			return $(elem).get(0)!==$(this.config.selector).get(0);
		}).remove();
	}
	/**
	 *获取组件唯一标识
	 *return string
     */
    getUID(){
    	return this.uid;
    }
}
export default Form;