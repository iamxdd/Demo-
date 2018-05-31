/**
 * @description:多维度分析复选框第一个下拉框筛选条件。
 */
import React,{Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import { Select } from 'antd';
import baseParams from '../util/baseParams'
import urls from '../config/urls'
import util from '../util/util'
import {addLoadingTask,deleteLoadingTask}  from '../util/loadingTask'
import { getCondition, getDataQuery,getSelectValue } from "../actions/action.js";
import $ from 'jquery';
const commonHandle = window.commonHandle;

class SelectCondition extends Component {
    constructor(props) {
        super(props);
        this.state={
            subKqiId:"",
            fiterValue:[],
            OptionsValue: ""
        }
    }
    handleChange(value,e) {
        //this.setState({
        //    subKqiId:value
        //});
        //this.state.subKqiId = value;
        var uid = util.createUID(6);
        addLoadingTask(uid);
        commonHandle.fire("saveSubKqiId",value);
        this.setState({
            OptionsValue: value
        });
        let { dispatch, subKqiId, andOr, fiterList, LinkUp } = this.props;
        dispatch(getCondition({
            subKqiId:value
        }));
        // dispatch(getDataQuery({
        //     subKqiId:value,
        //     filter:"NE,ARG",
        //     subKqiId:subKqiId,
        //     andOr:andOr,
        //     fiterList:fiterList,
        //     LinkUp:LinkUp
        // }));
        $.ajax({
            url: urls.leftBottomChart,
            type:"POST",
            dataType: "json",
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                "X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
            },
            data: $.extend({}, baseParams, {
                filter:window.moreParams.filter,
                dimId:window.moreParams.dimId,
            	subKqiId:value,
                andOr:andOr,
                fiterList:fiterList,
                LinkUp:LinkUp
            })
        })
        .done(function(data){
            deleteLoadingTask(uid);
            window.nameMapping4bottom = data.nameMapping;
        	commonHandle.fire("filter4select",{data:data});
            console.log("这个是最左侧下拉框请求到的信息",data);
        }.bind(this))
        .fail(function(err){
            deleteLoadingTask(uid);
            console.log("错误信息！");
        });
        commonHandle.fire("updateGrid",null);
        console.log(`selected ${value}`);
    }
    componentWillMount(){
        $.ajax({
            url: urls.initFilterData,
            type:"POST",
            dataType: "json",
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                "X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
            },
            data: baseParams
        })
        .done(function(data){
            console.log("这个是请求到的信息",data);
            window.conditionsReady = true;
            commonHandle.fire("saveSubKqiId",data.sort[0].id);
            this.setState({
                fiterValue:data.sort,
                OptionsValue:data.sort[0].id
            })
            let dispatch = this.props.dispatch;
            dispatch(getCondition(this.state.OptionsValue));
        }.bind(this))
        .fail(function(err){
            console.log("错误信息！");
        })
    }
    componentDidMount(){
        
    }

    render(){
        const Option = Select.Option;
        let me = this;
        let Options = [];
        for(let i = 0, len = me.state.fiterValue.length; i < len; i++){
            Options.push(<Option style={{ width: "1.58rem",textOverflow: "ellipsis" }} title={me.state.fiterValue[i].name} value={me.state.fiterValue[i].id}>{me.state.fiterValue[i].name}</Option>);
        }
        return(
            <div className="select_condition">
                <Select size="large" value={this.state.OptionsValue} placeholder="Select conditions" style={{ width: "1.58rem" }} onChange={me.handleChange.bind(this)}>
                    {Options}
                </Select>
            </div>
        )
    }
}

function mapStateToProps(state){
    if(state.getRejectTopData.data && state.getOpenDefinitionOption.data){
        return {
            subKqiId:state.getRejectTopData.data.subKqiId,
            LinkUp:state.getOpenDefinitionOption.data.LinkUp,
            fiterList:state.getOpenDefinitionOption.data.fiterList,
            andOr:state.getOpenDefinitionOption.data.andOr
        };
    }
    if(state.getRejectTopData.data){
        return {
            subKqiId:state.getRejectTopData.data.subKqiId,
            LinkUp:"",
            fiterList:"",
            andOr:""
        }
    };
    if(state.getOpenDefinitionOption.data){
        return {
            subKqiId: 0,
            LinkUp:state.getOpenDefinitionOption.data.LinkUp,
            fiterList:state.getOpenDefinitionOption.data.fiterList,
            andOr:state.getOpenDefinitionOption.data.andOr
        }
    };
    return{
        subKqiId: 0,
        LinkUp:"",
        fiterList:"",
        andOr:""
	}
}

export default connect(mapStateToProps)(SelectCondition);
