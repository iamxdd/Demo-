import Date from "./DateExtend";
import util from "./util";
/**
 * [创建拆线图配置项]
 * @param  {[Object]} opts [{
 *                            type:"line"||"bar" // type:String 图表类型   
 *                            title:""           //type:String  标题
 *                            legend:[]          //type:Array   图例
 *                            xAxis:[]           //type:Array   X轴数据
 *                            series:[]          //type:Array   Y轴数据
 *                            threshold:[]       //type:Array   阈值配置
 *                            isRate:true        //type:Boolean 是否为百分比(百分比Y轴最大值始终为100)
 *                            unit:"%"           //type:String  Y轴单位
 * }]
 * @return {[Object]}      [拆线图配置项]
 */

 //双Y轴(主指标、副指标)
 //数据结构
 /**
unit:["次","%"]      //第一个值为主指标单位，第二个值为副指标单位
legend :[ {isMain:true,name:"1"},{isMain:false,name:"2"},{isMain:false,name:"3"}]
xAxis:[ "00:00","00:15","00:30","00:45" ]
series:[[1,2,3,4],[2,3,4,5],[3,4,5,6] ]
 */

function getMainIndex(legend,isMain){
    var indexs = [];
    var temp = legend.map(function(value,index){
             value.index = index;
             return value;
    }).filter(function(value,index){
        return value.isMain === isMain;
    });
    temp.forEach(function(value,index){
        indexs.push(value.index);
    });
    return indexs;
};

function getMainData(series,indexs){
    var result = [];
    for(var i=0;i<indexs.length;i++){
        result = result.concat(series[indexs[i]])
    };

    var min = Math.min.apply(null,result);
    var max = Math.max.apply(null,result);
    return {
        min,
        max
    };
};



