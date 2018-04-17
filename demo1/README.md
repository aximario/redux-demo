# Redux 入门 -- 买水果

我们去水果市场买水果的情形可能是这样的：

* 顾客对售卖员说：麻烦给我来一斤橘子（付钱）。
* 售卖员给顾客称了一斤橘子并对收银员说：卖出了一斤橘子，记一下。
* 收银员记好账说：好的，记账上了，可以把橘子给顾客了。
* 顾客拿了橘子开心的走了。

我们可以把这个买卖水果的过程这样抽象出来：

首先我们需要一个账本，这个账本记录了水果买卖的流水，我们可以用一个对象表示：

```js
const state = {
  orange: 0,
  apple: 0,
  banana: 0
};
```

然后我们抽象出顾客的需求，这里可以抽象成两点：**购买水果的种类**和**购买的斤数**：

```js
const action = {
  type: 'BUY_ORANGE',
  payload: 1
}
```

不同的用户可能有不同的需求，所以我们可以包装成一个**生成需求的函数**，这个函数返回用户的需求：

```js
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
```

然后我们需要请一个收银员，他知道对于不同的顾客需求，该怎么记账，收银员需要两样东西：**账本**和顾客的**需求**，这样才能根据顾客的需求来操作账本：

```js
/**
 * @param state 账本
 * @param action 顾客的需求
 */
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
```

这个函数每次都返回一个**新的账本**，这样就能方便的查到每一笔交易时账本的状态。

接下来让记账员开始上班工作，工作需要一个**收银员**和**最初的账本**：

```js
import { createStore } from 'redux';

// reducer 收银员
// state 最初的账本
const store = createStore(reducer, state);
```

`redux` 提供的 `createStore` 方法负责创建水果店 `store`。这个生成的 `store` 有下面的一些东西：

```js
store = {
  dispatch, // 销售员
  getState, // 查看账本
  getReducer // 查看收银员
  //...
}
```

好了，这个水果店可以开始营业了。

顾客开始来购买水果

```js
buyApple(3); // 顾客1说：买三斤苹果
buyBanana(5); // 顾客2说：买5斤香蕉
buyOrange(1); // 顾客3说： 买1斤橘子
// ...更多顾客
```

销售员需要知道**顾客的需求**并转告给收银员

```js
store.dispatch(buyApple(3));
store.dispatch(buyBanana(5));
store.dispatch(buyOrange(7));
store.dispatch(buyBanana(5));
store.dispatch(buyOrange(2));
store.dispatch(buyApple(4));
store.dispatch(buyOrange(6));
```

经过了一天的买卖，店老板来了，要看看今天的业绩

```js
console.log(store.getState()); // 查看账本
// { orange: 15, apple: 7, banana: 10 }
```

干的不错，升职加薪！

忙碌的一天过去啦~

> 代码地址：[Redux入门 -- 买水果](https://github.com/aximario/redux-demo/blob/master/demo1/index.js)