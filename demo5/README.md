# Redux 进阶 --- 编写和使用中间件

> 本文目标：和大家探讨一下如何通过编写和使用 `redex 中间件` 来帮助我们更好的使用 `redux`。

在上一篇文章 [Redux进阶 -- 改善水果店购买流程](https://juejin.im/post/5ad5920e6fb9a028c523afcf)中，阿大通过改善流程对接完成了水果店的升级。

但是阿大又有一个新的想法，他想详细的看看每一个顾客的购买需求来了之后，账本的前后变化。看来又要加一个新角色**记录员**了。难道要像加**采购员**那样手动的一个个的加吗？那可太麻烦了。正好阿大发现 `redux` 里有一个功能就是中间件。中间件是干嘛的呢？简而言之，就是把顾客的需求从**销售员**到**收银员**之间加上各种角色来处理。每一个角色就是一个中间件。接下来阿大就开始来写中间件了。

`redux` 中间件写起来其实很简单，就是一个函数而已。按照它的要求。这个函数接受一个 `{ dispatch, getState }` 对象作为参数，然后返回一个 `action`。

那这样，就可以把原来的**采购员**也改造成中间件了，其实采购员就是拿到了顾客需求之后让顾客的需求延迟 `dispatch`，这用延迟用函数就可以做到了:

```js
// dispatch 是用中间件增强之后的 dispatch
// next 是最原始的 store.dispatch
const thunkMiddleware = ({ dispatch }) => next => action => {
  if (typeof action === 'function') {

    // 函数形式的 action 就把增强的 dispatch 给这个 action，让 action 决定什么时候 dispatch （控制反转）
    return action(dispatch);
  }

  // 普通的 action 就直接传递给原来的 store.dispatch 不做任何处理
  return next(action);
}
```

然后我们就需要把原来的顾客需求改一下了：

```js
// 买水果 - 进口苹果
function buyImportedApple(num) {

  // 返回一个函数类型的 action，这个函数接受 dispatch，可以决定什么时候 dispatch
  return dispatch => API.fetchImportedApple(() => dispatch({
    type: 'BUY_IMPORTED_APPLE',
    payload: num
  }));
}

// 买生鲜 - 进口鸡蛋
function buyImportedEgg(num) {
  return dispatch => API.fetchImportedEgg(() => dispatch({
    type: 'BUY_IMPORTED_EGG',
    payload: num
  }));
}
```

然后**采购员**就可以只负责采购了，改回去：

```js
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
```

然后，我们在添加一个**记录员**的中间件：

```js
const loggerMiddleware = ({ getState }) => next => action => {
  console.log(`state before: ${JSON.stringify(getState())}`);
  console.log(`action: ${JSON.stringify(action)}`);
  next(action);
  console.log(`state after: ${JSON.stringify(getState())}`);
  console.log('================================================')
}
```

删除掉原来的监听：

```diff
- store.subscribe(() => console.log(JSON.stringify(store.getState())));
```

好了，接下来就可以通过 `redux` 的 `applyMiddleware` 来串联起这些中间件啦。

```js
const { createStore, combineReducers, applyMiddleware } = require('redux');

// 中间件的调用顺序是从右到左
const store = createStore(reducer, applyMiddleware(thunkMiddleware, loggerMiddleware));
```

好了，大功告成，开始服务顾客：

```js
store.dispatch(buyApple(3));
store.dispatch(buyImportedApple(10));
store.dispatch(buyEgg(1));
store.dispatch(buyImportedEgg(10));
store.dispatch(buyApple(4));
store.dispatch(buyImportedApple(10));
store.dispatch(buyEgg(8));
store.dispatch(buyImportedEgg(10));
// state before: {"fruit":{"apple":0,"importedApple":0},"fresh":{"egg":0,"importedEgg":0}}
// action: {"type":"BUY_APPLE","payload":3}
// state after: {"fruit":{"apple":3,"importedApple":0},"fresh":{"egg":0,"importedEgg":0}}
// ================================================
// state before: {"fruit":{"apple":3,"importedApple":0},"fresh":{"egg":0,"importedEgg":0}}
// action: {"type":"BUY_EGG","payload":1}
// state after: {"fruit":{"apple":3,"importedApple":0},"fresh":{"egg":1,"importedEgg":0}}
// ================================================
// state before: {"fruit":{"apple":3,"importedApple":0},"fresh":{"egg":1,"importedEgg":0}}
// action: {"type":"BUY_APPLE","payload":4}
// state after: {"fruit":{"apple":7,"importedApple":0},"fresh":{"egg":1,"importedEgg":0}}
// ================================================
// state before: {"fruit":{"apple":7,"importedApple":0},"fresh":{"egg":1,"importedEgg":0}}
// action: {"type":"BUY_EGG","payload":8}
// state after: {"fruit":{"apple":7,"importedApple":0},"fresh":{"egg":9,"importedEgg":0}}
// ================================================
// state before: {"fruit":{"apple":7,"importedApple":0},"fresh":{"egg":9,"importedEgg":0}}
// action: {"type":"BUY_IMPORTED_APPLE","payload":10}
// state after: {"fruit":{"apple":7,"importedApple":10},"fresh":{"egg":9,"importedEgg":0}}
// ================================================
// state before: {"fruit":{"apple":7,"importedApple":10},"fresh":{"egg":9,"importedEgg":0}}
// action: {"type":"BUY_IMPORTED_APPLE","payload":10}
// state after: {"fruit":{"apple":7,"importedApple":20},"fresh":{"egg":9,"importedEgg":0}}
// ================================================
// state before: {"fruit":{"apple":7,"importedApple":20},"fresh":{"egg":9,"importedEgg":0}}
// action: {"type":"BUY_IMPORTED_EGG","payload":10}
// state after: {"fruit":{"apple":7,"importedApple":20},"fresh":{"egg":9,"importedEgg":10}}
// ================================================
// state before: {"fruit":{"apple":7,"importedApple":20},"fresh":{"egg":9,"importedEgg":10}}
// action: {"type":"BUY_IMPORTED_EGG","payload":10}
// state after: {"fruit":{"apple":7,"importedApple":20},"fresh":{"egg":9,"importedEgg":20}}
// ================================================
```

上面我们写的两个中间件其实就是 `redux-thunk` 和 `redux-logger` 的简版。在实际中，推荐使用它们，会更可信。
