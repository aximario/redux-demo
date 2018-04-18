# Redux入门 -- 买水果生鲜

> 掘金：[Redux 入门 -- 买水果生鲜](https://juejin.im/post/5ad56db7518825558c47ec91)

> 本文目标：通过买水果生鲜的例子，希望能让初学 redux 的同学在掌握 redux 的基本用法的基础上，能处理比较复杂的 `store` 模型。

在上一篇文章[Redux 入门 -- 买水果](https://juejin.im/post/5ad466f15188255c27226796)中，阿大用 `redux` 升级了水果店。 

谁知道水果店生意越来越好，于是阿大开始拓展业务，不仅卖水果，还卖起了生鲜，于是有了水果部和生鲜部。

于是阿大想了想未来购买生鲜的顾客的行为：

```js
// 买生鲜 - 鸡蛋
function buyEgg(num) {
  return {
    type: 'BUY_EGG',
    payload: num
  }
}
```

分了不通的部门之后，不通的业务有不同的记账方式，得分账记了，增加一个生鲜的记账本：

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
      egg: state.egg + action.payload
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
  
   // 如果有人买了苹果，更新账本
   if (action.type === 'BUY_APPLE') {
     return Object.assign({}, state, {
       apple: state.apple + action.payload
     });
   }
   
   // 买其他的东西，不更新账本，原样返回
   return state;
 }
```

但是阿大并不想看各个部门的分账本，他只想看一个总账本就好了。刚好 `redux` 提供了 `combineReducers` 把各个收银员管理的账本合起来：

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

营业模型：

![](http://ox12mie1c.bkt.clouddn.com/DEMO2.png?imageView2/0/q/75%7Cwatermark/2/text/6Zi_5biM/font/5b6u6L2v6ZuF6buR/fontsize/320/fill/I0ZGRkZGRg==/dissolve/50/gravity/SouthEast/dx/20/dy/20%7Cimageslim)