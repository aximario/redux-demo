# Redux入门 -- 拆分 reducer

> 掘金：[Redux 入门 -- 拆分 reducer](https://juejin.im/post/5ad56db7518825558c47ec91)

> 本文目标：希望通过买水果生鲜的例子，和大家探讨一下如何用 `redux` 处理比较复杂的 `store` 模型。

## 例子：买水果生鲜

在上一篇文章 [Redux 入门 -- 基础用法](https://juejin.im/post/5ad466f15188255c27226796)中，阿大用 `redux` 开起了水果店。 

谁知道水果店生意越来越好，于是阿大开始拓展业务，不仅卖水果，还卖起了生鲜，于是有了水果部和生鲜部。

于是阿大想了想未来购买生鲜的顾客的行为：

```js
// 买生鲜 - 鸡蛋
function buyEgg(num) {
  return {
    type: 'BUY_EGG',
    payload: {
      count: num
    }
  }
}
```

分了不同的部门之后，不同的业务有不同的记账方式，得分账记了，开来要增加一个生鲜的记账本：

```js
const freshState = {
  egg: 0
};
```

原来的水果账本也要改个名字：

```diff
- const state = {
+ const fruitsState = {
    apple: 0
  };
```

然后增加生鲜部的收银员, 管理生鲜账本 `freshState`：

```js
// 生鲜部收银员
function freshReducer(state = freshState, action) {
  if (action.type === 'BUY_EGG') {
    return Object.assign({}, state, {
      egg: state.egg + action.payload.count
    });
  }
  return state;
}
```

然后原来水果部的收银员管理水果账本 `fruitsState` 需要修改下：

```diff
// 水果部收银员
- function reducer(state, action) {
+ function fruitReducer(state = fruitState, action) {
   if (action.type === 'BUY_APPLE') {
     return Object.assign({}, state, {
       apple: state.apple + action.payload.count
     });
   }
   return state;
 }
```

但是阿大并不想看各个部门的分账本，他只想看一个总账本就好了。刚好 `redux` 提供了 `combineReducers` 功能，可以把各个收银员管理的账本合起来：

```diff
- const { createStore } = require('redux');
+ const { createStore, combineReducers } = require('redux');

// 总账本
+ const state = {
+   fruits: fruitsReducer,
+   fresh: freshReducer
+ };

// 总收银员
+ const reducer = combineReducers(state);

// 创建新的水果生鲜店
- const store = createStore(reducer, state);
+ const store = createStore(reducer);
```

这样，水果生鲜店就可以营业了，销售员又开始处理顾客的购物需求了：

```js
store.dispatch(buyApple(3)); // {"fruit":{"apple":3},"fresh":{"egg":0}}
store.dispatch(buyEgg(1)); // {"fruit":{"apple":3},"fresh":{"egg":1}}
store.dispatch(buyApple(4)); // {"fruit":{"apple":7},"fresh":{"egg":1}}
store.dispatch(buyEgg(8)); // {"fruit":{"apple":7},"fresh":{"egg":9}}
// ...
```

升级之后的水果生鲜店又稳稳当当的运营起来了，阿大心里美滋滋~

## 讲解：

### combineReducers

当业务场景越来越复杂的时候，state 的结构也会变得越来越复杂而且庞大。如果只用一个 reducer 来计算 state 的变化势必会特别麻烦。这个时候我们就可以把 state 里独立的数据分离出来，单独用一个 reducer 来计算，然后再通过 `combineReducers` 方法合入到 state 中。

combineReducers 接收一个对象，这个对象就是最终的 state

```js
const reducer = combineReducers({
  fruits: fruitsReducer,
  fresh: freshReducer
});
```
## 图解：

![](http://ox12mie1c.bkt.clouddn.com/DEMO2.png?imageView2/0/q/75%7Cwatermark/2/text/6Zi_5biM/font/5b6u6L2v6ZuF6buR/fontsize/320/fill/I0ZGRkZGRg==/dissolve/50/gravity/SouthEast/dx/20/dy/20%7Cimageslim)

> 下一篇：[Redux 入门 -- 处理 async action](https://juejin.im/post/5ad5920e6fb9a028c523afcf)