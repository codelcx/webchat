<template>
<div class="Home">
  <!-- <el-scrollbar height="96vh" ref="scrollbar"> -->
  <nav-bar :index="curIndex"></nav-bar>
  <router-view v-if="isRouterAlive" v-slot="{ Component }">
    <transition>
      <keep-alive exclude="Chat,Person">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <!-- </el-scrollbar> -->
</div>
</template>

<script>
import NavBar from "content/NavBar";
export default {
  name: "Home",
  components: {
    NavBar,
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      curIndex: 0,
      isRouterAlive: true
    };
  },
  watch: {
    $route: {
      //点击社区头像来到个人主页时导航栏并非直接更改选中
      handler(route) {
        switch (route.name) {
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
      },
    },
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      })
    }
  }
};
</script>

<style scoped>
.Home {
  width: 1200px;
  margin: 0 auto;
}
</style>
