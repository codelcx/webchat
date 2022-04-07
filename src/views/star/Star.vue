<template>
<div class="Star">
  <el-scrollbar height="100vh">
    <el-card class="container" :body-style="{padding:0}">
      <star-swiper></star-swiper>
      <start-member :userList="userList"></start-member>
      <start-chat-room></start-chat-room>
    </el-card>
  </el-scrollbar>
</div>
</template>

<script>
import StarSwiper from "./child/StarSwiper.vue";
import StartChatRoom from './child/StartChatRoom.vue';
import StartMember from "./child/StartMember.vue";

import {
  getRecommendUser
} from '@/network/ajax'
export default {
  name: "Star",
  components: {
    StarSwiper,
    StartMember,
    StartChatRoom,
  },
  data() {
    return {
      userList: []
    }
  },
  computed: {
    loginUser() {
      let loginUser = JSON.parse(this.$store.state.user);
      return loginUser;
    },
  },
  created() {
    this.getRecommendUser();
  },
  updated() {
    this.getRecommendUser();
  },
  methods: {
    //获取推荐数据
    getRecommendUser() {
      getRecommendUser(this.loginUser).then(res => {
        this.userList = res.data;
      })
    },
  }

};
</script>

<style lang="less" scoped>
.el-card {
  border: 0;
  background-image: linear-gradient(to top, #dbdcd7 0%, #dddcd7 10%, #b8235a 59%, #801357 71%, #3d1635 84%, #1c1a27 100%);

}

.container {
  background-color: #F5F5F5;
}
</style>
