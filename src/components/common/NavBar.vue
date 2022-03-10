<template>
<div class='NavBar'>
  <div class="logo">起源</div>
  <div class="demo-tabs">
    <div :class="curIndex==index?'select':''" class="item" v-for="(item,index) in tabList" :key="index" @click="tabClick(item,index)">{{item.lable}}</div>
  </div>
  <div class="user">
    <div class="btn" v-if="!isUser">
      <div @click="login">登录</div>
    </div>
    <div v-else class="self">
      <img :src="headerImg" alt="">
    </div>
  </div>
  <div class="menu">
    <menus></menus>
  </div>

</div>
</template>

<script>
import Menus from 'common/Menu'
export default {
  name: 'NavBar',
  components: {
    Menus,
  },
  data() {
    return {
      curUser: '',
      isUser: false,
      curIndex: 0,
      tabList: [{
          lable: '社区',
          path: '/social'
        },
        {
          lable: '聊天',
          path: '/chat'
        },
        {
          lable: '我的',
          path: '/person',
        },
      ]
    }
  },
  computed: {
    headerImg() {
      let user = JSON.parse(this.$store.state.user);
      return user.header;
    }
  },
  created() {
    let user = JSON.parse(this.$store.state.user);
    if (user != null) {
      this.isUser = !this.isUser;
    }
  },
  // mounted(){
  //   this.$nextTick(()=>{
  //         let user = JSON.parse(this.$store.state.user);
  //   this.curUser = user;
  //   console.log(this.curUser);
  //   })
  // },
  methods: {
    tabClick(item, index) {
      this.curIndex = index;
      if (item.path == '/person') {
        let user = JSON.parse(this.$store.state.user);
        this.$store.commit('curUser', user);
        this.$router.push({
          path: '/article',
          query: {
            id: user.id
          }
        })
      } else {
        this.$router.push(item.path);
      }
    }
  }
}
</script>

<style lang="less" scoped>
@line-height: 45px;
@font-size: 20px;

.textLinear {
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}

.NavBar {
  position: relative;
  display: flex;
  height: @line-height;
  color: #ffffff;
  border-bottom: 1px solid transparent;
  // background-image: linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%);

  .logo {
    width: 10%;
    height: 100%;
    // background-color: blue;
    font-size: @font-size;
    line-height: @line-height;
    user-select: none;
    cursor: pointer;

    .textLinear();
    background-image: linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%);
  }

  .demo-tabs {
    width: 77%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    user-select: none;
    // background-color: red; 

    font-size: @font-size;
  }

  .item {
    margin-right: 28px;
    cursor: pointer;
    .textLinear();
    background-image: linear-gradient(to right, #b721ff 0%, #21d4fd 100%);

  }

  .select {
    background-image: linear-gradient(to right, #9be15d 0%, #00e3ae 100%);

  }

  .user {
    width: 10%;
    height: 100%;
    line-height: @line-height;
    font-size: @font-size;
    text-align: right;
    position: relative;
    cursor: pointer;

    &:hover+.menus {
      display: block;
    }

    .btn {
      cursor: pointer;
      .textLinear();
      background-image: linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%);
    }

    .self::after {
      content: '';
      position: absolute;
      top: 50%;
      height: 0;
      width: 0;
      border-style: solid;
      border-color: #757B8C transparent transparent transparent;
      border-width: 6px 6px 0 6px;

    }

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    &:hover+.menu {
      display: block;
    }
  }

  .menu {
    position: absolute;
    top: 30px;
    right: 0;
    z-index: 999;
    display: none;

    &:hover {
      display: block;
    }
  }

}
</style>
