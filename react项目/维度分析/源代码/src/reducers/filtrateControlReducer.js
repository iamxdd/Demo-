/**
 *  多维度分析数据过滤reducer。
 */
import "babel-polyfill";
import {
    DATA_QUERY,
    DATA_QUERY_SUCCESS,
    DATA_QUERY_FAILURE,
    OPEN_ONCLICK_OK,
    GET_CONDITION,
    GET_REJECT_TOP
} from "../actions/action.js";

/**
 * @func:(filterDataGetQuery)获取多维度过滤条件的方法;
 */

export function filterDataGetQuery(state={},action){
	switch (action.type){
		case DATA_QUERY_SUCCESS:
            return {
                data:Object.assign({},state,updateState(state,action)).data
            }
		default:
			return state
	}
}

/**
 * @func:(getOpenDefinitionOption)获取弹出框中的数据的方法。
 */

export function getOpenDefinitionOption(state={},action){
    switch (action.type) {
        case OPEN_ONCLICK_OK:
            return{
                data:action.data
            }
        default:
            return state
    }
}

/**
 * 获取下钻指标的复选款的值
 */
export function getSelectCondition(state={},action){
    switch (action.type) {
        case GET_CONDITION:
            return{
                data:action.data
            }
        default:
            return state
    }
}

/**
 * 获取剔除比例的值
 */
export function getRejectTopData(state={},action){
    switch (action.type) {
        case GET_REJECT_TOP:
            return{
                data:action.data
            }
        default:
            return state
    }
}

function updateState(state,action){
	switch(action.type){
		case DATA_QUERY_SUCCESS:
			return{
				data:action.data
			}
	}
}
