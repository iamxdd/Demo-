/**
 * 接收reducer里的state,存储所有state
 */
import {
    createStore, applyMiddleware,
    combineReducers, compose
} from "redux";
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {
    getValueDate,
    filterDataGetQuery,
    getOpenDefinitionOption,
    getSelectCondition,
    getRejectTopData
    } from "../reducers/reducer.js";
/**
 * @description:将多个拆分的reducer（一个reducer管理一个状态）合并成一个新的reducer传入store。
 */
const newReducer = combineReducers({
    getValueDate,
    filterDataGetQuery,
    getOpenDefinitionOption,
    getSelectCondition,
    getRejectTopData
});
const logger = createLogger();
const initialState = {};
export default function configureStore() {
    let store;
    if (module.hot) {
        store = createStore(newReducer, initialState, compose(
            applyMiddleware(thunkMiddleware, logger),
            window.devToolsExtension ? window.devToolsExtension() : f => f
        ));
    } else {
        store = createStore(newReducer, initialState, compose(
            applyMiddleware(thunkMiddleware), f => f
        ));
    }
    return store;
}
