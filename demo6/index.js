const redux = require('redux');

const enhancer = redux.applyMiddleware(
  function({ dispatch }) {
    return function(next) {
      return function(action) {
        console.log('m1', next);
        next(action);
      }
    }
  },
  function({ dispatch }) {
    return function(next) {
      return function(action) {
        console.log('m2', next);
        next(action);
      }
    }
  },
  function({ dispatch }) {
    return function(next) {
      return function(action) {
        console.log('m3', next);
        next(action);
      }
    }
  }
);

const store = redux.createStore(function(state = { test: 'a' }, action) {
  if (action.type === 'TEST') {
    return Object.assign({}, state, { test: 'b' });
  }
  return state;
}, enhancer);

store.dispatch({ type: 'TEST' });
console.log(store.getState())