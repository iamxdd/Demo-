import React,{Component} from "react"
import LineComponent from './LineComponent'
import {Modal , Spin} from 'antd'
import $ from 'jquery'
import baseParams from '../util/baseParams'
import urls from '../config/urls'
import Mask from "./Mask"
import util from '../util/util'
import {addLoadingTask,deleteLoadingTask}  from '../util/loadingTask'
const commonHandle = window.commonHandle;
class LeftBottomChart extends Component{
	constructor(props) {
		super(props);
		this.state = {
			type:this.props.type || ["bar","line"],
			unit:this.props.unit || ["",""],
			title:this.props.title || "",
			legend:this.props.legend || [],
			xAxis:this.props.xAxis|| [],
			series:this.props.series||[],
			showMask:true,
			showLoading:this.props.showLoading || false,
			clickHandle:this.props.clickHandle || function(e){console.log(e)}
		}
		this.data2opts = function (data){
			var opts = {};
			var unit = [data.data.charts.others.leftUnit,data.data.charts.others.rightUnit];
			var legend = [];
			var legendKeys = Object.keys(data.data.charts.others.legend);
			var series = [];
			for( let i=0;i< legendKeys.length;i++){
				legend.push( {
					name: data.data.charts.others.legend[legendKeys[i]],
					isMain : data.data.charts.others.leftKey ==  legendKeys[i]
				} )
				series.push( data.data.charts.series[legendKeys[i]])
			}
			var xAxis = data.data.charts.xAxis;
			opts.series = series;
			opts.unit = unit;
			opts.legend = legend;
			opts.xAxis = xAxis;
			return opts;
		}
		
	}
	componentDidMount() {

		commonHandle.on("navClick",(data)=>{
			var opts = this.data2opts(data);
			this.setState({
				type:["bar","line"],
				unit:opts.unit,
				title:data.title,
				legend:opts.legend,
				xAxis:opts.xAxis,
				series:opts.series
			})
		});
		commonHandle.on("filter4open",(data)=>{
			var opts = this.data2opts(data);
			this.setState({
				type:["bar","line"],
				unit:opts.unit,
				title:data.title,
				legend:opts.legend,
				xAxis:opts.xAxis,
				series:opts.series
			})
		});
		commonHandle.on("filter4select",(data)=>{
			var opts = this.data2opts(data);
			this.setState({
				type:["bar","line"],
				unit:opts.unit,
				title:data.title,
				legend:opts.legend,
				xAxis:opts.xAxis,
				series:opts.series
			})
		});


		
		var me = this;
		var timer = setInterval(function(){
			if( window.dimNavReady === true ){
				clearInterval(timer);
				me.setState({
					showLoading:true
				});
				let uid = util.createUID(6);
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
						subKqiId:window.moreParams.subKqiId
					})
				}).done((res)=>{
						window.nameMapping4bottom = res.nameMapping;
						deleteLoadingTask(uid);
						me.setState({
							showLoading:false
						});
						commonHandle.fire("updateGrid","");
						commonHandle.fire("navClick",{data:res,title:""});
				}).fail(function(err){
					deleteLoadingTask(uid);
					console.error(err)
				})
			}
		},1000)
		// $.ajax({
		// 	type:"POST",
		// 	url:urls.leftBottomChart,
		// 	dataType:"json",
		// 	data:$.extend({},baseParams,{
		// 		// filter:"TER",
		// 		// dimId:"brand",
		// 		// subKqiId:"UMTS_MOC_ACCESS_TIME", 
		// 		filter:window.moreParams.filter,
		// 		dimId:window.moreParams.dimId,
		// 		subKqiId:window.moreParams.subKqiId
		// 	})
		// }).done((res)=>{
		// 		commonHandle.fire("updateGrid","");
		// 		commonHandle.fire("navClick",{data:res,title:""});
		// }).fail(function(err){console.error(err)})
		
	}
	// render() {
	// 	return (
	// 		<Spin tip="loading..." spinning={this.state.showLoading}>
	// 			<div className="chart">
	//                 <LineComponent {...{color:["#379CF8","#A3E06A"],type:this.state.type,unit:this.state.unit,title:this.state.title, legend:this.state.legend,xAxis:this.state.xAxis,series:this.state.series,clickHandle:this.state.clickHandle}}/>
	//             </div>
	//         </Spin>
	// 	)
	// }
	render() {
		return (
				<div className="chart">
	                <LineComponent {...{tipsUnit:this.state.unit,legendTop:"7%",gridTop:"16%",color:["#379CF8","#A3E06A"],type:this.state.type,unit:this.state.unit,title:this.state.title, legend:this.state.legend,xAxis:this.state.xAxis,series:this.state.series,clickHandle:this.state.clickHandle}}/>
	            </div>
		)
	}		
}
export default LeftBottomChart