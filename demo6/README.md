# Redux 高级 -- 源码分析

## createStore.js

### createStore

redux 的一切都从 createStore 开始

```js
const store = redux.createStore(reducer, preloadedState, enhancer);
```

createStore 可以接受三个参数：

* reducer **必须** {functioin} 计算 state 改变的函数
* preloadState **可选** {object} 最初的 state
* enhancer **可选** {function} store 的增强器

如果没有设置最初的 state，第二个参数也可以传 `enhancer`，也是会正确执行的。

```js
const store = redux.createStore(reducer, enhancer);
```

因为源码里面有这么一段：

```js
// 如果第二个参数是 function，没有第三个参数
// 那么就认为第二个参数是 enhancer，preloadedState 是 undefined
if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
  enhancer = preloadedState
  preloadedState = undefined
}
```

最终 createStore 返回一个 `store` 对象：

```js
return {
  dispatch,
  subscribe,
  getState,
  replaceReducer,
  // ...
}
```

接下来我们一个个来看 store 对象里的这些成员。

### dispatch

dispatch 负责发出 action：

```js
store.dispatch({ type: 'ACTION_TYPE' });
```

dispatch 只接收一个参数，那就是 `action`，最终返回这个 action。

dispatch 只做了两件事：

* 获取 reducer 计算的新的 state，并把旧的 state 换成新的 state
* 调用通过 `store.subscribe(listener)` 注册的 listener

源码：

```js
function dispatch(action) {
  // ...
  if (isDispatching) {
    throw new Error('Reducers may not dispatch actions.')
  }

  try {
    isDispatching = true

    // **核心工作**：调用 reducer 计算出最新的 state
    // oldState + action => newState
    // reducer 在获取到新的 action 通知后，计算出最新的 state
    currentState = currentReducer(currentState, action)
  } finally {
    isDispatching = false
  }

  // 调用通过 store.subscribe(listener) 注册的监听函数
  const listeners = (currentListeners = nextListeners)
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i]
    listener()
  }

  // 原封不动的返回 action
  return action
}
```

### reducer

从上面的源码：

```js
currentState = currentReducer(currentState, action)
// nextState = reducer(prevState, action)
```

可以看出,我们传进去的参数 reducer 必须是这样的：接受 state 和 action，通过一顿计算之后，返回新的 state。至于怎么计算，就是我们自己编写了。

### subscribe

注册事件，每次 dispatch action 的时候都会调用。

subscribe(listener) 接收一个 {function} listener 作为参数，同时返回一个函数用来注销原来注册的时间 listener

```js
function subscribe(listener) {
  //...
  nextListeners.push(listener)

  return function unsubscribe() {
    // ...
    const index = nextListeners.indexOf(listener)
    nextListeners.splice(index, 1)
  }
}

// 注册
const unsubscribe = store.subscribe(() => { console.log('action dispatched!'); });

// 注销
unsubscribe();
```

### getState

getState 方法返回最新的 state

```js
function getState() {
  // ...
  return currentState
}
```

### replaceReducer

replaceReducer 接收一个参数 {function} reducer。用传入的 reducer 替换原来的 reducer

```js
function replaceReducer(nextReducer) {
  // ...
  currentReducer = nextReducer
  dispatch({ type: ActionTypes.REPLACE })
}
```

### createStore 续

接下来我们继续回来看看 createStore 里的逻辑：

```js
function createStore(reducer, preloadedState, enhancer) {
  // ...

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  let isDispatching = false
  // ...

  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```

对的，就只有这么一点逻辑：如果有 enhancer，返回 enhancer 的执行结果，然后 dispatch 一个初始化的 action -- `{ type: ActionTypes.INIT }` 就没了。

所以这个 enhancer 大有文章，是块硬骨头。而 enhancer 我们在使用的时候知道，是调用 `applyMiddleware` 生成的，但是 applyMiddleware 里有个非常重要的函数，必须要先拿出来讲一讲 -- `compose`。

## compose.js

compose 函数接收若干个函数作为参数，并从右到左组合起来，返回这个组合起来的函数。

