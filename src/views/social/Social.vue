<template>
<div class='Social'>
  <div class="show">
    <essay v-for="(item,index) in articleList" :key="index" :article="item"></essay>
  </div>
</div>
</template>

<script>
import {
  getAllArticle
} from '@/network/social'
import Essay from 'content/Article'
export default {
  name: 'Social',
  components: {
    Essay
  },
  data(){
    return{
      articleList:[]
    }
  },
  created() {
    this.getAllArticle()
  },
  methods: {
    getAllArticle() {
      getAllArticle().then(res => {
        this.articleList = res
      })
    },
  }
}
</script>

<style scoped>
</style>
