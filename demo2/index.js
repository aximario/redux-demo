/**
 * redux入门 -- 买水果生鲜示例 https://juejin.im/post/5ad56db7518825558c47ec91
 * @author aximario 2018-04-17
 */

const {
  createStore,
  combineReducers
} = require('redux');

// 水果账本
const fruitsState = {
  orange: 0,
  apple: 0,
  banana: 0
};

// 生鲜账本
const freshState = {
  egg: 0,
  fish: 0,
  vegetable: 0
};

/**
 * 水果收银员
 */
function fruitsReducer(state = fruitsState, action) {
  switch (action.type) {
    case 'BUY_ORANGE':
      {}
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

/**
 * 生鲜收银员
 */
function freshReducer(state = freshState, action) {
  switch (action.type) {
    case 'BUY_EGG':
      {}
      return Object.assign({}, state, {
        egg: state.egg + action.payload
      });
    case 'BUY_FISH':
      return Object.assign({}, state, {
        fish: state.fish + action.payload
      });
    case 'BUY_VEGETABLE':
      return Object.assign({}, state, {
        vegetable: state.vegetable + action.payload
      });
    default:
      return state;
  }
}

/** --- 买水果的顾客需求 ---*/
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
/** --- 买水果的顾客需求 ---*/

/** --- 买生鲜的顾客需求 ---*/
function buyEgg(num) {
  return {
    type: 'BUY_EGG',
    payload: num
  }
}

function buyFish(num) {
  return {
    type: 'BUY_FISH',
    payload: num
  }
}

function buyVegetable(num) {
  return {
    type: 'BUY_VEGETABLE',
    payload: num
  }
}
/** --- 买生鲜的顾客需求 ---*/

const state = {
  fruits: fruitsReducer,
  fresh: freshReducer
};
const reducer = combineReducers(state);
const store = createStore(reducer);

store.dispatch(buyApple(3));
store.dispatch(buyBanana(5));
store.dispatch(buyOrange(7));
store.dispatch(buyBanana(5));
store.dispatch(buyOrange(2));
store.dispatch(buyApple(4));
store.dispatch(buyOrange(6));
store.dispatch(buyEgg(4));
store.dispatch(buyFish(9));
store.dispatch(buyVegetable(2));
store.dispatch(buyEgg(4));
store.dispatch(buyVegetable(8));
store.dispatch(buyFish(2));

console.log(store.getState());