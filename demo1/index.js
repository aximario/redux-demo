/**
 * redux入门 -- 掘金：[Redux 入门 -- 基础用法](https://juejin.im/post/5ad466f15188255c27226796)
 * @author aximario
 */

function buyApple(num) {
  return {
    type: 'BUY_APPLE',
    payload: {
      count: num
    }
  }
}

const state = { apple: 0 };

function reducer(state, action) {
  if (action.type === 'BUY_APPLE') {
    return Object.assign({}, state, {
      apple: state.apple + action.payload.count
    });
  }
  return state;
}

const { createStore } = require('redux');
const store = createStore(reducer, state);

store.subscribe(() => console.log(JSON.stringify(store.getState())));

store.dispatch(buyApple(3));
store.dispatch(buyApple(4));