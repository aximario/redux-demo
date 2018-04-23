# Redux 是什么

每当我们谈及到 **[redux](https://github.com/reactjs/redux)**，大家都会说是 **[react](https://github.com/facebook/react)** 的状态管理工具。这么说确实没错，毕竟 redux 项目也是 **[React Community](https://github.com/reactjs)** 组织下的一个子项目。而且 redux 的诞生也是和 react 这个 ui 库急需一个状态管理解决方案有很大的联系。但是 redux 和 react 并没有任何的耦合。虽然它们经常一起用，但是 redux 的用途并不局限于 react，或者说，和 react 的结合只是 redux 的使用方式之一。

那么撇开 react 不谈， redux 到底是什么呢？我们看一下这个例子。

在实际的开发当中，我们可能会碰到这样的需求：监听一个事件，当事件触发的时候，我们可以做一些想做的事情。

```js
const cat = {
  name: 'youtiao',
  age: 1,
  weight: 6
};

// 监听 'update_weight' 事件
events.on('update_weight', weight => {
  if (weight > cat.weight) {

    // 没错，要做的事情就是无情的嘲讽
    console.log('哈哈哈，你又长胖了！！');
    cat.weight = weight;
  }
});

// 触发 'update_weight' 事件
events.trigger('update_weight', { weight: 8 });

// 查看改变之后的 cat
console.log(cat);
```

开源社区有很多库可以完成这样的需求，当然，这里是讲 `redux` 的，按照剧本走，我们肯定用 `redux` 来做啦。

```js
const { createStore } = require('redux');

// 监听事件
const listener = (oldCat, action) => {

  // 注册 'update_weight' 事件
  if (action.type === 'update_weight') {
    
    // 当新的 weight 大于旧的 weight 时
    if (action.weight > oldCat.weight) {
      console.log('哈哈哈，你又长胖了！！');
      const newCat = Object.assign({}, oldCat, { weight: action.weight });
      return newCat;
    }
  }
  return oldCat;
};

// 绑定监听事件到 cat 对象上
const store = createStore(listener, cat);

// 触发 'update_weight' 事件
store.dispatch({ type: 'update_weight', weight: 8 });

// 查看触发事件之后的 cat 对象
console.log(store.getState());
```

但是！！！`redux` 是一门很**讲究**的库，虽然上面的例子跑起来没有任何问题，但是有一件事情 -- **嘲讽**：`console.log('哈哈哈，你又长胖了！！')`，不应该放在 `listener` 里面做。而是应该放到 **redux 中间件**里去做。至于什么是 **redux 中间件**和**为什么要这么麻烦**，我觉得可以在后面的文章中再和大家探讨一下，同时也欢迎大家在评论区提出自己的意见和建议。
