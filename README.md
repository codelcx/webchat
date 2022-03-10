# webchat

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### 使用到的库
- elementPlus
- axios
- less

### 配置文件vue.config.js
- 该文件需要放在根目录下
- 每次更改配置文件需要停止热部署(ctrl+c),重启服务

### 已解决
- v-for、v-if无法同时使用
```<!-- v-if与v-for不能同时使用 -->
<template v-for="(item,index) in srcList">
  <el-image v-if="index<6" :key="index" :class="index===5?'mark':''" :src=item :preview-src-list="srcList" @click="selectIndex(index)" :initial-index=curIndex fit="cover" :hide-on-click-modal="true" :preview-teleported="true">
  </el-image>
</template>
```
- watch监听数组、对象只生效一次
因为无法监听深层次的属性改变，此时需要设置deep：true

- 路由跳转页面抖动
```
<router-view v-slot="{ Component }">
    <transition>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
```

- 遮罩层的存在导致无法点击内部元素-----遮罩层设置 pointer-events：none

- 点击图片预览时总是会跳到顶部
```
原先：app:router-view
      home:navList/router-view
解决：app:home/router-view
      home:navList
```

- 不显示滚动条
```
.Chat::-webkit-scrollbar,
.el-main::-webkit-scrollbar {
  width: 0;
}
```

- sessionStorage存储对象时无法直接获取
```
window.sessionStorage.setItem('user',data);
window.sessionStorage.getItem('user')->[object object]

解决方法 转换未json格式存取
window.sessionStorage.setItem('user',JSON.stringify(data))
```

- vuex管理的信息页面一旦发生刷洗则不存在
可以使用sessionlocal保存


- : Unexpected token o in JSON at position 1
JSON.parse必须是json字符串

- 文字渐变
```
background-image:linear-gradient
background-clip:text;
-webkit-background-clip:text;
color:transparent;
```

- 路由点击内容超于可视区页面左偏移
```
:root{
  overflow-x:hidden
}
```

- 退出登录重新登录另一个号时组件复用导致无法更新新用户信息
```
  computed: {
    headerImg() {
      let user = JSON.parse(this.$store.state.user);
      return user.header;
    }
  },
```
### 未解决
- 粘性定位生效的条件
- 容器设置flex与相对定位，其中的span绝对定位，但是却不是根据容器进行定位


