<template>
<div class='Articles'>
  <essay v-for="(item,index) in articleList" :key="index" :article="item" :isThumbUp="isThumbUp(item.id)"></essay>
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

</style>
