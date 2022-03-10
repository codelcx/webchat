<template>
<div class='Home'>
  <nav-bar></nav-bar>
  <el-scrollbar height="96vh">
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive exclude="Chat,Person">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </el-scrollbar>
</div>
</template>

<script>
import NavBar from 'common/NavBar'
export default {
  name: 'Home',
  components: {
    NavBar,
  },
};
</script>

<style scoped>
.Home {
  width: 60%;
  margin: 0 auto;
}
</style>
