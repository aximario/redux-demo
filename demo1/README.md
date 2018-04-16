# Redux 入门 -- 买水果

我们去水果市场买水果的情形可能是这样的：

* 顾客（对服务员说）：服务员，来一斤橘子。
* 服务员（对记账员说）：卖了一斤橘子。
* 记账员（说）：好的，记账上了，今天卖出的橘子加一斤。

我们可以把这个买卖水果的过程这样抽象出来：

首先我们需要一个账本。

```js
const state = {
  orange: 0,
  apple: 0,
  banana: 0
};
```

然后我们需要请一个记账员，他知道对于不同的顾客需求，该怎么记账。

```js
// 每次的操作都是返回一个新账本，而不是在原来的账本上修改
// 这样就能方便的知道任何一笔交易时这个账本的状态了
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

接下来让记账员开始上班工作。

```js
import { createStore } from 'redux';

const store = createStore(reducer, state);
```

这个水果店可以开始营业了。

来了一位顾客

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

buyApple(3); // 顾客1说：买三斤苹果
buyBanana(5); // 顾客2说：买5斤香蕉
buyOrange(1); // 顾客3说： 买1斤橘子
// ...更多顾客
```

服务员告诉记账员

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