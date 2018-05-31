import React,{Component} from "react"
import { Spin } from 'antd';
import $ from "jquery"
import baseParams from '../util/baseParams'
import NavSelect from './NavSelect'
import LineComponent from './LineComponent'
import urls from "../config/urls"
import util from '../util/util'
import {addLoadingTask,deleteLoadingTask}  from '../util/loadingTask'
const commonHandle = window.commonHandle;

class LeftTopRight extends Component{
	constructor(props) {
		super(props);
		this.state = {
			options:this.props.options || [{value:1,text:"选项一"},{value:2,text:"选项二"},{value:3,text:"选项三"}],
			currentSelect:this.props.currentSelect || 2,
			unit:this.props.unit || ["",""],
			legend:this.props.legend || [],
			xAxis:this.props.xAxis|| [],
			series:this.props.series||[],
			tipsUnit:this.props.tipsUnit || []
		};
		console.log("++++++++++++++++++++++++",this.props.legend);
	}
	componentDidMount() {
		commonHandle.on("selected-right",(data)=>{
			var uid = util.createUID(6);
			addLoadingTask(uid);
			$.ajax({
				url:urls.leftTopChartRight,
				type:"POST",
				dataType:"json",
				headers:{
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
						"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
				},
				data:$.extend({}, baseParams, {
					selectedValue:window.nameMapping[data.seriesName]
				})				
			})
			.done((data)=>{
	
					deleteLoadingTask(uid);
					this.setState({
						unit:data.unit,
						legend:data.legend,
						xAxis:data.xAxis,
						series:data.series,
						showLoading:false,
						tipsUnit:data.unit
					})
			})
			.fail((err)=>{
				deleteLoadingTask(uid);
				console.error(err);
			})
		});
		
		// $.ajax({
		// 		url:urls.leftTopChartRight,
		// 		type:"POST",
		// 		dataType:"json",
		// 		data:$.extend({}, baseParams, {
		// 			selectedValue:""
		// 		})				
		// 	})
		// 	.done((data)=>{
		// 			this.setState({
		// 				unit:data.unit,
		// 				legend:data.legend,
		// 				xAxis:data.xAxis,
		// 				series:data.series
		// 			})
		// 	})
		// 	.fail((err)=>{
		// 		console.error(err);
		// 	})
	}
	render() {
		return (
				<div id="left-top-right">
						<div className="select-nav"></div>	
						<LineComponent {...{tipsUnit:this.state.tipsUnit,gridTop:"35%",interval:900,legend:this.state.legend,xAxis:this.state.xAxis,series:this.state.series,unit:this.state.unit}}/>
				</div>
			)
	}
}
export default LeftTopRight
