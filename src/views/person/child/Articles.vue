<template>
<div class='Articles'>
  <essay v-for="(item,index) in articleList" :key="index" :article="item" :isThumbUp="isThumbUp(item.id)"></essay>
  <el-card class="noArticle" v-if="articleList.length==0">
    <el-icon>
      <warning />
    </el-icon>
    <span>暂无内容</span>
  </el-card>
</div>
</template>

<script>
import {
  getArticleById,
} from '@/network/ajax'
import Essay from 'content/Article'
export default {
  name: 'Articles',
  components: {
    Essay
  },
  data() {
    return {
      curUserId: '',
      articleList: [],
      thumbList: [],
    }
  },
  computed: {
    //是否点赞
    isThumbUp() {
      return function (id) {
        let flag = this.thumbList.indexOf(id) == -1 ? false : true;
        return flag;
      }
    }
  },
  created() {
    this.curUserId = this.$route.query.id;
    this.getArticleById();
  },
  methods: {
    getArticleById() {
      getArticleById(this.curUserId).then(res => {
        let data = res.data
        this.thumbList = data.thumbUp;
        this.articleList = data.articleList.reverse();

      })
    },
  }
}
</script>

<style scoped>
.noArticle {
  width: 100%;
  height: 600px;
  text-align: center;
  line-height: 600px;
  font-size: 30px;
}
</style>
