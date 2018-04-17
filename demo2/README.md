# Redux入门 -- 买水果生鲜

在上一篇文章中，我们用 `redux` 帮水果店完善了买卖水果的流程。 [Redux入门 -- 买水果](https://juejin.im/user/57d8a928d203090069c13a21)

谁知道水果店生意越来越好，于是开始拓展业务，不仅卖水果，还卖起了生鲜，于是有了水果部和生鲜部。所以我们要拓展下原来的代码了。

现在要增加一个生鲜的记账本

```js
const freshState = {
  egg: 0,
  fish: 0,
  vegetable: 0
};
```

原来的水果账本也要改个名字

```js
const fruitsState = {
  orange: 0,
  apple: 0,
  banana: 0
};
```

然后增加生鲜部的收银员, 默认管理生鲜账本 `freshState`

```js
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
```

然后原来水果部的收银员管理水果账本 `fruitsState`

```js
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
```

接下来增加购买生鲜用户的需求：

```js
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
```

但是老板从来都只看总账本，不管有多少收银员，多少账本，要保证只有一个总账本。所以我们可以用 `redux` 的 `combineReducers` 方法来把这些账本装订成一个总账本。

```js
const {
  createStore,
  combineReducers
} = require('redux');

// 总账本
const state = {
  fruits: fruitsReducer,
  fresh: freshReducer
};

// 总收银员
const reducer = combineReducers(state);

// 创建新的水果生鲜店
const store = createStore(reducer);
```

这样，水果生鲜店就可以营业了，销售员开始处理顾客的购物需求了

```js
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
// ...
```

一天过去了，老板今天又来查账了

```js
console.log(store.getState());
/** { fruits: { orange: 15, apple: 7, banana: 10 },
  fresh: { egg: 8, fish: 11, vegetable: 10 } } */
```

干的不错，继续努力~

> 代码地址：[redux入门 -- 买水果生鲜](https://github.com/aximario/redux-demo/blob/master/demo2/index.js)