```js
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

举个例子：

```js
function a(...args) { console.log('a', [...args]); return { a: [...args] }; }
function b(...args) { console.log('b', [...args]); return { b: [...args] }; }
function c(...args) { console.log('c', [...args]); return { c: [...args] }; }
compose(a, b, c);
```

大家可以思考下返回的是什么

```js
(...args) => a(b(c(...args)))
```

对的，返回的是一个函数，这个函数接收若干个参数 `args`，并且把这些参数给 `c` 执行，然后 `c` 执行的结果再次作为参数给 `b` 执行，以此类推。让我们来试一下吧：

```js
compose(a, b, c)(1, 2, 3, 4, 5);
// c [1, 2, 3, 4, 5]
// b [{ c: [1, 2, 3, 4, 5] }]
// a [{ b: [{ c: [1, 2, 3, 4, 5]}] }]
```

## applyMiddleware.js

搞懂了 compose，接下来就可以看这个源码了：

```js
function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```

原来 `applyMiddleware` 啥也没做，就返回了一个函数 `createStore => { // ... }`。这就是我们传到 createStore 里的 enhancer，它又接收 createStore 函数作为参数，返回了一个函数 `(...args) => { // ... }`，我们暂且叫它 executor。

所以上面源码的这么一段可以这样拆分：

```js
function createStore(reducer, preloadedState, enhancer) {
  // ...
  return enhancer(createStore)(reducer, preloadedState)
  // ...
}

// 拆分为
const enhancer = applyMiddleware(middileware1, middleware2);

const executor = enhancer(createStore);
const result = executor(reducer, preloadedState); // 拆分之后就可以主要看这一段了
return result;
```

单独拎出来看看

```js
function executor(...args) {

  // 通过传入的参数创建新的 store
  const store = createStore(...args)

  // 默认的 dispath
  let dispatch = () => {
    throw new Error(
      `Dispatching while constructing your middleware is not allowed. ` +
        `Other middleware would not be applied to this dispatch.`
    )
  }

  // 注入给 middleware() 的参数 { getState, dispatch }
  // 前面的文章有讲到如何写 middleware， 它的形式：
  // ({ getState, dispatch }) => next => action => { // ... }
  const middlewareAPI = {
    getState: store.getState,
    dispatch: (...args) => dispatch(...args)
  }

  // 把 middleware 执行并存放到数组里
  // chain = [ next => action => { // middleware1 }, next => action => { //middleware2 }]
  const chain = middlewares.map(middleware => middleware(middlewareAPI))

  // compose 起来，传给最后一个 middleware 的参数是 store.dispatch，上面有讲过 compose
  dispatch = compose(...chain)(store.dispatch)

  return {
    ...store,

    // 用新的 dispatch 替换最早的 store.dispatch
    dispatch
  }
}
```

我们还是把上面的 `dispatch = compose(...chain)(store.dispatch)` 拆开来看：

```js
compose(...chain)
// compose(next => action => { console.log('m1', next) }, next => action => { console.log('m2', next) });

// 结果
const executor = (...args) => a(b(...args));

//其中
// a = next => action => { console.log('m1', next) }
// b = next => action => { console.log('m2', next) }

// 然后
dispatch = executor(store.dispatch)

// 结果
dispatch = a(b(store.dispatch))

// 即
(store.dispatch /** m2 next */ => {
  action => {
    console.log('m2', next)
  }
} /** m1 next */ ) => {
  action => {
    console.log('m1', next);
  }
}
```

总结下来，假设有 3 个中间件：`m1`，`m2`，`m3`。这个时候 dispatch 了一个 action。此时的 dispatch 已经不是最原始的 store.dispatch 了。而是经过 compose 过中间件的 dispatch。这个 action 会依次经过 m1, m2, m3 的处理，m1 处理完了之后会调用 `next(action)`，这个 next 就是 m2，实际上是调用第二个中间件处理 action，然后依次类推，m2 会调用 `next(action)`，这个 next 就是 m3。因为 m3 是最后一个中间件，所以 m3 里的 `next` 实际上就是 `store.dispatch`。

我们来用这个例子验证一下：

```js
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
// m1 function (action) {
//         console.log('m2', next);
//         next(action);
//       }
// m2 function (action) {
//         console.log('m3', next);
//         next(action);
//       }
// m3 function dispatch(action) {
//     if (!(0, _isPlainObject2['default'])(action)) {
//       throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
//     }

//     if (typeof action.type === 'undefined') {
//       throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
//     }

//     if (isDispatching) {
//       throw new Error('Reducers may not dispatch actions.');
//     }

//     try {
//       isDispatching = true;
//       currentState = currentReducer(currentState, action);
//     } finally {
//       isDispatching = false;
//     }

//     var listeners = currentListeners = nextListeners;
//     for (var i = 0; i < listeners.length; i++) {
//       var listener = listeners[i];
//       listener();
//     }

//     return action;
//   }
```

结果和预料的是一样的。