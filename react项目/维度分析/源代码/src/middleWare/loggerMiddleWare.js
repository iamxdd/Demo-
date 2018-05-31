import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = null;
  if (action.type === "INCREMENT") {
    fetch("localhost:8080.getData.action", {})
      .then( /*result = next(action)*/ function(res) {
        console.warn("res", res);
        result = next(action)
      })
      .then(() => result)
      .catch((err) => {
        console.exception ? console.exception(err, {
          msg: "请求数据失败，请检查请求路径是否正确"
        }) : console.error(err, {
          msg: "请求数据失败，请检查请求路径是否正确"
        })
      })
  } else {
    result = next(action);
  }
  // result = next(action)
  console.log('next state', store.getState())
    // return result
}

export default {
  logger
};