/**
 * 多维度分析数据过滤action。
 */

import Apis from "../utils/api.js";
import { callApi } from '../utils/utils.js';
import $ from "jquery";
import {
    GET_VALUE,
    GET_VALUE_SUCCESS,
    GET_VALUE_FAILURE
} from "./action.js";

function getValueRequest(type) {
    return{
        type:type
    }
}

function getValueRequestSuccess(type){
    return function(data){
        return{
            type:type,
            data:data
        }
    }
}
function getValueRequestFailure(type){
    return function(data){
        return{
            type:type
        }
    }
}

/***
 * @func:提交过滤条件的函数;
 */
export function getSelectValue(parm){
    // console.log("页面下钻下来的条件选择Select的Value",parm);
    // let url="/multiAnalysis/initFilterData.action";
    // return callApi(
    //     url,
    //     parm,
    //     getValueRequest(GET_VALUE),
    //     getValueRequestSuccess(GET_VALUE_SUCCESS),
    //     getValueRequestFailure(GET_VALUE_FAILURE)
    // );
    // $.ajax({
    //     url: url,
    //     type:"POST",
    //     dataType: "json",
    //     data: parm
    // })
    // .done(function(data){
    //     return getValueRequestSuccess(GET_VALUE_SUCCESS)
    // })
    // .fail(function(err){
    //     return getValueRequestFailure(GET_VALUE_FAILURE)
    // })
}
