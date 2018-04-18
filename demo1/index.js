/**
 * redux入门 -- 买水果示例 https://juejin.im/post/5ad466f15188255c27226796
 * @author aximario 2018-04-16
 */

// 顾客的需求，买苹果
function buyApple(num) {
  return {
    type: 'BUY_APPLE',
    payload: num
  }
}

// 账本
const state = { apple: 0 };

// 收银员
function reducer(state, action) {

  // 如果有人买了苹果，更新账本
  if (action.type === 'BUY_APPLE') {
    return Object.assign({}, state, {
      apple: state.apple + action.payload
    });
  }

  // 买其他的东西，不更新账本，原样返回
  return state;
}

const { createStore } = require('redux');

// 水果店
const store = createStore(reducer, state);

// 每一笔交易都记下来给阿大看
store.subscribe(() => console.log(JSON.stringify(store.getState())));

// 销售员开始销售
store.dispatch(buyApple(3));
store.dispatch(buyApple(4));