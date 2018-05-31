import React,{ Component } from 'react'
import $ from "jquery"
import urls from '../config/urls'
import baseParams from '../util/baseParams'
import LineComponent from "./LineComponent"
import util from '../util/util'
import {addLoadingTask,deleteLoadingTask}  from '../util/loadingTask'
let commonHandle = window.commonHandle;
class Mask extends Component{
	constructor(props) {
		super(props);
		this.state = {
			show:this.props.show || false,
			x:this.props.x || 0,
			y:this.props.y || 0,
			unit:this.props.unit || ["",""],
			legend:this.props.legend || [],
			xAxis:this.props.xAxis || [],
			series : this.props.series || [],
			clickHandle : function(){}
		};
		this.clickHandle = this.clickHandle.bind(this);
		
	}
	componentDidMount(){
		commonHandle.on("showMask",(data)=>{
			var me = this;
			me.setState({
				show : data.show,
				x : data.x,
				y : data.y
			});
			var uid = util.createUID(6);
			addLoadingTask(uid)
			$.ajax({
				url:urls.leftTopChartLeft,
				dataType:"json",
				type:"POST",
				headers:{
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
						"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
				},
				data:$.extend({},baseParams,{
					dimValue: window.nameMapping4bottom[data.dimValue],
					filter:window.moreParams.filter,
					dimId:window.moreParams.dimId,
					leftKqis:commonHandle.leftKqis,
					rightKqis:commonHandle.rightKqis
					//subKqiId:window.moreParams.subKqiId
				})
			})
			.done(function(res){
				deleteLoadingTask(uid);
				me.setState({
					legend:res.legend,
					xAxis:res.xAxis,
					series:res.series,
					unit:res.unit
				});
			})
			.fail(function(err){
				deleteLoadingTask(uid);
				console.error(err);
			})			
		});
	}
	clickHandle(){
		this.setState({
			show:false
		})
	}
	render(){
		return <div id="mask" style={{
								width:"40%",
								height:300,
								zIndex:10000,
								position:"absolute",
								display:this.state.show === true ? "block" : "none",
								top:this.state.y,
								left:this.state.x
							}}>
					<div className="close-mask"><i className = "ant-modal-close-x" onClick={this.clickHandle} title="close"></i></div>
					<LineComponent {...{unit:this.state.unit,interval:"900",legend:this.state.legend,xAxis:this.state.xAxis,series:this.state.series,clickHandle:this.state.clickHandle}}/>
				</div>
	}
}

export default Mask;