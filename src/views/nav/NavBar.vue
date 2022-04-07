<template>
<div class="NavBar">
  <div class="logo">起缘</div>
  <div class="demo-tabs">
    <div :class="curIndex == index ? 'select' : ''" class="item" v-for="(item, index) in tabList" :key="item" @click="tabClick(item, index)">
      {{ item.name }}
    </div>
  </div>
  <div class="user">
    <div class="btn" v-if="!isUser">
      <div @click="login">登录</div>
    </div>
    <div v-else class="self">
      <img :src="headerImg" alt="" />
    </div>
  </div>
  <div class="menu">
    <menus @reIndex="reIndex"></menus>
  </div>
</div>
</template>

<script>
import Menus from "./child/Menu";
export default {
  name: "NavBar",
  components: {
    Menus,
  },
  props: ["index"],
  data() {
    return {
      curUser: "",
      isUser: false,
      curIndex: 0,
      tabList: [{
          name: '星球',
          path: '/star'
        },
        {
          name: "社区",
          path: "/social",
        },
        {
          name: "聊天",
          path: "/chat",
        },
        {
          name: "我的",
          path: "/person",
        },
      ],
    };
  },
  watch: {
    index: {
      handler(val) {
        this.curIndex = val;
      },
    },
  },
  computed: {
    headerImg() {
      let user = JSON.parse(this.$store.state.user);
      return user.header;
    },
  },
  created() {
    let user = JSON.parse(this.$store.state.user);
    if (user != null) {
      this.isUser = !this.isUser;
    }
  },
  mounted() {
    //刷新后无法保持导航栏之前的选中状态
    switch (this.$route.name) {
      case "star":
        this.curIndex = 0;break;
      case "social":
        this.curIndex = 1;
        break;
      case "chat":
        this.curIndex = 2;
        break;
      case "article":
        this.curIndex = 3;
        break;
      case "album":
        this.curIndex = 3;
        break;
    }
  },
  methods: {
    tabClick(item, index) {
      this.curIndex = index;
      // this.$emit("curIndexClick", this.curIndex);
      if (item.path == "/person") {
        let user = JSON.parse(this.$store.state.user);
        this.$store.commit("curUser", user);
        this.$router.push({
          path: "/article",
          query: {
            id: user.id,
          },
        });
      } else {
        this.$router.push(item.path);
      }
    },
    //点击退出登录时将导航栏选中为第一个
    reIndex() {
      this.curIndex = 0;
    },
  },
};
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
    background-image: linear-gradient(to top,
        #bdc2e8 0%,
        #bdc2e8 1%,
        #e6dee9 100%);
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

    &:hover+.menu {
      display: block;
      z-index: 9999;
    }

    .btn {
      cursor: pointer;
      .textLinear();
      background-image: linear-gradient(-225deg,
          #69eacb 0%,
          #eaccf8 48%,
          #6654f1 100%);
    }

    .self::after {
      content: "";
      position: absolute;
      top: 50%;
      height: 0;
      width: 0;
      border-style: solid;
      border-color: #757b8c transparent transparent transparent;
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
