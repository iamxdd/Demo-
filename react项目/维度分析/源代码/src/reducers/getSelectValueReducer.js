/**
 *  多维度分析获取动态生成的下拉框的value值的Reducer。
 */
import "babel-polyfill";
import {
    GET_VALUE,
    GET_VALUE_SUCCESS,
    GET_VALUE_FAILURE
} from "../actions/action.js";

/**
 * @func:(getValueDate)获取下拉框中的数据值;
 */

export function getValueDate(state={},action){
	switch (action.type){
		case GET_VALUE_SUCCESS:
            return {
                data:Object.assign({},state,updateState(state,action)).data
            }
		default:
			return state
	}
}

function updateState(state,action){
	switch(action.type){
		case GET_VALUE_SUCCESS:
			return{
				data:action.data
			}
	}
}
