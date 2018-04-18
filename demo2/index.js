/**
 * redux入门 -- 买水果示例 https://juejin.im/post/5ad466f15188255c27226796
 * @author aximario 2018-04-16
 */

/** --- 顾客的需求 ---*/
// 买水果 - 苹果
function buyApple(num) {
  return {
    type: 'BUY_APPLE',
    payload: num
  }
}

// 买生鲜 - 鸡蛋
function buyEgg(num) {
  return {
    type: 'BUY_EGG',
    payload: num
  }
}
/** --- 顾客的需求 ---*/

/** --- 账本 --- */
const fruitState = { apple: 0 }; // 水果部账本
const freshState = { egg: 0 }; // 生鲜部账本
/** --- 账本 --- */

/** --- 收银员 ---*/
// 水果部收银员
function fruitReducer(state = fruitState, action) {
  
  // 如果有人买了苹果，更新账本
  if (action.type === 'BUY_APPLE') {
    return Object.assign({}, state, {
      apple: state.apple + action.payload
    });
  }
  
  // 买其他的东西，不更新账本，原样返回
  return state;
}

// 生鲜部收银员
function freshReducer(state = freshState, action) {
  if (action.type === 'BUY_EGG') {
    return Object.assign({}, state, {
      egg: state.egg + action.payload
    });
  }
  return state;
}
/** --- 收银员 ---*/

const { createStore, combineReducers } = require('redux');

// 总账本
const state = { fruit: fruitReducer, fresh: freshReducer };

// 总收银员
const reducer = combineReducers(state);

// 水果店
const store = createStore(reducer);

// 每一笔交易都记下来给老板看
store.subscribe(() => console.log(JSON.stringify(store.getState())));

// 销售员开始销售
store.dispatch(buyApple(3));
store.dispatch(buyEgg(1));
store.dispatch(buyApple(4));
store.dispatch(buyEgg(8));