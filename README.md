### 目录
- <a href="#title">项目描述</a>
- <a href="#one">使用的技术</a>
- <a href="#two">效果图展示</a>
- <a href="#three">遇到的问题</a>

#### <span id="title">项目描述</span>
该网站属于社交类型的网站，适用于不同的人群，可以分享自己的趣事，结交不同类型的朋友
该网站目前已完成的功能如下：

- 文章发布，点赞、评论、恢复、举报功能
- 个人信息修改、如用户头像、标签
- 用户推荐，根据标签推荐
- 相册查阅，根据月份展示
- 私聊、群聊、支持文字、图片、表情发送
- 加好友、删除好友、举报用户
- 未读消息显示，好友消息、添加好友消息
- 会员部分功能，开通、换聊天背景

#### <span id="one">使用的技术</span>
- vuex
- route
- axios
- less
- elementPlus
- swiper
- emoji
- ssm
- mysql
- websocket


#### <span id="two">效果图展示</span>
##### 首页效果
![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/start.png)

![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/startRoom.png)

##### 社区效果
![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/article.png)

![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/articleSend.png)

![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/articleText.png)

![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/comment.png)

![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/complatint.png)

##### 聊天效果
![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/chat.png)

##### 个人中心效果
![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/person.png)

![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/album.png)

![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/personEdit.png)

##### 会员效果
![](https://github.com/codelcx/webchat/blob/main/src/assets/img/effect/member.png)

#### <span id="three">遇到的问题</span>
##### v-for、v-if
- vue2中v-for优先级大于v-if并且可以在同一个元素中使用
- vue3中v-if优先级大于v-for且不能同时使用
```
情景1：先判断元素是否显示再循环

<template v-if="isShow">
  <span v-for="i in 5" :key="i">{{i}}</span>
</template>
```
```
情景2：先循环再判断元素是否显示，可使用计算属性配合

<span v-for="item in finish" :key="item">
{{item.task}}
</span>

computed:{
  finish(){
    return taskList.filter(t=>t.done)
  }
}

```
##### watch监听数组、对象
只会生效一次，因为无法监听深层次的属性改变
```
msgList: {
  handler() {
    this.$nextTick(function () {
      let el = document.querySelector(".el-main");
      el.scrollTop = el.scrollHeight;
    });
  },
  deep: true,
},
```

##### 遮罩层的存在导致无法点击内部元素
不允许成为鼠标事件：pointer-events：none

##### 不显示滚动条
```
.el::-webkit-scrollbar {
  width: 0;
}
```

##### sessionStorage存储对象时无法直接获取
```
window.sessionStorage.setItem('user',data);
window.sessionStorage.getItem('user')->[object object]

转换为json格式存取
window.sessionStorage.setItem('user',JSON.stringify(data))
```

##### vuex管理的信息页面刷新失效
```
state: {
  user: window.sessionStorage.getItem('user'),
}
```

##### 文字渐变
```
background-image:linear-gradient
background-clip:text;
-webkit-background-clip:text;
color:transparent;
```

##### 路由点击内容超于可视区页面偏移
```
:root{
  overflow-x:hidden
}
```

##### 重新登录另一个号时组件复用导致无法更新
```
使用计算属性，一旦数据发送改变则会调用
computed: {
  headerImg() {
    let user = JSON.parse(this.$store.state.user);
    return user.header;
  }
},
```
##### 父组件数据发生变化子组件未实时更新数据
子组件中使用watch监听父组件传递的参数

##### sockjs.js控制台报错
```
1.node_modules/sockjs-client/dist/sock.js
2.1609注释 self.xhr.send(payload)
```

##### 父子元素点击事件冲突
`@cliclk.stop="childClick" 阻止事件冒泡`

##### 内部元素滚动至底部边缘时影响外部元素的滚动
内部元素设置
```
overscroll-behavior:none
overflow-y:scroll
```

##### el-upload上传图片大小统一
```
object-fit 属性指定元素的内容应该如何去适应指定容器的高度与宽度。

object-fit:container(默认) 保持原有尺寸比例

object-fit:cover
```

##### 点击一个元素触发另一个元素的点击事件
```
this.$refs.icon.$el.click()
```
##### 获取光标位置插入内容
```
let el = document.querySelector("textarea");
//获取光标位置并插入
//插入字符串后将光标移动至插入字符串的末尾------未解决
let start = el.value.substr(0, el.selectionStart) + emoji.i;
let end = el.value.substring(el.selectionStart, el.length);
el.value = start + end;
```

##### 导航栏刷新后无法保持上次的选中状态
```
通过路由设置的name，在mounted中同步更改当前导航栏的选中状态
  mounted() {
    switch (this.$route.name) {
      case "social":this.curIndex = 0;break;
      case "chat":this.curIndex = 1;break;
      case "article":this.curIndex = 2;break;
      case "album":this.curIndex = 2;break;
    }
  },
```

##### 路由跳转携带参数为对象
不能直接传递对象需要使用JSON.stringfy转换为字符串，取得时候JSON.parse转换为JSON对象

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
##### 循环不建议使用下标为key
如果以index为key，则数组发生更改时，下标会发生相应的更改，要是数组末尾更改则无所谓
要是发生在数组中必然引起元素与原来下标不同，最终会更新因key不同的元素

##### arry.push对象时发生覆盖
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
##### updated周期不断发送请求
该周期中如果操作data中的数据则会不断触发

##### 向后台传对象时需要将代理对象进行转换
```
JSON.parse(JSON.stringfy(data))
```

##### 文字超过最大宽度时自动换行
```
word-wrap:breal-word
```

##### 图片的使用
```
<img src="~assets/img/xxx.png"> webpacke不处理,适用于相对路径
```
```
<img :src="src"> //无法正常加载
data(){
  return{
    src:"assts/img/xxx.png"
  }
}

1、import img from ;'assets/img/xxx.png'
2、data(){
  return{
    src:require("assts/img/xxx.png")
  }
}
```
```
.bg{
  background-img:url("~assets/img/xxx.png");//css中的使用
}
```

##### transform会导致内部文字模糊（未解决）


