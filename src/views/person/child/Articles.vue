<template>
<div class='Articles'>
  <essay v-for="(item,index) in articleList" :key="index" :article="item"></essay>
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
      curUserId:'',
      articleList:[]
    }
  },
  created() {
    this.curUserId=this.$route.query.id;
    this.getArticleById();
  },
  methods: {
    getArticleById() {
        getArticleById(this.curUserId).then(res => {
        // console.log(res);
        this.articleList = res;
      })
    },
  }
}
</script>

<style scoped>

</style>
