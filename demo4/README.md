# Redux进阶 -- 优雅的处理 async action

> 本文目标：希望通过买进口水果生鲜的例子，和大家探讨一下如何优雅的处理异步的 `async action`。

## 例子：改善水果店购买流程

在上一篇文章 [Redux 入门 -- 处理 async action](https://juejin.im/post/5ad5920e6fb9a028c523afcf) 中，阿大通过请了一个采购员完成了耗时的进口商品的售卖。

但是，阿大同时也发现了一个问题：顾客要买水果生鲜的话需要找**销售员**，要买进口水果生鲜的话要找**采购员**，这样的话，顾客需要找不同的人，很麻烦。阿大想了想，能不能让顾客只找销售员，然后销售员如果有需求再找**采购员**采购呢。

阿大想到了办法，让销售员把所有的需求都告诉**采购员**，然后采购员再传递给**收银员**，这样，如果是需要采购的水果生鲜，就可以独自去处理了，这样就需要把**采购员**改成这样了：

```js
const API = store => {
  
  // 和 收银员 对接的方式
  const next = store.dispatch;
  
  // 接管销售员传来的顾客需求
  store.dispatch = action => {

    // 处理完了之后再对接 收银员
    switch (action.type) {
      case 'BUY_IMPORTED_APPLE': fetching(2000, () => next(action)); break;
      case 'BUY_IMPORTED_EGG': fetching(3000, () => next(action)); break;
      default: next(action);
    }
  }
}

API(store);
```

然后顾客来了之后就都只用找**销售员**了：

```js
store.dispatch(buyApple(3));
store.dispatch(buyImportedApple(10));
store.dispatch(buyEgg(1));
store.dispatch(buyImportedEgg(10));
store.dispatch(buyApple(4));
store.dispatch(buyImportedApple(10));
store.dispatch(buyEgg(8));
store.dispatch(buyImportedEgg(10));
// {"fruit":{"apple":3,"importedApple":0},"fresh":{"egg":0,"importedEgg":0}}
// {"fruit":{"apple":3,"importedApple":0},"fresh":{"egg":1,"importedEgg":0}}
// {"fruit":{"apple":7,"importedApple":0},"fresh":{"egg":1,"importedEgg":0}}
// {"fruit":{"apple":7,"importedApple":0},"fresh":{"egg":9,"importedEgg":0}}
// {"fruit":{"apple":7,"importedApple":10},"fresh":{"egg":9,"importedEgg":0}}
// {"fruit":{"apple":7,"importedApple":20},"fresh":{"egg":9,"importedEgg":0}}
// {"fruit":{"apple":7,"importedApple":20},"fresh":{"egg":9,"importedEgg":10}}
// {"fruit":{"apple":7,"importedApple":20},"fresh":{"egg":9,"importedEgg":20}}
```

嗯嗯，这样看起来就一致多了。阿大心里美滋滋~

## 图解：

![](http://ox12mie1c.bkt.clouddn.com/DEMO4.png?imageView2/0/q/75%7Cwatermark/2/text/6Zi_5biM/font/5b6u6L2v6ZuF6buR/fontsize/320/fill/I0ZGRkZGRg==/dissolve/50/gravity/SouthEast/dx/20/dy/20%7Cimageslim)

> 上一篇：[Redux 入门 -- 处理 async action](https://juejin.im/post/5ad5920e6fb9a028c523afcf)

> 下一篇：[Redux 进阶 -- 编写和使用中间件](https://juejin.im/post/5add5821518825671f2f5f24)