const crtLineOpt_V2 = (opts) => {
    function _createSeries() {
        var series = [];
        for (var i = 0; i < opts.series.length; i++) {
            series.push({
                name: opts.legend[i].name,
                type: ( function(){
                        if( opts.type instanceof Array ){
                            return opts.type[i]
                        }else{
                            if(opts.type){
                                return opts.type
                            }else{
                                return "line"
                            }
                        }
                } )(),
                data: opts.series[i],
                yAxisIndex:opts.legend[i].isMain === true ? 0 : 1,
                barWidth: 10,
                barGap:"2%",
                barCategoryGap:"2%",
                symbol:"emptyCircle",
                barMinHeight:10,
                symbolSize:10,
                // markLine: {
                //     silent: true,
                //     data: [{
                //         yAxis: opts.threshold[0].value,
                //         name: opts.threshold[0].name || "提示",
                //         lineStyle: {
                //             normal: {
                //                 color: "#f9b149"
                //             }
                //         }
                //     }, {
                //         yAxis: opts.threshold[1].value,
                //         name: opts.threshold[0].name || "告警",
                //         lineStyle: {
                //             normal: {
                //                 color: "#f94949"
                //             }
                //         }
                //     }],
                // },
                itemStyle: {
                    normal: {
                        // color:"#42b7b0",
                        //barBorderRadius: [15, 15, 0, 0]
                    }
                }
            })
        };
        return series;
    };

    function _tipFormat(is) {
        var interval = "900";
        var r = null
        var tempIn = null;
        function createColorSymbol(color){
             var symbol = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${color}"></span>`;
             return symbol;
        }
       
        switch (interval) {
            case "900":
                tempIn = "hh:mm";
                break;
            case "3600":
                tempIn = "hh:00";
                break;
            case "86400":
                tempIn = "MM:DD";
                break;
            default:
                tempIn = "hh:mm"
        };
        if (true) {
            r = function(p) {
                var tips = p.map(function(value, index) {
                    return value.value;
                });
                var axises = p.map(function(value, index) {
                    return value.seriesName
                });
                var names = p.map(function(value, index) {
                    return value.name;
                });
                var colors = p.map(function(value,index){
                    return value.color;
                })
                if(is){
                    var result = new Date(names[0] * 1000).format(tempIn) + "</br>";
                }
                if(!is){
                    var result = names[0] + "</br>";
                }
                for (var i = 0; i < p.length; i++) {
                    // result += (createColorSymbol(colors[i]) + axises[i] + " : " + tips[i] +" "+(opts.tipsUnit?(opts.tipsUnit[i]||""):"") + "<br/>")
                    result += (createColorSymbol(colors[i]) + axises[i] + " : " + tips[i] + "<br/>")
                }
                return result;
            }
        }

        return r
    };

    var series = _createSeries();
    var option = {
        backgroundColor: "#ffffff",
        // backgroundColor: "rgba(0,0,0,0)",
        color: opts.color || ["#74DEED", "#FFC57A", "#A3E06A", "#379CF8","#52C8C4","#7FBD46","#F585EF"],
        title: {
            text: opts.title,
            top: "12%",
            left: 20,
            textStyle: {
                fontSize: 12,
                color: "#595959"
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: _tipFormat(opts.interval),
            confine:true
        },
        legend: {
            data: opts.legend,
            top: opts.legendTop ||"10%",
            right: 80,
            textStyle:{
                fontSize:12,
                color:"#36383C",
                fontWeight:400,
                fontFamily:"MicrosoftYaHei"
            },
            formatter:function(value){
                if(opts.legend.length>2){
                    return value.length > 25 ? (value.slice(0,25)+"...") : value;
                }
                return value;
            },
            tooltip:{
                show:true
            }
        },
        grid: {
            top: opts.gridTop ||"25%",
            left: '3%',
            right: '8%',
            bottom: '8%',
            containLabel: true
        },
        toolbox: {
            show: false
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                formatter: opts.interval ? function(p) {
                     return util.utc2string(p, opts.interval || "900");
                } : function(p){
                    return util.string.dealMoreChars(p,6)
                },
                textStyle: {
                    fontSize: opts._fontSize ? opts._fontSize :10,
                    fontFamily:"MicrosoftYaHei",
                    // color: "#36383C",
                    color: "#666666",
                    fontWeight:500
                },
                interval:0,
                rotate:45
            },
            boundaryGap:["2%","2%"],
            axisLine: {
                show: true,
                lineStyle: {
                    color: ['#ddd'],
                    width: 1
                }
            },
            axisTick: {
                show: true
            },
            data: opts.xAxis
        },
        yAxis: [{
            type: 'value',
            // min:  opts.type[0] === "bar" ? 0 : "auto",
            min: getMainData(opts.series,getMainIndex(opts.legend,true)).min,
            max: getMainData(opts.series,getMainIndex(opts.legend,true)).max,
            name: opts.unit[0] || "",
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: ['#ddd'],
                    width: 1
                }
            },
            splitLine: { 
                show: true, 
                lineStyle: {
                             color: '#999', 
                             type: 'dashed'
                }
            },
            axisLabel: {
                textStyle: {
                    color: "#36383C",
                    fontFamily:"MicrosoftYaHei",
                    fontSize:12,
                    fontWeight:400
                }
            }
        },{
            show:(function(){
                if(opts.unit instanceof Array && opts.unit.length>1){
                    return true;
                }else{
                    return false;
                }
            })(),
            type: 'value',
           // min: opts.type[1] === "bar" ? 0 : "auto",
            min:getMainData(opts.series,getMainIndex(opts.legend,false)).min,
            max: getMainData(opts.series,getMainIndex(opts.legend,false)).max,
            name: opts.unit[1] || "",
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: ['#ddd'],
                    width: 1
                }
            },
            splitLine: { 
                show: false, 
                lineStyle: {
                             color: '#999', 
                             type: 'dashed'
                }
            },
            axisLabel: {
                textStyle: {
                    color: "#36383C",
                    fontFamily:"MicrosoftYaHei",
                    fontSize:12,
                    fontWeight:400
                },
            }
        }],
        series: _createSeries()
    };
    return option;
};
export default crtLineOpt_V2;