<template>
	<div class="mangerDialog">
		<el-dialog :title="title" :visible.sync="$store.state.mangerChartShow" size="small" :beforeClose="handleClose">
  			<!-- 左侧 -->
			<div class="leftItem">
				<ul>
					<li v-for="(item,index) in transferData" @click="transferChart(item.name, index)" :class="{'chartLabel': index == clickIndex}" v-model="clickClass">
						{{item.name}}
					</li>
				</ul>
			</div>
			<!-- 右侧 -->
			<div class="rightContent" id="lineChart">
				{{chartNotice}}
			</div>
			<!-- 底部 -->
  			<span slot="footer" class="dialog-footer">
	    		<!-- <el-button @click="handleClose">取 消</el-button> -->
	   			<!--  <el-button type="primary" @click="handleClose">确 定</el-button> -->
		 	</span>
		</el-dialog>
	</div>
</template>

<script>

import Vue from 'vue';
import echarts from 'echarts';
import moment from 'moment';

Vue.use(echarts);
// Vue.use(moment);

import url from '../../../url/urls.js';
import commonFun from '../common.js';
import chartFun from './chartOption.js';
import ajaxData from './ajaxData.js';

const ObjCopy = commonFun.ObjCopy;
const PostAjax = commonFun.PostAjax;
const RequestError = commonFun.RequestError;

const addChartOption = chartFun.lineChartOption;
const getChartData = ajaxData.getChartData;

const urls = url.taskMange;

export default {
	props:['jobId','jobName','transferData','defaultEntry','parentThis'],
	data() {
		return {
			clickIndex:0,
			title:'任务名称: ',
			transferAll:'',
			clickClass:'',
			isActive:false,
			classArray:[],
			timerId:'',
			chartNotice:'',
			intervalType: false,
			// dialogVisible: true
		};
	},
	// watch:{
	// 	"clickClass":function(newVal,oldPage){
	// 		console.log(newVal,"clickclass")
	// 	}
	// },
	created(){
		this.title = '任务名称: ' + this.jobName;
		this.clickClass = this.defaultEntry;
	},
	mounted(){

		//初始化
		this.$nextTick(() => {
			this.getTransferData();
		})
	
	},
	watch:{
		"intervalType": function(newVal, oldVal){


			let _this = this;

			if(newVal){

				_this.timerId = window.setInterval(()=>{
					this.addChartData(_this.clickClass);
				},10000);

			}else{
				_this.timerId !== undefined ? window.clearInterval(_this.timerId) : '';
			}

		}
	},
	methods: {

		intervalgetChartData(type){
			
			if(type == 'clearInterval'){

				//关掉定时刷新

				this.timerId !== undefined ? window.clearInterval(this.timerId) : '';

			}else{
				this.timerId = window.setInterval(()=>{
					this.getChartData(this.clickClass);
				},10000);
			}

		},
		getTransferData(){

			//transferData 为左侧数据

			this.initAddChartData(this.defaultEntry);

			this.intervalType = true;  //周期刷新

		},
		initAddChartData(transName){

			//let result = this.chartData;
			let result = this.$store.state.chartData;
			let series = result.series;

			series.length !== 0 ? this.addChart(transName,result) : this.chartNotice = "暂无数据...";
		},
		addChartData(transName){

			let result = this.$store.state.chartData;
			let series = result.series;

			let row = {
				name: this.jobName,
				id: this.jobId
			}

			//再次store.js刷新数据  this.handleClose 错误情况下关闭定时器
			getChartData(this,urls.mangerChart,row,transName,this.initAddChartData,this.handleClose);

			//再次刷新图表
			//this.initAddChartData(transName);


		},
		addChart(transName,data){

			this.chartNotice = '';

			let myChart = echarts.init(document.getElementById("lineChart"));
			let legend = data.legend;
			let xaxis = data.xaxis;
			let seriesOrigin = data.series
			let seriesArr = [];
			let unit = "条";

			let xAxis = xaxis.map((v,i) => {
				return moment(v*1000).format("MM-DD HH:mm:ss")
			})

			let colors = ['#0295da','#f4a91a'];

			for(var i = 0; i < seriesOrigin.length; i++){

				let seriesItem = {
		            name: seriesOrigin[i].name,
		            type: 'line',
		            symbol: 'circle',
		            symbolSize:8,
		            smooth:true,
		            showAllSymbol:true,
		            data: seriesOrigin[i].data,
		            lineStyle:{
		            	normal:{
		            		color: colors[i]
		            	}
		            },
		            areaStyle:{
		            	normal:{
		            		color: {
							    type: 'linear',
							    x: 0.5, 
							    y: 0,
							    x2: 0.5,
							    y2: 1,
							    colorStops: [{
							        offset: 0, color: colors[i] // 0% 处的颜色
							    }, {
							        offset: 1, color: '#fff' // 100% 处的颜色
							    }],
							    globalCoord: false // 缺省为 false
							},
							opacity:0.5
				         }
		            }
		        };
		        seriesArr.push(seriesItem);
			}

			//title, legend, xAxis, unit, series
			myChart.setOption(addChartOption(transName,legend,xAxis,unit,seriesArr));
			//屏幕自适应大小
			window.onresize = myChart.resize;

		},
		transferChart(val,index){

			//被点击的状态选中

			this.clickClass = val;
			this.clickIndex = index;

			this.intervalType = false;

			//切换后重新画图
			this.addChartData(val);

			this.intervalType = true;

		},
		handleClose(){


			this.intervalType = false;  //关闭周期
			this.timerId !== undefined ? window.clearInterval(this.timerId) : '';

			//关闭当前定时器，弹框
			this.$store.dispatch('mangerChartShow',false);
			//关闭父级的所有打钩
			this.parentThis.$refs.multipleTable.clearSelection();

		}
	}
 }
  </script>