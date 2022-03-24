<template>
  <div class="Social">
    <el-scrollbar height="96vh" ref="scrollbar" @scroll="scroll">
      <sen-msg @getNewAllArticle="getAllArticle"></sen-msg>
      <div class="show">
        <essay
          v-for="item in articleList"
          :key="item"
          :article="item"
          :isThumbUp="isThumbUp(item.id)"
        ></essay>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { getAllArticle } from "@/network/ajax";
import Essay from "content/Article";
import SenMsg from "content/SenMsg";
export default {
  name: "Social",
  inject: ["reload"],
  components: {
    Essay,
    SenMsg,
  },
  data() {
    return {
      articleList: [], //文章
      textarea: "",
      scrollTop: 0,
      loginUser: "", //上次登录者
      newUser: "", //现在登录者
    };
  },
  // computed:{
  //   loginUser() {
  //     let loginUser = JSON.parse(this.$store.state.user);
  //     return loginUser;
  //   },
  // },
  computed: {
    isThumbUp() {
      return function (id) {
        let flag = this.thumbList.indexOf(id) == -1 ? false : true;
        return flag;
      };
    },
  },
  created() {
    //console.log("create"); //刷新重新创建
    this.loginUser = JSON.parse(this.$store.state.user);
    this.newUser = JSON.parse(this.$store.state.user);
    this.getAllArticle();
  },
  // mounted() {
  //   console.log('mounted');
  // },
  //回到该页面时保留离开该页面时滚动的位置
  updated() {
    // console.log('updated')
    //退出登录换号后组件未销毁，依旧复用，此时应判断是否是新用户进而重新请求
    this.loginUser = this.newUser; //保留上次的登录者
    this.newUser = JSON.parse(this.$store.state.user); //最新登录者
    // console.log(this.loginUser);
    // console.log(this.newUser);
    if (this.newUser.id != this.loginUser.id) {
      this.getAllArticle();
    } else {
      this.$refs.scrollbar.setScrollTop(this.scrollTop);
    }
  },

  methods: {
    getAllArticle() {
      getAllArticle(this.newUser.id).then((res) => {
        let data = res.data;
        // console.log(res);
        this.thumbList = data.thumbUp;
        this.articleList = data.articleList.reverse();
      });
    },
    scroll({ scrollTop }) {
      this.scrollTop = scrollTop;
    },
  },
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
