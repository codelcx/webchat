<template>
<div class='Album'>
  <el-card v-for="entry in dataList" :key="entry">
    <span>{{entry.time}}</span>
    <div class="img">
      <el-image v-for="(item,index) in entry.srcList" :key="item" :src="item" :preview-src-list="entry.srcList" @click="selectIndex(index)" :initial-index="curIndex" fit="cover">
      </el-image>
    </div>
  </el-card>
  <el-card class="noPhoto" v-if="dataList.length==0">
    <el-icon><warning /></el-icon>
    <span>暂无内容</span>
  </el-card>
</div>
</template>

<script>
import {
  getPhotoGraph
} from '@/network/ajax'
export default {
  name: 'Album',
  data() {
    return {
      // srcList: [
      //   'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      //   'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
      //   'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
      //   'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
      //   'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
      //   'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',

      // ],
      curIndex: 1,
      dataList: []
    }
  },
  created() {
    let id = this.$route.query.id;
    this.getPhotoGraph(id)

  },
  methods: {
    selectIndex(index) {
      this.curIndex = index;
    },
    getPhotoGraph(id) {
      getPhotoGraph(id).then(res => {
        for (let key in res.data) {
          let data = {};
          data.time = key;
          data.srcList = res.data[key].reduce((pre, next) => {
            return pre.concat(next.path);
          }, [])
          this.dataList.push(data);
        }
      })
    }
  }
}
</script>

<style scoped>
.noPhoto{
  width: 100%;
  height: 600px;
  text-align: center;
  line-height: 600px;
  font-size: 30px;
}
.Album {
  width: 100%;
  overflow-x: hidden;
}

.el-card {
  position: relative;
}

.img {
  margin-top: 2%;
  display: flex;
  flex-wrap: wrap;
}

.img .el-image {
  width: 21.6%;
  margin-bottom: 1%;
  border-radius: 6%;
}

.el-image:nth-child(2n) {
  margin: 0 .6% 1%;
}

:deep(.el-image-viewer__img) {
  height: 70vh;
}

:deep(.el-image-viewer__canvas) {
  transform: scale(1.6);
}

:deep(.el-image-viewer__actions) {
  transform: translate(-50%, -50%) scale(1.5);
}
</style>
