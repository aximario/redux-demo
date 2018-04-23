const cat = {
  name: 'youtiao',
  age: 1,
  weight: 6
};

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