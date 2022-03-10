<template>
<div class='Album'>
  <el-card v-for="i in 2" :key="i">
    <span>2022/2/25</span>
    <div class="img">
      <el-image v-for="(item,index) in srcList" :key="index" :src=item :preview-src-list="srcList" @click="selectIndex(index)" :initial-index=curIndex fit="cover">
      </el-image>
    </div>
  </el-card>

</div>
</template>

<script>
export default {
  name: 'Album',
  data() {
    return {
      srcList: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',

      ],
      curIndex: 1
    }
  },
}
</script>

<style scoped>
.Album {
  width: 100%;
  overflow-x: hidden;
}
.el-card{
  position: relative;
}
.img {
  margin-top: 2%;
  display: flex;
  flex-wrap: wrap;
}

.img .el-image {
  width: 32.6%;
  margin-bottom: 1%;
  border-radius: 6%;
}

.el-image:nth-child(3n-1) {
  margin: 0 1% 1%;
}
</style>
