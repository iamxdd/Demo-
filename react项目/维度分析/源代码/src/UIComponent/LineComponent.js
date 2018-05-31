import React, { Component } from 'react';
import DOM from 'react-dom'
import echarts from 'echarts'
import $ from 'jquery'
import crtLineOpt from "../util/createChartOption_V2"
import backgroundImage from '../img/header_bg'
const commonHandle = window.commonHandle;
class LineComponent extends Component {
	constructor(props) {
			super(props);
			this.state = {
				interval:this.props.interval,
				color:this.props.color || ["#74DEED", "#FFC57A", "#A3E06A", "#379CF8"],
				unit:this.props.unit || ["",""],
				type:this.props.type || "line",
				title:this.props.title || "",
				xAxis: this.props.xAxis || [],
				legend: this.props.legend || [],
				series: this.props.series || [],
				gridTop:this.props.gridTop || "25%",
				legendTop:this.props.legendTop || "10%",
				tipsUnit:this.props.tipsUnit,
				clickHandle:this.props.clickHandle||function(){}
			}
		}
		/**
		 * 组件构建成功 (用于初始化图表)
		 * @return {[type]} [description]
		 */
	componentDidMount() {
			let line = DOM.findDOMNode(this.refs.line);
			let chart = echarts.init(line);
			window.addEventListener("resize", function(e){
				chart.resize()
			})
			chart.setOption(crtLineOpt({
				interval:this.state.interval,
				type: this.state.type,
				title: "", //type:String  标题
				legend: [], //type:Array   图例
				xAxis: [], //type:Array   X轴数据
				series: [], //type:Array   Y轴数据
				gridTop:this.state.gridTop || "25%",
				threshold: [{
					value: 0,
					text: "a"
				}, {
					value: 0,
					text: "b"
				}], //type:Array   阈值配置
				isRate: false, //type:Boolean 是否为百分比(百分比Y轴最大值始终为100)
				unit: this.state.unit, //type:String  Y轴单位
				tipsUnit:this.state.tipsUnit
			}))
	}
		/**
		 * 组件收到新的参数时调用
		 * @param  {[type]} nextProps [description]
		 */
	componentWillReceiveProps(nextProps) {
			this.state = Object.assign({},this.state,nextProps);
			console.log(this.state);
			let line = DOM.findDOMNode(this.refs.line);
			let chart = echarts.init(line);
			window.addEventListener("resize",function(e){
				chart.resize()
			})
			var opts = crtLineOpt({
				interval:this.state.interval,
				color:this.state.color,
				type: this.state.type,
				title: this.state.title, //type:String  标题
				legend: this.state.legend, //type:Array   图例
				xAxis: this.state.xAxis, //type:Array   X轴数据
				series: this.state.series, //type:Array   Y轴数据
				legendTop:this.state.legendTop,
				gridTop:this.state.gridTop || "25%",
				threshold: [{
					value: 0,
					text: "a"
				}, {
					value: 0,
					text: "b"
				}], //type:Array   阈值配置
				isRate: false, //type:Boolean 是否为百分比(百分比Y轴最大值始终为100)
				unit: this.state.unit, //type:String  Y轴单位
				tipsUnit:this.state.tipsUnit
			})
			console.log(opts);
			chart.setOption(opts,true);
			chart.on("click",(e)=>{
				console.log(e);
				var $chart = $("#left-bottom .line");
				var height = $chart.height();
				//左下图表柱图点击弹出
				if(line.parentElement.parentElement.id === "left-bottom" && e.seriesType === "bar"){
					var x = e.event.event.pageX;
					var y = e.event.event.pageY;
					if(e.event.event.layerY>(height-300) ){
						y = e.event.event.pageY - 300;
					}
					commonHandle.fire("showMask",{show:true,x:x,y:y,dimValue:e.name})
				}
				//左上左侧图表点击联动左上右侧图表
				if(line.parentElement.id === "left-top-left"){
					commonHandle.fire("selected-right",e);
				}
				// if(line.parentElement.parentElement.id === "left-bottom"){
				// 	commonHandle.fire("updateGrid",e);
				// }
			});
		}
		/**
		 * 组件即将更新
		 * @param  {[type]} prevProps [description]
		 * @param  {[type]} prevState [description]
		 */
	componentWillUpdate(prevProps, prevState) {

		}
		/**
		 * 组件更新成功
		 * @param  {[type]} prevProps [description]
		 * @param  {[type]} prevState [description]
		 */
	componentDidUpdate(prevProps, prevState) {
		
	}
	componentShouldUpdata(pre,next){
		console.log(pre,next)
	}
	render() {
		return(
				<div
					 ref = "line"
					className = "line" style={{backgroundImage:"url("+backgroundImage+")",backgroundRepeat:"no-repeat"}}> 
				</div>
		) 
	}
}
export default LineComponent;