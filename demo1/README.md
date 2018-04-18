# Redux 入门 -- 买水果

> 掘金：[Redux 入门 -- 买水果](https://juejin.im/post/5ad466f15188255c27226796)

> 本文目标：通过买水果的例子，希望能让初学 redux 的同学掌握 redux 的基本用法，快速入门。

一天，程序员阿大（化名）想要去买水果吃，发现小区周围居然没有水果店，于是就打算自己开一个水果店赚点小钱。

他想了想未来顾客买水果的行为：

```js
// 买 2 斤水果
const action = {
  type: 'BUY_APPLE', // 买苹果
  payload: 2
}
```

那不同的顾客要的斤数可能不同，于是他写了下面这个方法：

```js
/**
 * 只要知道斤数就可以快速生成顾客的各种需求
 * @param {number} num 顾客要买的斤数 
 */
function buyApple(num) {
  return {
    type: 'BUY_APPLE',
    payload: num
  }
}
```

不仅如此，阿大还想要知道每天卖出了什么水果，各卖了多少斤，于是他想要一个账本记录每天的交易：

```js
// 为了简便，就只举一个例子，事实上还有很多其他水果，大家自行脑补
const state = { apple: 0 };
```

好了，现在顾客需求，账本，水果都有了，那谁来记账呢？所以阿大请了一个**收银员**负责记账，并告诉他这么记账：

```js
/**
 * 收银员只要知道顾客的需求就能正确的操作账本
 * @param {object} state 账本
 * @param {object} action 顾客的需求
 */
function reducer(state, action) {

  // 如果有人买了苹果，加上顾客买的斤数，更新账本
  if (action.type === 'BUY_APPLE') {
    return Object.assign({}, state, {
      apple: state.apple + action.payload
    });
  }

  // 买咱们店里没有的东西，不更新账本，原样返回
  return state;
}
```

好了，现在收银员也有了，店铺可以营业了，顾客开始来了，收银员开始工作了：

```js
const state2 /** 服务顾客 1 之后的新账本 */ = reducer(state, buyApple(1) /** 顾客1： 买 1 斤苹果 */);
const state3 /** 服务顾客 2 之后的新账本 */ = reducer(state2, buyApple(3) /** 顾客2： 买 3 斤苹果 */);
// ...
```

结果小区只有这一个水果店，人太多了，收银员又要称水果，又要收银记账，更新账本，忙的团团转，一直向阿大抱怨太忙了，阿大看到店铺运营能力不够，于是用上了开源社区的黑科技 `redux` 开始升级店铺：

```js
// redux 提供了创建店铺的功能
const { createStore } = require('redux');

// 创建水果店需要收银员和收银员管理的账本
const store = createStore(reducer, state);
```

此外，通过 `redux` 创建的店铺还自带**销售员** `store.dispatch`，销售员负责称水果给顾客，搞定之后就告诉收银员顾客买了几斤什么水果，很大程度的减轻了开始收银员的压力。

不仅如此，`redux` 还提供了一个功能，每服务一个顾客，都可以额外做一些事情，于是阿大就想看看每笔交易之后的账本：

```js
// 每一笔交易都记下来给阿大看
store.subscribe(() => console.log(JSON.stringify(store.getState())));
```

好，店铺升级之后，顾客又来了：

```js
// 销售员开始销售
store.dispatch(buyApple(3)); // {"apple":3}
store.dispatch(buyApple(4)); // {"apple":7}
```

店铺稳定的运营了下去，阿大心里美滋滋~

营业模型：

![](http://ox12mie1c.bkt.clouddn.com/DEMO1.png?imageView2/0/q/75%7Cwatermark/2/text/6Zi_5biM/font/5b6u6L2v6ZuF6buR/fontsize/320/fill/I0ZGRkZGRg==/dissolve/50/gravity/SouthEast/dx/20/dy/20%7Cimageslim)

> 下一篇：掘金：[Redux入门 -- 买水果生鲜](https://juejin.im/post/5ad56db7518825558c47ec91)