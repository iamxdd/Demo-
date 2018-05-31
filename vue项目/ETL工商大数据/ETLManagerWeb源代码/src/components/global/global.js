
/**
 * 饼图公共配置项
 * @params text type:String 标题
 * @params legend type:Array  图例
 * @params serieData type:Array  series数据
 * @params option 图表配置项
**/
 function CharPieOption(legend,series){
 var option={
	 	tooltip: {
	        // trigger: 'item',
	        formatter: "{b}: {c} ({d}%)"
        },
	 	// legend:{
	 	// 	data:legend,
	 	// 	top:'10%'
	  //  },
	 	color:["rgb(139,195,74)","rgb(245,168,22)"],
	 	series:[{
	 		    name:'',
		 		type:'pie',
	            radius : ['50%','70%'],
                // center: ['50%', '60%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: true,
	                    formatter: "{d}% \n {b}",
	                },
	            },
	             labelLine: {
	                normal: {
	                    show: true,
	                }
	            },
	            data:series
	 	}]

 };
 return option;
}

/**
 * 图表series设置
 * @params legend type:Array 图例
 * @params series type:Array  series数据
 * @params seriesData 图表配置项
**/
 function createSeries(series){
	var seriesData = [];
	let colors = ['rgba(139,195,74,.5)','rgba(245,168,22,.5)'];
	series.map(function(v,i){
		 	var singleSeries = {
			name: v["name"],
			type: "line",
			symbol: 'circle',
			symbolSize: 8,
			smooth:true,
			areaStyle:{
			   normal: {},
       //        normal:{
		     //        		color: {
							//     type: 'linear',
							//     x: 0.5, 
							//     y: 0,
							//     x2: 0.5,
							//     y2: 1,
							//     colorStops: [{
							//         offset: 0, color: colors[i] // 0% 处的颜色
							//     }, {
							//         offset: 1, color: '#fff' // 100% 处的颜色
							//     }],
							//     globalCoord: false // 缺省为 false
							// },
							// opacity:0.5
				   //       }
			},
			data: v["data"]
		 };	
		
	
		seriesData.push(singleSeries)
	})
	return seriesData;
}; 

/**
 * 图表公共配置项
 * @params legenData type:Array 图例
 * @params timeData type:Array  横坐标
 * @params serieData type:Array  series数据
 * @params option 图表配置项
**/
 function ChartOption(title,legenData,timeData,serieData){
	var option={
		// title:{
		// 	text: title,	
		// 	left:'2%',
		// 	top:'2%',
		// 	textStyle:{
		// 		fontSize:14,
		// 		fontWeight:'lighter',
		// 		color:'#2f4554'

		// 	}
		// },
		tooltip:{
			trigger:'axis',
			backgroundColor:'rgba(0,0,0,0.6)',
			axisPointer:{
				lineStyle:{
					color:'#909090',
					width:1
				}
			},
			textStyle:{
				fontSize:14
			}
		},
		legend:{
			data:legenData,
			textStyle:{color:'#000',fontFamily:'Microsoft Yahei',fontSize:14},
			top:'2%',
			left:'35%',
			x:'10%',
			y:'top',
			itemWidth: 19,
			itemHeight: 8,
			itemGap:20
		},
		color:['rgba(139,195,74,.5)','rgba(245,168,22,.5)'],
		calculable:false,
		backgroundColor:false,
		xAxis : [
			{
				type : 'category',
				position: 'bottom',
				boundaryGap:false,
				axisLine : {    // 轴线
					show: true,
					lineStyle: {
						color: '#e5e5e5',
						type: 'solid',
						width: 1
					}

				},
				axisTick : {    // 轴标记
					show:false,
					// length: 0.05*REM,
					lineStyle: {
						// color: '#909090',
						type: 'solid',
						width: 1
					}
				},
				axisLabel : {
					show:true,
					interval: 'auto',    // {number}
					// margin:0.1*REM,
					textStyle: {
						color: '#000',
						fontFamily: 'Arial',
						fontSize:10
					},
					interval:0,
					rotate:45
				},
				splitLine : {
					show:false
				},
				data : timeData
			}
		],
		yAxis : [
			{
				type : 'value',
				position: 'left',
				axisLine : {    // 轴线
					show: false
				},
				axisTick : {    // 轴标记
					show:false
				},
				axisLabel: {
                     formatter:'{value}',
                     textStyle: {
						color: '#000',
						fontFamily: 'Arial',
						// fontSize: 0.12*REM,
						fontStyle: 'normal',
						//fontWeight: 'bold'
					 }
	               },
				splitLine : {
					show:true,
					lineStyle: {
						color: '#909090',
						type: 'solid',
						width: 0.2
					}
				},
				splitArea : {
					show: false,
				}
			}
		],
		series:serieData
	};
	 return option;
}
/**
 * 错误的提示框
 * @param {[type]}   _this    [description]
 * @param {[type]}   message  [description]
 * @param {Function} callback [description]
 */
function RequestError(_this,message,callback){
	_this.$confirm(message,'提示',{
        confirmButonText:'确认',
        showCancelButton:false,
        type:'error',
    }).then( ()=> {
    	if(callback !== undefined){
    		callback();
    	}
    }).catch( () =>{
    	if(callback !== undefined){
    		callback();
    	}
    });
}

  //统计字符串中含有“.”的个数
function   getPlaceholderCount(strSource){
    	var count=0;
    	strSource.replace(/[.]/g,function(m,i){
    		count++;
    	});
    	    return count;
    }
export default{
	CharPieOption,
	createSeries,
	ChartOption,
	getPlaceholderCount,
	RequestError
}
	
