/**
 * @description:filter data query action.type
 * 多维度分析数据过滤的action.type
 */
export const DATA_QUERY="DATA_QUERY";
export const DATA_QUERY_SUCCESS="DATA_QUERY_SUCCESS";
export const DATA_QUERY_FAILURE="DATA_QUERY_FAILURE";
export const OPEN_ONCLICK_OK="OPEN_ONCLICK_OK";
export const GET_CONDITION="GET_CONDITION";
export const GET_REJECT_TOP="GET_REJECT_TOP";

/**
 * 多维度分析获取动态生成的下来复选框的value值
 */
export const GET_VALUE="GET_VALUE";
export const GET_VALUE_SUCCESS="GET_VALUE_SUCCESS";
export const GET_VALUE_FAILURE="GET_VALUE_FAILURE";

export {
    getDataQuery,
    getOpenOption,
    getCondition,
    getRejectTop,
    rejectDataQuery
} from "./filterDataQueryAction.js";

export { getSelectValue } from "./getSelectValueAction.js";
