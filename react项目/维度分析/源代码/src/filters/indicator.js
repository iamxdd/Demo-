/**
 * @description:多维度分析过滤数据个数。
 */
import React,{Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import { Input  } from 'antd';
import { getRejectTop, getDataQuery, rejectDataQuery } from "../actions/action.js";
import params from "../util/baseParams.js";
import urls from '../config/urls'
import $ from "jquery";

class Indicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || 0,
            msg: "",
            percent: "",
            kqiName: ""
        }
    }

    inputEnter(e){ //输入框点击Enter键执行的事件
        let me = this;
        let { dispatch, subKqiId, openData } = me.props;
        let number = parseFloat(e.target.value || 0);
        // if(number > 20){
        //     me.setState({
        //         value:20,
        //         percent:"100%"
        //     });
        //     /**
        //      * 在这里把20传出去
        //      */
        //      dispatch(rejectDataQuery({
        //         startTime: params.startTime,
        //         endTime: params.endTime,
        //         timeType: params.time,
        //         kqiId: params.kqiId,
        //         rejectNum: 20,
        //         subKqiId: subKqiId,
        //         LinkUp: openData.LinkUp,
        //         fiterList: openData.fiterList,
        //         andOr: openData.andOr
        //      }));
        //      dispatch(getRejectTop({
        //          rejectNum:20
        //      }));
        // } else {
            // let percentNum = ((number / 20 * 100).toFixed(2)) + "%";
            // console.log("percentNum",percentNum);
            me.setState({
                value:number
            })
            /**
             * 在这里把number传出去
             */
            // dispatch(rejectDataQuery({ //提交过滤条件
            //     startTime: params.startTime,
            //     endTime: params.endTime,
            //     timeType: params.time,
            //     kqiId: params.kqiId,
            //     rejectNum: number,
            //     subKqiId: subKqiId,
            //     LinkUp: openData.LinkUp,
            //     fiterList: openData.fiterList,
            //     andOr: openData.andOr
            // }));
        // }

        /******************提交过滤条件****************/
            $("span.indicator_msg").hide();
            if($(".indicator_input").val() != "0"){   //为0时不发送请求
                $.ajax({
                    url: urls.rejectDataQuery,
                    type: "POST",
                    dataType: "json",
                    headers:{
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                            "X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
                    },
                    data: $.extend({}, params, {
                    	filter:window.moreParams.filter,
                        dimId:window.moreParams.dimId,
                    	rejectNum: number,
                        subKqiId: window.moreParams.subKqiId,
                        LinkUp: openData.LinkUp,
                        fiterList: openData.fiterList,
                        andOr: openData.andOr
                    })
                })
                .done(function(data){
                    $("span.indicator_msg").show();
                    me.setState({
                        percent: data.kqiValue,
                        kqiName: data.kqiName
                    })
                })
                .fail(function(data){
                    console.log("请求错误！");
                })
                dispatch(getRejectTop({ //保存剔除的top数值
                    rejectNum:number
                }));
            }
        /******************提交过滤条件****************/
            
        me.setState({
            msg:"indicator_msg_animation",
        })
    }

    handleChange(e) { //限制输入框只能输入数字的函数
        const number = parseFloat(e.target.value || 0);
        if (isNaN(number) || (number > 999999)) {
            return;
        }
        if (!('value' in this.props)) {
            this.setState({ value: number });
        }
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(number);
        }
    }

    render(){
        let me = this;
        return(
            <div className="indicator_condition">
                <div style={{"float":"left"}}>
                    <b className="indicator_title">Indicator( Excl.TOP)</b>
                     <Input
                       type="text"
                       className="indicator_input"
                       placeholder="Enter a number."
                       value={this.state.value}
                       onChange={me.handleChange.bind(this)}
                       onPressEnter={me.inputEnter.bind(this)}
                     />
                </div>
                 <label style={{"height":".28rem","width":"0","overflow":"hidden","display":"inline-block","float":"left"}}
                    className={this.state.msg}>
                    <span className="indicator_msg">({me.state.kqiName}: <span className="indicator_percent">{this.state.percent}</span>)</span>
                 </label>
            </div>
        )
    }
}

function mapStateToProps(state){
    if(state.getSelectCondition.data&&state.getOpenDefinitionOption.data){
        return {
            subKqiId: state.getSelectCondition.data.subKqiId,
            openData: state.getOpenDefinitionOption.data
        }
    };
    if(state.getSelectCondition.data){
        return {
            subKqiId:state.getSelectCondition.data.subKqiId,
            openData: {
                LinkUp:"",
                fiterList:"",
                andOr:""
            }
        }
    };
    if(state.getOpenDefinitionOption.data){
        return {
            subKqiId:"",
            openData: state.getOpenDefinitionOption.data
        }
    };
    return{
        subKqiId:"",
        openData: {
            LinkUp:"",
            fiterList:"",
            andOr:""
        }
	}
}
export default connect(mapStateToProps)(Indicator);
