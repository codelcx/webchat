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
- 父组件数据发生变化子组件未实时更新数据
子组件中使用watch监听父组件传递的参数

- sockjs.js控制台报错
1.node_modules/sockjs-client/dist/sock.js
2.1609注释 self.xhr.send(payload)

- 父子元素点击事件冲突
@cliclk.stop="childClick"

- 内部元素滚动至底部边缘时影响外部元素的滚动

内部元素设置
overscroll-behavior:none
overflow-y:scroll

- el-upload上传图片有大有小如何进行统一？
```
object-fit 属性指定元素的内容应该如何去适应指定容器的高度与宽度。

object-fit:container(默认) 保持原有尺寸比例

object-fit:cover
```

- 点击一个元素触发另一个元素的点击事件
```
this.$refs.icon.$el.click()
```
- 获取光标位置插入内容
```
      let el = document.querySelector("textarea");
      //获取光标位置并插入
      //插入字符串后将光标移动至插入字符串的末尾------未解决
      let start = el.value.substr(0, el.selectionStart) + emoji.i;
      let end = el.value.substring(el.selectionStart, el.length);
      el.value = start + end;
```
- 导航栏刷新后无法保持上次的选中状态
```
通过路由设置的name，在mounted中同步更改当前导航栏的选中状态
  mounted() {
    switch (this.$route.name) {
      case "social":
        this.curIndex = 0;
        break;
      case "chat":
        this.curIndex = 1;
        break;
      case "article":
        this.curIndex = 2;
        break;
      case "album":
        this.curIndex = 2;
        break;
    }
    console.log(this.curIndex);
  },
```

- 路由跳转携带参数为对象
不能直接传递对象需要使用JSON.stringfy转换为字符串
取得时候JSON.parse转换为JSON对象

一般使用parmas传参，与query不同的是使用name而不是path
```
{
  name:'complaint;,
  path:'/complaint/:data',//参数显示url，刷线页面数据不丢失
  compontent:Complaint
}

this.$router.push({
  name:'complaint',
  params: {
    data:JSON.stringify(article)
  },
});
```
- 循环不建议使用index为key
如果以index为key，则数组发生更改时，下标会发生相应的更改，要是数组末尾更改则无所谓
要是发生在数组中必然引起元素与原来下标不同，最终会更新因key不同的元素

- arry.push对象时发生覆盖
该方法时将对象的地址保存在数组里
解决方式：将对象作为临时变量
```
let list=[]
let data={}
for (let key in res) {
  //let data={} 临时变量
  data.time = key;
  data.srcList = res[key];
  list.push(data);
}
```

### 未解决
- 粘性定位生效的条件
- 容器设置flex与相对定位，其中的span绝对定位，但是却不是根据容器进行定位


