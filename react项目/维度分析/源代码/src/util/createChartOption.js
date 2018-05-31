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
const crtLineOpt = (opts) => {    
    function _createSeries() {
        var series = [];
        for (var i = 0; i < opts.series.length; i++) {
            series.push({
                name: opts.legend[i],
                type: opts.type || "line", 
                data: opts.series[i],
                yAxisIndex:1,
                barWidth: 30,
                markLine: {
                    silent: true,
                    data: [{
                        yAxis: opts.threshold[0].value,
                        name: opts.threshold[0].name || "提示",
                        lineStyle: {
                            normal: {
                                color: "#f9b149"
                            }
                        }
                    }, {
                        yAxis: opts.threshold[1].value,
                        name: opts.threshold[0].name || "告警",
                        lineStyle: {
                            normal: {
                                color: "#f94949"
                            }
                        }
                    }],
                },
                itemStyle: {
                    normal: {
                        // color:"#42b7b0",
                        barBorderRadius: [15, 15, 0, 0]
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
        if (is) {
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
                var result = new Date(names[0] * 1000).format(tempIn) + "</br>";
                for (var i = 0; i < p.length; i++) {
                    result += (axises[i] + " : " + tips[i] + "<br/>")
                }
                return result;
            }
        }
        return r
    };

    var series = _createSeries();
    var option = {
        backgroundColor: "#ffffff",
        color: opts.color || ["#f9b149", "#1cb09a", "#60c2dd", "#10c233"],
        title: {
            text: opts.title,
            top: 20,
            left: 20,
            textStyle: {
                fontSize: 14,
                color: "#595959"
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: _tipFormat(opts.interval)
        },
        legend: {
            data: opts.legend,
            top: 50,
            right: 80
        },
        grid: {
            top: "25%",
            left: '3%',
            right: '8%',
            bottom: '13%',
            containLabel: true
        },
        toolbox: {
            show: false
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            axisLabel: {
                // formatter: function(p) {
                //     return util.utc2string(p, opts.interval || "min");
                // },
                textStyle: {
                    fontSize: opts._fontSize ? opts._fontSize : 12,
                    color: "#777777"
                },
                rotate:45
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: ['#ddd'],
                    width: 1
                }
            },
            axisTick: {
                show: false
            },
            data: opts.xAxis
        },
        yAxis: [{
            type: 'value',
            min: opts.type === "bar" ? 0 : "auto",
            max: "auto",
            name: opts.unit || "%",
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: ['#ddd'],
                    width: 1
                }
            },
            axisLabel: {
                textStyle: {
                    color: "#777777"
                },
            }
        },{
            type: 'value',
            min: opts.type === "bar" ? 0 : "auto",
            max: "auto",
            name: opts.unit || "%",
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: ['#ddd'],
                    width: 1
                }
            },
            axisLabel: {
                textStyle: {
                    color: "#777777"
                },
            }
        }],
        series: _createSeries()
    };
    return option;
};
export default crtLineOpt;