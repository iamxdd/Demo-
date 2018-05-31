import React,{Component} from "react"
import { Spin } from 'antd';
import NavSelect from './NavSelect'
import $ from "jquery"
import baseParams from '../util/baseParams'
import util from '../util/util'
import LineComponent from './LineComponent'
import urls from '../config/urls'
import {addLoadingTask,deleteLoadingTask} from '../util/loadingTask'
const commonHandle = window.commonHandle;
class LeftTopLeft extends Component{
	constructor(props) {
		super(props);
		this.state = {
			optionsLeft:this.props.options || [],
			optionsRight:this.props.options || [],
			currentSelectLeft:this.props.currentSelectLeft || "",
			currentSelectRight:this.props.currentSelectRight || "",
			unit:this.props.unit || ["",""],
			legend:this.props.legend || [],
			xAxis:this.props.xAxis|| [],
			series:this.props.series||[],
			leftKqis:this.props.leftKqis || "",
			leftKqis:this.props.rightKqis || "",
			leftUnit:"",
			leftTipsUnit:[],
			rightUnit:"",
			rightTipsUnit:[]
		};
		// commonHandle.on("before-selected-left",()=>{
		// 	this.setState({
		// 		showLoading:true
		// 	})
		// });
	}
	componentDidMount(){


		commonHandle.on("selected-left",(data)=>{
			this.setState({
				unit:data.unit,
				legend:data.legend,
				xAxis:data.xAxis,
				series:data.series,
				leftTipsUnit: data.unit
			})
		});
		commonHandle.on("cacheLeftKQIs",(data)=>{
			// this.setState({
			// 	leftKqis:data
			// })
			this.state.leftKqis = data;
		});
		commonHandle.on("cacheLeftKQIs",(data)=>{
			// this.setState({
			// 	rightKqis:data
			// })
			this.state.rightKqis = data;
		});
		commonHandle.on("limitLeftOptions",(unit)=>{
			// this.setState({
			// 	leftUnit:unit
			// })
			this.state.leftUnit = unit;
		});
		commonHandle.on("limitRightOptions",(unit)=>{
			// this.setState({
			// 	rightUnit:unit
			// })
			this.state.rightUnit = unit;
		});

		
		var me = this;
		me.setState({
			showLoading:true
		});
		var loadStateUID= util.createUID(6);
		addLoadingTask(loadStateUID);
		$.ajax({
  			url:urls.leftTopSelect,
  			type:"POST",
  			dataType:"json",
  			headers:{
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
						"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
			},
  			data:$.extend({}, baseParams ,{})
  		})
  		.done(function(res){
  			deleteLoadingTask(loadStateUID)
  			var optsLeft = [];
  			var optsRight = [];
  			res.main.map(function(v,i){
  				optsLeft.push({value:v.id,text:v.name,unit:v.unit,disabled:false})
  			});
  			res.second.map(function(v,i){
  				optsRight.push({value:v.id,text:v.name,unit:v.unit,disabled:false})
  			});
  			me.setState({
  				optionsLeft:optsLeft,
  				currentSelectLeft:optsLeft[0] ? optsLeft[0].value : "",
  				optionsRight:optsRight,
  				currentSelectRight:optsRight[0] ? optsRight[0].value : ""
  			});
  		})
  		.fail(function(err){
  			deleteLoadingTask(loadStateUID)
  			console.error(err)
  		})

  		//判断是否为成功率  成功率需要模拟下拉点击事件造成发送了两次请求 因此成功率不需要初始化发送请求
  // 		if( window.isRatePage === "true" ){
	 //  		$.ajax({
		// 		type:"POST",
		// 		url:urls.leftTopChartLeft,
		// 		dataType:"json",
		// 		headers:{
		// 				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		// 				"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
		// 		},
		// 		data:$.extend({}, baseParams,{leftKqis:commonHandle.leftKqis,rightKqis:commonHandle.rightKqis})			
		// 	}).done((res)=>{
		// 		window.nameMapping = res.nameMapping;
		// 		commonHandle.fire("selected-right",{seriesName:Object.keys(res.nameMapping)[0]})
		// 		if(me.props.label === "Left xAxis"){
		// 			commonHandle.fire("selected-left",res);
		// 		}
		// 		if(me.props.label === "Right xAxis"){
		// 			commonHandle.fire("selected-left",res);
		// 		}
		// 	}).fail(function(err){console.error(err)})
		// }



		$.ajax({
			type:"POST",
			url:urls.leftTopChartLeft,
			dataType:"json",
			headers:{
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
						"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
			},
			data:$.extend({}, baseParams,{leftKqis:commonHandle.leftKqis,rightKqis:commonHandle.rightKqis,fiterList:window.filterOptions.filterList})			
		}).done((res)=>{
			deleteLoadingTask(loadStateUID);
			window.nameMapping = res.nameMapping;
			commonHandle.fire("selected-right",{seriesName:Object.keys(res.nameMapping)[0]})
			//if(me.props.label === "Left xAxis"){
				commonHandle.fire("selected-left",res);
			//}
			//if(me.props.label === "Right xAxis"){
				commonHandle.fire("selected-left",res);
			//}
		}).fail(function(err){
			deleteLoadingTask(loadStateUID);
			console.error(err)
		})

	}
	render() {
		return (
					<div id="left-top-left" className={ window.isRatePage == "false" ? "show" : ""}>
						
						<LineComponent {...{tipsUnit:this.state.leftTipsUnit,interval:"900",unit:this.state.unit,legend:this.state.legend,xAxis:this.state.xAxis,series:this.state.series}}/>
				    </div>
				)
	}
}
export default LeftTopLeft