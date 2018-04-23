# Redux 入门 -- 基础用法

> 掘金：[Redux 入门 -- 基础用法](https://juejin.im/post/5ad466f15188255c27226796)

> 本文目标：希望通过买水果的例子，和大家探讨下 `redux` 的基本用法，能快速入门 `redux`。

## 例子：买水果

一天，程序员阿大（化名）想要去买水果吃，发现小区周围居然没有水果店，于是就打算自己开一个水果店赚点小钱。

阿大分析了一下水果店的营业模式。其实就是处理每一位顾客的需求，然后记账看看每天的盈亏。那么抽象成程序就是**监听顾客的行为，并把每个行为的结果都记在账上**，这正好是 `redux` 所擅长的。阿大胸有成竹，说着就开始写了起来：

首先模拟顾客的购买行为：

```js
const action = {
  type: 'BUY_APPLE', // 买苹果
  payload: {
    count: 2 // 买 2 斤
  }
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
    payload: {
      count: num
    }
  }
}
```

然后是账本的结构，记录每天卖了多少斤：

```js
// 被托管的数据 state
// 账本，今天已卖的苹果：0 斤；为了简便，就只举一个例子，事实上还有很多其他水果，大家自行脑补
const state = { apple: 0 }; 
```

好了，现在顾客需求，账本都有了，那谁来记账呢？所以阿大请了一个**收银员**负责记账，并告诉他这么记账：

```js
/**
 * 监听函数 listener
 * 收银员只要知道顾客的需求就能正确的操作账本
 * @param {object} state 账本
 * @param {object} action 顾客的需求
 */
function reducer(state, action) {

  // 注册 ‘买苹果’ 事件
  // 如果有人买了苹果，加上顾客买的斤数，更新账本
  if (action.type === 'BUY_APPLE') {
    return Object.assign({}, state, {
      apple: state.apple + action.payload.count
    });
  }

  // 没注册的事件不作处理
  // 买咱们店里没有的东西，不更新账本，原样返回
  return state;
}
```

好，万事俱备，可以正式的监听顾客的购买需求并更新账本了：

```js
const { createStore } = require('redux');

// 创建水果店需要收银员（监听函数 listener）和账本（被托管的数据）
const store = createStore(reducer, state);
```

不仅如此，`redux` 还提供了一个功能，每服务一个顾客，都可以额外做一些事情，于是阿大就想看看每笔交易之后的账本：

```js
// store.getState() 可以获取最新的 state
store.subscribe(() => console.log(JSON.stringify(store.getState())));
```

好了，顾客开始来买水果了：

```js
// 触发用户购买水果的事件
// 销售员开始销售
store.dispatch(buyApple(3)); // {"apple":3}
store.dispatch(buyApple(4)); // {"apple":7}
```

店铺稳定的运营了下去，阿大心里美滋滋~

## 讲解

上面的例子涉及到了 redux 的几个概念：**action**，**action creator**，**state**，**store**。

### action

`**action**` 是行为信息的抽象，对象类型。这个对象必须有一个 `type` 属性来表示这个 action 是什么，对于对象里面的其他内容，redux 不做限制。但是推荐符合 [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action) 规范：

```js
{
  type: 'ACTION_TYPE',
  payload, // action 携带的数据
}
```

### action creator

`**action creator**` 顾名思义就是用来创建 action 的，action creator 只简单的返回 action。

```js
function createAction(num) {
  return {
    type: 'ACTION_TYPE',
    payload,
  }
}
```

### state

`**state**` 是被托管的数据，也就是每次触发监听事件，我们要操作的数据。

### reducer

reducer 是用来控制 state 改变的函数。action 描述了发生了什么，但是并不会知道相应的 state 该怎么改变。对于不同的 action，相应的 state 变化是用 reducer 来描述的。

reducer 接受两个函数，第一个是 `state`，第二个是 `action`，并返回计算之后新的 state。**reducer 必须是一个纯函数**，对于相同的输入 state 和 action，一定会返回相同的新的 state。

```js
nextState = reducer(prevState, action);
```

因为 reducer 是纯函数，所以原来的 `prevState` 并不会改变，新的 `nextState` 是一个最新的快照。

### store

`**store**` 是把上面三个元素合起来的一个大对象:

```js
{
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose,
  __DO_NOT_USE__ActionTypes
}
```

它负责：

* 托管应用的 state
* 允许通过 `store.getState()` 方法访问到托管的 state
* 允许通过 `store.dispatch()` 方法来触发 action 更新 state
* 允许通过 `store.subscribe()` 注册监听函数监听每一次的 action 触发
* 允许注销通过 `store.subscribe()` 方法注册的监听函数

```js
// 注册
const unsubscribe = store.subscribe(() => { /** do something */});

// 注销
unsubscribe();
```

## 图解：

![](http://ox12mie1c.bkt.clouddn.com/DEMO1.png?imageView2/0/q/75%7Cwatermark/2/text/6Zi_5biM/font/5b6u6L2v6ZuF6buR/fontsize/320/fill/I0ZGRkZGRg==/dissolve/50/gravity/SouthEast/dx/20/dy/20%7Cimageslim)


> 下一篇：掘金：[Redux入门 -- 买水果生鲜](https://juejin.im/post/5ad56db7518825558c47ec91)