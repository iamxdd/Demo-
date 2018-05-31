import React, {
  Component
} from 'react';
import DOM from "react-dom"
import { Menu , Dropdown ,Icon ,SubMenu } from "antd"
import $ from 'jquery'
import urls from '../config/urls'
import baseParams from '../util/baseParams'
import util from '../util/util'
import {addLoadingTask,deleteLoadingTask}  from '../util/loadingTask'
const commonHandle = window.commonHandle;
class NavMenu extends Component{
	constructor(props){
		super(props)
		this.onMenuClick = this.onMenuClick.bind(this)
		this.onTitleClick = this.onTitleClick.bind(this);
		this.onDropDown = this.onDropDown.bind(this);
		this.state = {
			id:this.props.id || "",
			title:this.props.title || "",
			currentSelect:this.props.currentSelect || "", 
			items: this.props.items || []
		}
	}
	createItems(data){
		var options = [];
	    data.map((item,i) => {
	      options.push(<Menu.Item key={i + 1} value={data[i].id+""}>{data[i].name}</Menu.Item>)
	    });
	    return options;
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			title:nextProps.title,
			id:nextProps.id,
			items:nextProps.items
		})
	}
	onMenuClick(e){
		//非选中下拉置灰
		console.log(e)
		let me = this;
		var value = e.item.props.value;
		commonHandle.fire("saveDimId",value);
		var uid = util.createUID(6);
		addLoadingTask(uid);
		$.ajax({
			type:"POST",
			url:urls.leftBottomChart,
			dataType:"json",
			headers:{
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
						"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
			},
			data:$.extend({},baseParams,{
				// filter:"TER",
				// dimId:"brand",
				// subKqiId:"UMTS_MOC_ACCESS_TIME",
				
				filter:window.moreParams.filter,
				dimId:window.moreParams.dimId,
				subKqiId:window.moreParams.subKqiId,
			})
		}).done((res)=>{
				deleteLoadingTask(uid);
				window.nameMapping4bottom = res.nameMapping;
				commonHandle.fire("updateGrid",value.value);
				commonHandle.fire("navClick",{data:res,title:value.text});
		})
		.fail(function(err){
			deleteLoadingTask(uid);
			console.error(err)
		})
	}
	onItemClick(e){
		// console.log("onItemClick",e);
		// var value = e.item.props.value;
		// commonHandle.fire("saveDimId",value);
	}
	onTitleClick(e){

		var value = $(e.currentTarget).attr("data-id");
		commonHandle.fire("saveFilter",value);
	}
	onDropDown(e){
		this.className = "active";
	    var target = DOM.findDOMNode(this.refs.dropDown);
	    var value = $(e.target).attr("data-id");
		$(target).addClass('active').siblings("span").removeClass('active');
		commonHandle.fire("saveFilter",value.trim());
	}
	render(){
		let menuItems = this.state.items.map((value,index)=>{
			return <Menu.Item key={index} value={value.id} onClick={this.onItemClick}>{value.name}</Menu.Item>
		} );
		let menu = <Menu onClick={this.onMenuClick}>{menuItems}</Menu>;
		return (
			<span ref="dropDown" onClick={this.onDropDown}>
				  <Dropdown overlay={menu} trigger={['click']}>
				    <a className="ant-dropdown-link" href="#" onClick={this.onTitleClick} data-id={this.state.id}>
				      {this.state.title} <Icon type="down" />
				    </a>
				  </Dropdown>
			</span>
		)
	}
}


export default NavMenu;