/**
 * @description:多维度分析复选框弹出的复选框。
 */
import React,{Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import { Form, Input, Icon, Button, Popover, Select } from 'antd';
import { getOpenOption, getDataQuery } from "../actions/action.js";
import $ from "jquery";
import { gt, lt, ge, le, yu, yd, mu, md } from "./symbol.js";
import params from "../util/baseParams.js";
import urls from "../config/urls"
import util from '../util/util'
import {addLoadingTask,deleteLoadingTask}  from '../util/loadingTask'

const commonHandle = window.commonHandle;
const FormItem = Form.Item;
const Option = Select.Option;
const arr = ["YU","YD","MU","MD"]; //定义一个包括同比、环比的value值的数组。
let uuid = 0;

class OpenDefinition extends Component {
    constructor(props) {
        super(props);
        this.linkUp = "";
        this.fiterList = "";
        this.state={
            inputNum:1,
            value: this.props.value || 0,
            add:"add-select",
            delete: "delete-button",
            andOr:"and",
            isDisabled0: false,
            isDisabled1: false,
            isDisabled2: false,
            openFiterValue:[],
            OptionsDefaultValue:""
        }
    }
    componentWillMount() {
        console.log(this);
        let me = this;
        me.props.form.setFieldsValue({
            keys: [0],
        });
        commonHandle.on("emptyFilter",()=>{
            me.props.form.setFieldsValue({
                keys: [0],
                server0: undefined,
                icon0: "GT",
                num0: '',
                server1: undefined,
                icon1: "GT",
                num1: '',
                server2: undefined,
                icon1: "GT",
                num2: '',
            });
            window.filterOptions = {
                andOr:"",
                filterList:"",
                LinkUp:""
            };
            me.setState({
                add:"add-select"
            });
        });
        $.ajax({
            url: urls.initFilterData,
            type:"POST",
            dataType: "json",
            headers:{
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        "X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
            },
            data: params
        })
        .done(function(data){
            window.conditionsReady = true;
            // window.moreParams.dimId = data.operator[0].id;
            console.log("这个是气泡卡片请求到的信息",data);
            me.setState({
                openFiterValue:data.operator,
                OptionsDefaultValue:data.operator[0]
            })
        })
        .fail(function(err){
            console.log("气泡卡片错误信息！");
        })
    }
    componentDidMount() { //初始状态下隐藏第一个删除按钮
        $(".delete-button").eq(0).hide();
    }


    remove(k){
        let me = this;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        let f=this.props.form.getFieldsValue();
        if(me.isInArray(arr, f.icon2)){
            me.setState({
                isDisabled0: false,
                isDisabled1: false
            });
        }else if(me.isInArray(arr, f.icon1)){
            me.setState({
                isDisabled0: false,
            });
        }
        if (keys.length >= 2) {
            $(".delete-button").eq(0).hide();
            $(".delete-button").eq(1).show();
        }
        if(keys.length === 2){
            keys.pop();
        }

        if (keys.length === 1) {
            $(".delete-button").eq(0).show();
        }
        

        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
        this.setState({
            add:"add-select"
        })
      }

    add(){
        uuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        if(nextKeys.length >= 2){
            $(".delete-button").eq(0).hide();
            $(".delete-button").eq(1).show();
        }
        if(nextKeys.length >= 3){
            this.setState({
                add:"",
            })
            $(".delete-button").eq(0).hide();
            $(".delete-button").eq(1).hide();
            $(".delete-button").eq(2).show();
        }
        console.log("uuid",nextKeys);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }


    serverChange(value) {   //选择指标名称的复选框的事件
        console.log(`selected ${value}`);
    }
    iconChange(value,option) {  //选择比较符号的复选框的事件
        let f=this.props.form.getFieldsValue();
        let me = this;
        let index = option.props.icon_index;
        console.log("&&",index);
        console.log(option.props);
        console.log(`selected ${value}`);
        switch(index) {   //用来做下拉选择框互斥
            case 0:
                if(me.isInArray(arr, value)){
                    me.setState({
                        isDisabled1: true,
                        isDisabled2: true
                    });
                }else{
                    if(me.isInArray(arr, f.icon1)){
                        me.setState({
                            isDisabled1: false,
                            isDisabled2: true
                        })
                    } else if(me.isInArray(arr, f.icon2)){
                        me.setState({
                            isDisabled1: true,
                            isDisabled2: false
                        })
                    } else {
                        me.setState({
                            isDisabled1: false,
                            isDisabled2: false,
                        });
                    }
                }
            break;
            case 1:
                if(me.isInArray(arr, value)){
                    me.setState({
                        isDisabled0: true,
                        isDisabled2: true
                    });
                }else{
                    if(me.isInArray(arr, f.icon0)){
                        me.setState({
                            isDisabled0: false,
                            isDisabled2: true
                        })
                    } else if(me.isInArray(arr, f.icon2)){
                        me.setState({
                            isDisabled0: true,
                            isDisabled2: false
                        })
                    } else {
                        me.setState({
                            isDisabled0: false,
                            isDisabled2: false
                        });
                    }
                }
            break;
            case 2:
                if(me.isInArray(arr, value)){
                    me.setState({
                        isDisabled0: true,
                        isDisabled1: true
                    });
                }else{
                    if(me.isInArray(arr, f.icon0)){
                        me.setState({
                            isDisabled0: false,
                            isDisabled1: true
                        })
                    } else if(me.isInArray(arr, f.icon1)){
                        me.setState({
                            isDisabled0: true,
                            isDisabled1: false
                        })
                    } else {
                        me.setState({
                            isDisabled0: false,
                            isDisabled1: false
                        });
                    }
                }
            break;
        }
    }

    andOrChange(value) {
        console.log(`selected ${value}`);
        this.setState({
            andOr:value
        })
    }
    clickCancel() { //点击Cancel后关闭气泡卡片
        this.props.hide();
        $("#left-bottom canvas").show();
        $("#left-bottom canvas").siblings("img").remove();
    }

    isInArray(arr, val){ //测试是不是在数组中的方法
        let testStr=","+arr.join(",")+",";
        return testStr.indexOf(","+val+",")!=-1;
    }

   haveNAN(str) { //判断上传的linkUp,fiterList是不是有NAN
		let isNaN = str.indexOf("NaN");
        let isUndefined = str.indexOf("undefined");
		if (isNaN != -1 || isUndefined != -1) {
			str = "";
		}
		return str;
	}

	clickOk() { //点击OK后的回调函数
		let me = this;
		let {
			dispatch,
			subKqiId,
			rejectNum
		} = this.props;
		let f = this.props.form.getFieldsValue();
		let fiterList1, fiterList2, fiterList3 = "";
		console.log("从卡片的表单中获取到的值：", f);
       // dispatch(saveOpenForm(f));
		/**
		 * 对输入框中的值进行判断，来选择需要传递出去的值
		 */
		if (f.icon0 && f.icon1 && f.icon2) { //当三条输入框的值都存在的时候
			if (me.isInArray(arr, f.icon0)) {
				me.linkUp = f.server0 + "," + f.icon0 + "," + parseFloat(f.num0);
				fiterList1 = f.server1 + "," + f.icon1 + "," + parseFloat(f.num1) + ";";
				fiterList2 = f.server2 + "," + f.icon2 + "," + parseFloat(f.num2);
				me.linkUp = me.haveNAN(me.linkUp);
				fiterList1 = me.haveNAN(fiterList1);
				fiterList2 = me.haveNAN(fiterList2);
				me.fiterList = fiterList1 + fiterList2;
			} else if (me.isInArray(arr, f.icon1)) {
				me.linkUp = f.server1 + "," + f.icon1 + "," + parseFloat(f.num1);
				fiterList1 = f.server0 + "," + f.icon0 + "," + parseFloat(f.num0) + ";";
				fiterList2 = f.server2 + "," + f.icon2 + "," + parseFloat(f.num2);
				me.linkUp = me.haveNAN(me.linkUp);
				fiterList1 = me.haveNAN(fiterList1);
				fiterList2 = me.haveNAN(fiterList2);
				me.fiterList = fiterList1 + fiterList2;
			} else if (me.isInArray(arr, f.icon2)) {
				me.linkUp = f.server2 + "," + f.icon2 + "," + parseFloat(f.num2);
				fiterList1 = f.server0 + "," + f.icon0 + "," + parseFloat(f.num0) + ";";
				fiterList2 = f.server1 + "," + f.icon1 + "," + parseFloat(f.num1);
				me.linkUp = me.haveNAN(me.linkUp);
				fiterList1 = me.haveNAN(fiterList1);
				fiterList2 = me.haveNAN(fiterList2);
				me.fiterList = fiterList1 + fiterList2;
			} else {
				me.linkUp = "";
				fiterList1 = f.server0 + "," + f.icon0 + "," + parseFloat(f.num0) + ";";
				fiterList2 = f.server1 + "," + f.icon1 + "," + parseFloat(f.num1) + ";";
				fiterList3 = f.server2 + "," + f.icon2 + "," + parseFloat(f.num2);
				fiterList1 = me.haveNAN(fiterList1);
				fiterList2 = me.haveNAN(fiterList2);
				fiterList3 = me.haveNAN(fiterList3);
				me.fiterList = fiterList1 + fiterList2 + fiterList3;
			}
		} else if (f.icon0 && f.icon1) { //如果有两条框
			if (me.isInArray(arr, f.icon0)) {
				me.linkUp = f.server0 + "," + f.icon0 + "," + parseFloat(f.num0);
				me.fiterList = f.server1 + "," + f.icon1 + "," + parseFloat(f.num1);
				me.linkUp = me.haveNAN(me.linkUp);
				me.fiterList = me.haveNAN(me.fiterList);
			} else if (me.isInArray(arr, f.icon1)) {
				me.linkUp = f.server1 + "," + f.icon1 + "," + parseFloat(f.num1);
				me.fiterList = f.server0 + "," + f.icon0 + "," + parseFloat(f.num0);
				me.linkUp = me.haveNAN(me.linkUp);
				me.fiterList = me.haveNAN(me.fiterList);
			} else {
				me.linkUp = "",
					fiterList1 = f.server0 + "," + f.icon0 + "," + parseFloat(f.num0) + ";";
				fiterList2 = f.server1 + "," + f.icon1 + "," + parseFloat(f.num1);
				fiterList1 = me.haveNAN(fiterList1);
				fiterList2 = me.haveNAN(fiterList2);
				me.fiterList = fiterList1 + fiterList2;
			}
		} else if (f.icon0) { //如果只有一条选择框
			if (me.isInArray(arr, f.icon0)) {
				me.linkUp = f.server0 + "," + f.icon0 + "," + parseFloat(f.num0);
				me.linkUp = me.haveNAN(me.linkUp);
				me.fiterList = "";
			} else {
				me.linkUp = "";
				me.fiterList = f.server0 + "," + f.icon0 + "," + parseFloat(f.num0);
				me.fiterList = me.haveNAN(me.fiterList);
			}
		}
        dispatch(getOpenOption({ //保存气泡卡片的过滤条件
            andOr: me.state.andOr,
            fiterList: me.fiterList,
            LinkUp: me.linkUp
        }));
        window.filterOptions.andOr = me.state.andOr;
        window.filterOptions.filterList = me.fiterList;
        window.filterOptions.LinkUp = me.linkUp;

        // dispatch(getDataQuery({ //点击OK按钮提交过滤条件
        // startTime: params.startTime,
        // endTime: params.endTime,
        // timeType: params.time,
        // subKqiId: subKqiId,
        // rejectNum: rejectNum,
        // andOr: me.state.andOr,
        // fiterList: me.fiterList,
        // LinkUp: me.linkUp
        // }))
        var uid = util.createUID(6);
        addLoadingTask(uid);

        $.ajax({
                url:urls.leftBottomChart,
                type: "POST",
                dataType: "json",
                headers:{
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        "X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
                },
                data: $.extend({},params,{
                    filter:window.moreParams.filter,
                    dimId:window.moreParams.dimId,
                    subKqiId: window.moreParams.subKqiId,
                    rejectNum: rejectNum,
                    andOr: me.state.andOr,
                    fiterList: me.fiterList,
                    LinkUp: me.linkUp
                })
            })
            .done(function(data) {
                deleteLoadingTask(uid);
                window.nameMapping4bottom = data.nameMapping;
                commonHandle.fire("filter4open",{data:data})
                console.log("这个是弹出气泡请求到的信息", data);
            }.bind(this))
            .fail(function(err) {
                deleteLoadingTask(uid);
                console.log("错误信息！");
            });
        commonHandle.fire("updateGrid",null) 
        me.props.hide(); //关闭气泡卡片
        $("#left-bottom canvas").show();
        $("#left-bottom canvas").siblings("img").remove();
    }


    handleChange(e) { //限制输入框只能输入数字的函数
        e.target.value = e.target.value.replace(/[^\d\.]/g, "");
        // if (len && e.target.value.length > len) {
        //     e.target.value = e.target.value.slice(0, len);
        // }
        if (e.target.value.split('.').length - 1 > 1) { //e.target.value.split('.').length-1>1表示'.'符号出现的次数
            e.target.value = e.target.value.slice(0, '.'.indexOf(e.target.value)) + e.target.value.slice('.'.indexOf(e.target.value), -1).replace(/\./);
        }
    }
    data2opts (data){
			var opts = {};
			var unit = [data.data.charts.others.leftUnit,data.data.charts.others.rightUnit];
			var legend = [];
			var legendKeys = Object.keys(data.data.charts.others.legend);
			var series = [];
			for( let i=0;i< legendKeys.length;i++){
				legend.push( {
					name: legendKeys[i],
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

    render(){
        let me = this;
        const { getFieldDecorator, getFieldValue, getFieldProps } = me.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: { span: 20, offset: 4 },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        console.log("keys",keys);
        if(keys.length <= 1){
             var andOr = <div> </div>
        }else{
            var andOr = <div>
                    <Select size="small"
                        className="andOr"
                        key="andOr"
                        defaultValue="and"
                        style={{ width:".7rem" }}
                        onSelect={this.andOrChange.bind(this)}
                    >
                        <Option style={{ width:".69rem" }} key="and" value="and">and</Option>
                        <Option style={{ width:".69rem" }} key="or" value="or">or</Option>
                    </Select>
            </div>
        }
        let Options = [];
        for(let i = 0, len = me.state.openFiterValue.length; i < len; i++){
            Options.push(<Option style={{ width: "1.4rem",textOverflow: "ellipsis" }} title={me.state.openFiterValue[i].name} key={i} value={me.state.openFiterValue[i].id}>{me.state.openFiterValue[i].name}</Option>);
        }
        const formItems = keys.map((k, index) => {
          return (
              <div key={index}>
                <FormItem
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? '' : ''}
                        required={false}
                        key={k}
                        className="open_form"
                    >
                    <div className="delete_btn">
                        <Icon
                            className={this.state.delete}
                            type="close"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        />
                    </div>
                    {getFieldDecorator('server'+index, {
                        initialValue: undefined,
                        trigger:"onChange"
                    })(
                        <Select size="small"
                            className="open_server"
                            placeholder = "Name of index"
                            key="server"
                            style={{ width: "1.4rem",marginLeft:"0.15rem" }}
                            onSelect={this.serverChange.bind(this)}>
                                {Options}
                        </Select>
                    )}
                    {getFieldDecorator('icon'+index, {
                        initialValue:"GT",
                        trigger:"onChange"
                    })(
                        <Select size="small"
                            className="open_icon"
                            placeholder = "Contrast"
                            key="icon"
                            style={{ width: "1rem",marginLeft:".15rem" }}
                            onSelect={this.iconChange.bind(this)}
                        >
                                <Option icon_index={index} style={{ width: ".99rem"}} className="option_icon" value="GT">
                                    <img className="compare" src={gt}/>
                                </Option>
                                <Option icon_index={index} style={{ width: ".99rem"}} className="option_icon" value='LT'>
                                    <img className="compare" src={lt}/>
                                </Option>
                                <Option icon_index={index} style={{ width: ".99rem"}} className="option_icon" value="GE">
                                    <img className="compare" src={ge}/>
                                </Option>
                                <Option icon_index={index} style={{ width: ".99rem"}} className="option_icon" value="LE">
                                    <img className="compare" src={le}/>
                                </Option>
                               
                                <Option title="Great than week ago" icon_index={index} disabled={this.state["isDisabled"+index]} style={{ width: ".99rem",textOverflow:"ellipsis"}} className="option_icon" value="YU">
                                    Great than week ago
                                </Option>
                                <Option title="Less than week ago" icon_index={index} disabled={this.state["isDisabled"+index]} style={{ width: ".99rem",textOverflow:"ellipsis"}} className="option_icon" value="YD">
                                    Less than week ago
                                </Option>
                                <Option title="Great than last time" icon_index={index} disabled={this.state["isDisabled"+index]} style={{ width: ".99rem",textOverflow:"ellipsis"}} className="option_icon" value="MU">
                                    Great than last time
                                </Option>
                                <Option title="Less than last time" icon_index={index} disabled={this.state["isDisabled"+index]} style={{ width: ".99rem",textOverflow:"ellipsis"}} className="option_icon" value="MD">
                                    Less than last time
                                </Option>
                        </Select>
                    )}
                    {getFieldDecorator('num'+index, {
                        trigger:"onChange",
                        initialValue:""
                    })(
                        <Input
                            className="open_num"
                            style={{ width: "1.3rem",marginLeft:".1rem"}}
                            placeholder="Enter a number."
                            onChange={me.handleChange.bind(this)}
                        />
                    )}
                </FormItem>
                {andOr}
            </div>
            );
        });
        

        return(
            <div className="open_definition_form">
                <Form horizontal>
                {formItems}
                    <FormItem {...formItemLayoutWithOutLabel}>
                        <div type="dashed" className={this.state.add} onClick={me.add.bind(this)}></div>
                    </FormItem>
                    <div className="prpover_btn">
                        <Button key="OK" type="primary" onClick={this.clickOk.bind(this)}>OK</Button>
                        <Button key="Cancel" onClick={this.clickCancel.bind(this)}>Cancel</Button>
                    </div>
                </Form>
            </div>
        )
    }
}
const OpenDefinitionForm = Form.create()(OpenDefinition);

function mapStateToProps(state){
    if(state.getSelectCondition.data && state.getRejectTopData.data){
        return {
            subKqiId:state.getSelectCondition.data.subKqiId,
            rejectNum:state.getRejectTopData.data.rejectNum
        }
    };
    if(state.getSelectCondition.data){
        return {
            subKqiId:state.getSelectCondition.data.subKqiId,
            rejectNum: 0
        }
    };
    if(state.getRejectTopData.data){
        return {
            subKqiId:"",
            rejectNum: state.getRejectTopData.data.rejectNum
        }
    };
    return {
        subKqiId:"",
        rejectNum: 0
    }
}

export default connect(mapStateToProps)(OpenDefinitionForm);
