<template>
 <div class="bigCon">
    <div class="conHeader"></div>
	<div class="innerLay">
	 <!-- 环形图 -->
	  <div class="commonDiv">
	  	<p>统计数据</p>
	  	 <div class="NumTotal">
	  	 	<dl>
	  	 		<dt style="color:rgba(36,187,255,.8)">{{runningNum}}</dt>
	  	 		<span>正在运行数</span>
	  	 	</dl>
	  	 	<dl>
	  	 		<dt style="color:rgba(140,195,75,.8)">{{totalSuccessNum}}</dt>
	  	 		<span>执行成功数</span>
	  	 	</dl>
	  	 	<dl>
	  	 		<dt style="color:rgba(244,168,22,.8)">{{totalFailedNum}}</dt>
	  	 		<span>执行失败数</span>
	  	 	</dl>
	  	 	<dl>
	  	 		<dt style="color:rgba(141,130,186,.8)">{{totalFinishedNum}}</dt>
	  	 		<span>执行总数</span>
	  	 	</dl>
	  	 </div>
	  	 <div id='pieEchart'></div>
	  </div>
	  <!-- 月折线图 -->
	  <div class="commonDiv">
	  	<p>{{monthtitle}}</p>
	  	  <div id="rightBot"></div>
	  </div>
	  <!-- 周折线图 -->
	  <div class="commonDiv">
	    <p>{{weektitle}}</p>
	    <div id="WeekEcharts"></div>
	  </div>
	  <!-- 天折线图 -->
	  <div class="commonDiv">
	  	<p>{{daytitle}}</p>
	  	<div id="DayEcharts"></div>
	  </div>
	</div>
 </div>
</template>

<script>
import Vue from 'vue'
import url from '../../url/urls.js'
import echarts from 'echarts'

import global from '../global/global.js'
Vue.use(echarts)
//const echarts = window.echarts;

const homeUrl=url.homeIndex
	export default {
		 data(){
              return {
              	"runningNum":'',
		        "totalFinishedNum":'',
		        "totalSuccessNum":'',
		        "totalFailedNum":'',
		        "leftTopurl":"",
		        "monthtitle":"",
		        "weektitle":"",
		        "daytitle":""
              }
	        },
	    mounted:function(){
			this.$nextTick(function(){
				this.LeftView();
				this.RightView();
			});
		},
		created(){
			  this.$store.dispatch('resetTabClickIndex',0);   //指定到第0个标签
		},
	    methods:{
	     LeftView:function(){
	     	       this.$store.dispatch('fullScreen',true);
				   this.$http.get(homeUrl.overviewdataUrl).then(res=>{
					 this.$store.dispatch('fullScreen',true);
					    // 左边上边计数部分
					let newData= res.body;
					if(newData.code===200){
						 this.$store.dispatch('fullScreen',false);
						this.runningNum=newData.data.runningNum;
					    this.totalFinishedNum=newData.data.totalFinishedNum;
					    this.totalSuccessNum=newData.data.totalSuccessNum;
					    this.totalFailedNum=newData.data.totalFailedNum;
					    //下边饼图渲染
						let pieEchart = echarts.init(document.getElementById("pieEchart"));
						let Pielengend=["执行成功","执行失败"];
						let PieseriesData=[{value:newData.data.totalSuccessNum,
							                 name:"执行成功"},
							               {value:newData.data.totalFailedNum,
							                name:"执行失败"}];
						let Pieopts=global.CharPieOption(Pielengend,PieseriesData);
	                    pieEchart.setOption(Pieopts, true);
					}else if(newData.code===201){
                          this.$store.dispatch('fullScreen',false);
						 global.RequestError(this,newData.message);
					}else{
						  this.$store.dispatch('fullScreen',false);
						  global.RequestError(this,"服务器异常，请稍后刷新");
					}
				},(response)=>{
					    this.$store.dispatch('fullScreen',false);
					    global.RequestError(this,"服务器异常，请稍后刷新");
					   // console.warn("request error");
				})
	     },
	     RightView:function(){
	     	   this.$http.get(homeUrl.blockdataUrl).then(res=>{
	     	   	    let newData= res.body;
	     	   	    if(newData.code===200){
                    let DayEchart = echarts.init(document.getElementById("DayEcharts"));
	     	   	    let WeekEcharts = echarts.init(document.getElementById("WeekEcharts"));
	     	   	    let MonthEcharts=echarts.init(document.getElementById("rightBot"));				
	     	   	      // 天折线图
	     	   	    let DayData = res.body.data.hour;
		            let Dayopts=global.ChartOption(DayData.title,DayData.legend,DayData.xAxis,global.createSeries(DayData.series));
		            this.daytitle=DayData.title;
		                 DayEchart.setOption(Dayopts, true);
	                // 周折线图
	                let WeekData = res.body.data.week;
	                let Weekopts=global.ChartOption(WeekData.title,WeekData.legend,WeekData.xAxis,global.createSeries(WeekData.series));
	                this.weektitle=WeekData.title;
	                 WeekEcharts.setOption(Weekopts, true);

	                // 月折线图
	                let MonthData = res.body.data.month;
	                let Monthopts=global.ChartOption(MonthData.title,MonthData.legend,MonthData.xAxis,global.createSeries(MonthData.series));
	                 this.monthtitle=MonthData.title;
	                 MonthEcharts.setOption(Monthopts, true);    
	     	   	    } else{
						 this.$store.dispatch('fullScreen',false);
					}
				},(response)=>{
					    this.$store.dispatch('fullScreen',false);
				})
	     }
	  }
}


</script>