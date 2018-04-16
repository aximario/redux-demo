/**
 * redux入门 -- 买水果示例 https://juejin.im/post/5ad466f15188255c27226796
 * @author aximario 2018-04-16
 */

const { createStore } = require('redux');

const state = {
  orange: 0,
  apple: 0,
  banana: 0
};

function reducer(state, action) {
  switch(action.type) {
    case 'BUY_ORANGE': {}
      return Object.assign({}, state, {
        orange: state.orange + action.payload
      });
    case 'BUY_APPLE':
      return Object.assign({}, state, {
        apple: state.apple + action.payload
      });
    case 'BUY_BANANA':
      return Object.assign({}, state, {
        banana: state.banana + action.payload
      });
    default:
      return state;
  }
}

function buyOrange(num) {
  return {
      type: 'BUY_ORANGE',
      payload: num
  }
}

function buyApple(num) {
  return {
      type: 'BUY_APPLE',
      payload: num
  }
}

function buyBanana(num) {
  return {
      type: 'BUY_BANANA',
      payload: num
  }
}

const store = createStore(reducer, state);

store.dispatch(buyApple(3));
store.dispatch(buyBanana(5));
store.dispatch(buyOrange(7));
store.dispatch(buyBanana(5));
store.dispatch(buyOrange(2));
store.dispatch(buyApple(4));
store.dispatch(buyOrange(6));

console.log(store.getState());