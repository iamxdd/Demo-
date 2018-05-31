import React,{Component} from 'react'
import $ from "jquery"
import ajax from '../util/ajax'
import baseParams from '../util/baseParams'
import NavMenu from "./NavMenu"
import urls from '../config/urls'
import util from '../util/util'
import {addLoadingTask,deleteLoadingTask}  from '../util/loadingTask'
class LeftBottomNav extends Component{
	constructor(props) {
		super(props);
		this.state = {
				navs:[]
		}

	}
	componentDidMount(){
		var me = this;
		var uid = util.createUID(6);
		addLoadingTask(uid);
		$.ajax({
			url :urls.leftBottomNav,
			type:"POST",
			dataType:"json",
			headers:{
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
						"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
			},
			data:$.extend({}, baseParams)
		})	
		.done(function(res){
			console.log("Done!");
			deleteLoadingTask(uid);
			window.nameMapping4bottom = res.nameMapping;
			window.dimNavReady = true;
			if( $.type(res) === "array" && res.length === 0 ){
				$("#left-bottom .filrate_control").hide();
				window.moreParams.filter = "";
				window.moreParams.dimId = "";
			}
			else{
				window.moreParams.filter = res[0].id;
				window.moreParams.dimId = res[0].item[res[0].item.length - 1].id;
			}			
			me.setState({
				navs:res
			})
		})
		.fail(function(err){
			deleteLoadingTask(uid);
			console.error(err)
		})
	}
	render() {
		var navsComponent = []

		this.state.navs.map(function(v,i){
			navsComponent.push(<NavMenu key={i} id={v.id} title={v.name} items={v.item}/>)
		});
		return (
			<div className="nav">
				{navsComponent}
	        </div>
	    )
	}
}
export default LeftBottomNav;
