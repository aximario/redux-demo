# Redux 入门 -- 买进口水果生鲜

> 本文目标：希望通过买进口水果生鲜的例子，和大家探讨一下如何处理异步的 `async action`。

在上一篇文章 [Redux 入门 -- 买水果生鲜](https://juejin.im/post/5ad56db7518825558c47ec91)中，阿大通过 `redux` 的 `bindReducer` 方法将水果店的业务分治成功，店铺也越做越大。以至于有顾客开始想要买一些进口的水果生鲜。

阿大考虑了一下，决定继续拓展这个店铺，从事进口商品的销售。首先是顾客的需求行为需要购买进口水果生鲜：

```diff
// 买水果 - 进口苹果
+ function buyImportedApple(num) {
+   return {
+     type: 'BUY_IMPORTED_APPLE',
+     payload: num
+   }
+ }

// 买生鲜 - 进口鸡蛋
+ function buyImportedEgg(num) {
+   return  {
+     type: 'BUY_IMPORTED_EGG',
+     payload: num
+   }
+ }
```

然后水果部和生鲜部的账本也要更新啦：

```diff
// 水果账本
 const fruitState = {
   orange: 0,
   apple: 0,
   banana: 0,
+  importedApple: 0
 };

 // 生鲜账本
 const freshState = {
   egg: 0,
   fish: 0,
   vegetable: 0,
+  importedEgg: 0
 };
```

同样的，相应部门的收银员们也要学会怎么处理进口水果生鲜的记账，他们的记账方式要改成下面这样：

```js
// 水果部收银员
function fruitReducer(state = fruitState, action) {
  
  // 如果有人买了相应的水果，更新账本
  switch (action.type) {
    case 'BUY_APPLE':
      return Object.assign({}, state, {
        apple: state.apple + action.payload
      });
    case 'BUY_IMPORTED_APPLE':
      return Object.assign({}, state, {
        importedApple: state.importedApple + action.payload
      });

    // 买其他的东西，不更新账本，原样返回
    default: return state;
  } 
}

// 生鲜部收银员
function freshReducer(state = freshState, action) {
  switch (action.type) {
    case 'BUY_EGG':
      return Object.assign({}, state, {
        egg: state.egg + action.payload
      });
    case 'BUY_IMPORTED_EGG':
      return Object.assign({}, state, {
        importedEgg: state.importedEgg + action.payload
      });
    default: return state;
  } 
}
```

可是这时候阿大发现，进口水果生鲜不能大量存在自己仓库卖，因为它们又贵又容易坏，只有当顾客需要买的时候，才能去采购这些水果生鲜，于是阿大又雇了一个**采购员**专门负责处理要买进口水果和生鲜的顾客，等到货了再通知销售员取货给顾客：

```js
// 采购商品生成器，不同的商品需要不同的时间采购
function fetchGoodsGenerator(time, action) {

  // 用延时模拟采购时间
  const timer = setTimeout(() => {
    clearTimeout(timer);

    // 采购完成，通知销售员
    store.dispatch(action);
  }, time);
}

// 采购进口苹果需要 2 天（2s）
function fetchImportedApple(action) {
  fetchGoodsGenerator(2000, action);
}

// 采购进口苹果需要 3 天（3s）
function fetchImportedEgg(action) {
  fetchGoodsGenerator(3000, action);
}

// 采购员
const API = {
  fetchImportedApple, // 采购进口苹果
  fetchImportedEgg // 采购进口鸡蛋
}
```

好了，布置完了之后，顾客开始来买水果生鲜了：

```js
// 销售员开始销售，采购员开始采购
store.dispatch(buyApple(3));
API.fetchImportedApple(buyImportedApple(10));
store.dispatch(buyEgg(1));
API.fetchImportedEgg(buyImportedEgg(10));
store.dispatch(buyApple(4));
API.fetchImportedApple(buyImportedApple(10));
store.dispatch(buyEgg(8));
API.fetchImportedEgg(buyImportedEgg(10));
// {"fruit":{"apple":3,"importedApple":0},"fresh":{"egg":0,"importedEgg":0}}
// {"fruit":{"apple":3,"importedApple":0},"fresh":{"egg":1,"importedEgg":0}}
// {"fruit":{"apple":7,"importedApple":0},"fresh":{"egg":1,"importedEgg":0}}
// {"fruit":{"apple":7,"importedApple":0},"fresh":{"egg":9,"importedEgg":0}}
// {"fruit":{"apple":7,"importedApple":10},"fresh":{"egg":9,"importedEgg":0}}
// {"fruit":{"apple":7,"importedApple":20},"fresh":{"egg":9,"importedEgg":0}}
// {"fruit":{"apple":7,"importedApple":20},"fresh":{"egg":9,"importedEgg":10}}
// {"fruit":{"apple":7,"importedApple":20},"fresh":{"egg":9,"importedEgg":20}}
```

现在水果生鲜店的进口业务也稳妥了，阿大心里美滋滋~

营业模型：

![](http://ox12mie1c.bkt.clouddn.com/DEMO3.png?imageView2/0/q/75%7Cwatermark/2/text/6Zi_5biM/font/5b6u6L2v6ZuF6buR/fontsize/320/fill/I0ZGRkZGRg==/dissolve/50/gravity/SouthEast/dx/20/dy/20%7Cimageslim)

> 掘金：[Redux入门 -- 买进口水果生鲜](https://juejin.im/post/5ad5920e6fb9a028c523afcf)