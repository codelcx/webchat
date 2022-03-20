<template>
  <div class="Social">
    <el-scrollbar height="96vh" ref="scrollbar" @scroll="scroll">
      <sen-msg @getNewAllArticle="getAllArticle"></sen-msg>
      <div class="show">
        <essay v-for="item in articleList" :key="item" :article="item"></essay>
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
  components: {
    Essay,
    SenMsg,
  },
  data() {
    return {
      articleList: [],
      textarea: "",
      scrollTop: 0,
    };
  },
  created() {
    this.getAllArticle();
  },

  //回到该页面时保留离开该页面时滚动的位置
  updated() {
    this.$refs.scrollbar.setScrollTop(this.scrollTop);
  },

  methods: {
    getAllArticle() {
      getAllArticle().then((res) => {
        this.articleList = res.reverse();
      });
    },
    scroll({ scrollTop }) {
      this.scrollTop = scrollTop;
    },
  },
};
</script>

<style scoped>
</style>
