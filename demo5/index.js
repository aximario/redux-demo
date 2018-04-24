/** --- 顾客的需求 ---*/
// 买水果 - 苹果
function buyApple(num) {
  return {
    type: 'BUY_APPLE',
    payload: {
      count: num
    }
  }
}

// 买生鲜 - 鸡蛋
function buyEgg(num) {
  return {
    type: 'BUY_EGG',
    payload: {
      count: num
    }
  }
}

// 买水果 - 进口苹果
function buyImportedApple(num) {
  return dispatch => API.fetchImportedApple(() => dispatch({
    type: 'BUY_IMPORTED_APPLE',
    payload: {
      count: num
    }
  }));
}

// 买生鲜 - 进口鸡蛋
function buyImportedEgg(num) {
  return dispatch => API.fetchImportedEgg(() => dispatch({
    type: 'BUY_IMPORTED_EGG',
    payload: {
      count: num
    }
  }));
}
/** --- 顾客的需求 ---*/

/** --- 账本 --- */
const fruitState = { apple: 0, importedApple: 0 }; // 水果部账本
const freshState = { egg: 0, importedEgg: 0 }; // 生鲜部账本
/** --- 账本 --- */

/** --- 收银员 ---*/
// 水果部收银员
function fruitReducer(state = fruitState, action) {
  
  // 如果有人买了相应的水果，更新账本
  switch (action.type) {
    case 'BUY_APPLE':
      return Object.assign({}, state, {
        apple: state.apple + action.payload.count
      });
    case 'BUY_IMPORTED_APPLE':
      return Object.assign({}, state, {
        importedApple: state.importedApple + action.payload.count
      });

    // 买其他的东西，不更新账本，原样返回
    default: return state;
  } 
}

// 生鲜部收银员
function freshReducer(state = freshState, action) {
  switch (action.type) {
    case 'BUY_EGG':
      return Object.assign({}, state, {
        egg: state.egg + action.payload.count
      });
    case 'BUY_IMPORTED_EGG':
      return Object.assign({}, state, {
        importedEgg: state.importedEgg + action.payload.count
      });
    default: return state;
  } 
}
/** --- 收银员 ---*/

/** --- 采购员 --- */
// 采购商品生成器，不同的商品需要不同的时间采购
function fetching(time, callback) {

  // 用延时模拟采购时间
  const timer = setTimeout(() => {
    clearTimeout(timer);

    // 采购完成，通知销售员
    callback();
  }, time);
}

// 采购进口苹果需要 2 天（2s）
function fetchImportedApple(callback) {
  fetching(2000, callback);
}

// 采购进口苹果需要 3 天（3s）
function fetchImportedEgg(callback) {
  fetching(3000, callback);
}

// 采购员
const API = {
  fetchImportedApple, // 采购进口苹果
  fetchImportedEgg // 采购进口鸡蛋
}
/** --- 采购员 --- */

const { createStore, combineReducers, applyMiddleware } = require('redux');

// middleware
const thunkMiddleware = ({ dispatch }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch);
  }
  return next(action);
}

const loggerMiddleware = ({ getState }) => next => action => {
  console.log(`state before: ${JSON.stringify(getState())}`);
  console.log(`action: ${JSON.stringify(action)}`);
  next(action);
  console.log(`state after: ${JSON.stringify(getState())}`);
  console.log('================================================')
}

// 总收银员
const reducer = combineReducers({ fruit: fruitReducer, fresh: freshReducer });

// 水果店
const store = createStore(reducer, applyMiddleware(thunkMiddleware, loggerMiddleware));

// 销售员开始销售，采购员开始采购
store.dispatch(buyApple(3));
store.dispatch(buyImportedApple(10));
store.dispatch(buyEgg(1));
store.dispatch(buyImportedEgg(10));
store.dispatch(buyApple(4));
store.dispatch(buyImportedApple(10));
store.dispatch(buyEgg(8));
store.dispatch(buyImportedEgg(10));