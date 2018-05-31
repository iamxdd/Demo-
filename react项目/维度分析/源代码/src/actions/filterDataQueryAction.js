/**
 * 多维度分析数据过滤action。
 */

import Apis from "../utils/api";
import $ from "jquery";
import { callApi } from '../utils/utils.js';
import {
    DATA_QUERY,
    DATA_QUERY_SUCCESS,
    DATA_QUERY_FAILURE,
    OPEN_ONCLICK_OK,
    GET_CONDITION,
    GET_REJECT_TOP
} from "./action";

function DataQueryRequest(type) {
    return{
        type:type
    }
}

function DataQueryRequestSuccess(type){
    return function(data){
        return{
            type:type,
            data:data
        }
    }
}
function DataQueryRequestFailure(type){
    return function(data){
        return{
            type:type
        }
    }
}

/***
 * @func:点击OK后提交过滤条件的函数;
 */
export function getDataQuery(parm){
    console.log("点击OK后提交过滤",parm);
    let url=Apis.GET_DATA_QUERY_URL;
    return callApi(
        url,
        parm,
        DataQueryRequest(DATA_QUERY),
        DataQueryRequestSuccess(DATA_QUERY_SUCCESS),
        DataQueryRequestFailure(DATA_QUERY_FAILURE)
    );
    // $.ajax({
    //     url: url,
    //     type:"POST",
    //     dataType: "json",
    //     data: parm
    // })
    // .done(function(data){
    //     return DataQueryRequestSuccess(DATA_QUERY_SUCCESS)
    // })
    // .fail(function(err){
    //     return DataQueryRequestFailure(DATA_QUERY_FAILURE)
    // })
}

/***
 * @func:剔除top指标提交过滤条件的函数;
 */
export function rejectDataQuery(parm){
    console.log("剔除top指标提交过滤条件",parm);
    let url=Apis.REJECT_DATA_QUERY_URL;
    // return callApi(
    //     url,
    //     parm,
    //     DataQueryRequest(DATA_QUERY),
    //     DataQueryRequestSuccess(GET_REJECT_TOP),
    //     DataQueryRequestFailure(DATA_QUERY_FAILURE)
    // );
    // return (
    //     $.ajax({
    //         url: url,
    //         type: "POST",
    //         dataType: "json",
    //         data: parm
    //     })
    //     .done(function(data){
    //         DataQueryRequestSuccess(GET_REJECT_TOP)
    //     })
    //     .fail(function(data){
    //         DataQueryRequestFailure(DATA_QUERY_FAILURE)
    //     })
    // )
}

/**
 * [getOpenOption description]
 * @param  {[type]} object [从页面上获取到的选择项]
 * @return {[type]}        [返回的数据是一个对象
 * {
        rejectTop：剔除比例
		operator:链接符 and / or
		fiterList:过滤条件  (kqiId，运算符，值) ","分隔单个条件，";"分隔过滤种类
		LinkUp：kqiId，1/0，value 环比条件包含环比条件，1是高于，0是低于，value环比的值
    }]
 */
export function getOpenOption(parm){
    console.log("获取的数据",parm);
    return{
      type:OPEN_ONCLICK_OK,
      data:parm
    }
}

/**
 * 获取下钻指标的复选款的值
 */
export function getCondition(parm){
    console.log("下钻指标的值",parm);
    return{
        type:GET_CONDITION,
        data:parm
    }
}

/**
 * 获取剔除比例的值
 */
export function getRejectTop(parm){
    console.log("剔除比例的值",parm);
    return{
        type:GET_REJECT_TOP,
        data:parm
    }
}
