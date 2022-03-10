<template>
<div class='Article'>
  <el-card>
    <div class="top">
      <img :src="article.header" alt="" @click="userClick(article)">
      <span>{{article.username}}</span>
      <time>{{$filters.formatDate(article.createTime)}}</time>
      <el-icon>
        <more-filled />
      </el-icon>
    </div>
    <div class="middle">
      <div class="text" ref="text">
        <div :class="{hide:!isShow}">
          <span class="btnShow" @click="showInfo" v-if="!isShow">展开</span>
          {{article.articleText}}
          <span @click="showInfo" v-if="isHide">收起</span>
          <!-- <span @click="showInfo" v-if="!isShow">展开</span> -->
          <!-- <span @click="showInfo" v-if="isShow">收起</span> -->
        </div>
      </div>

      <div class="img">
        <!-- v-if与v-for不能同时使用 -->
        <template v-for="(item,index) in srcList">
          <el-image :key="index" v-if="index<6" :class="index===5&&srcList.length>6?'mark':''" :src=item :preview-src-list="srcList" @click="selectIndex(index)" :initial-index=curIndex :hide-on-click-modal="true" :preview-teleported="true">
          </el-image>
        </template>
        <span v-if="srcList.length>6">+{{srcList.length-6}}</span>
      </div>
    </div>
    <div class="bottom">
      <div class="ico">
        <i class="iconfont icon-dianzan_huaban">
        </i>
        <span>1w</span>
      </div>
      <div class="ico">
        <i class="iconfont icon-pinglun">
        </i>
        <span>1w</span>
      </div>
    </div>
    <!-- <div v-html="content" class="con"></div> -->
  </el-card>
</div>
</template>

<script>
export default {
  name: 'Article',
  props: {
    article: Object
  },
  data() {
    return {
      srcList: [],
      curIndex: 1, //当前点击的图片
      isShow: true, //默认展开
      isHide: false, //默认不显示展开
    }
  },

  created() {
    // console.log(this.article);
    this.srcList = this.article.articleImgList;

  },
  mounted() {
    // let el = document.querySelector('.text');
    let el = this.$refs.text;
    this.content = el.innerHTML;

    this.$nextTick(() => {
      //获取行高
      let lineHeight = 30;
      if (this.$refs.text.offsetHeight > lineHeight * 3) {
        this.isShow = !this.isShow;
      }
    })

  },
  methods: {
    selectIndex(index) {
      this.curIndex = index;
    },
    showInfo() {
      this.isShow = !this.isShow;
      this.isHide = !this.isHide;
    },
    userClick(article) {
      // console.log(article);
      let userData = {
        id: article.uid,
        username: article.username,
        header: article.header
      }
      this.$store.commit('curUser', userData);
      this.$router.push({
        path: '/article',
        query: {
          id: article.uid
        }
      })
    }
  }
}
</script>

<style scoped>
.el-dialog {
  z-index: 9999;
}

.Article {
  width: 100%;
}

.el-card {
  margin-bottom: 20px;
  position: relative;
  border-radius: 0 0 2% 2%;
}

.top img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.top span {
  position: relative;
  font-size: 20px;
  left: 8px;
  top: -40px;
}

.top time {
  position: relative;
  left: -75px;
  top: -14px;
  color: #AF9393;
}

.top .el-icon {
  font-size: 35px;
  float: right;
}

.top .el-icon:hover {
  background-color: #FFF2E5;
  border-radius: 50%;
}

.middle {
  padding: 0 20px;
}

.middle .text {
  position: relative;
  word-wrap: break-word;
  /* white-space: pre-wrap; */
  word-break: break-all;
  font-size: 20px;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 1%;
  display: flex;
  line-height: 30px;
  cursor: default;
}

.middle .text div {
  position: relative;
}

.middle .text .btnShow {
  display: block;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 99;
  background-color: #fff;
  border-radius: 50%;

}

.middle .text span {
  text-align: right;
  color: #0078FF;
  /* background-color: blue; */
  z-index: 99;
  align-self: flex-end;
}

.hide {
  overflow: hidden;
  white-space: pre-line;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

}

.middle .img {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.middle .img span {
  position: absolute;
  top: 75%;
  left: 62.5%;
  /* bottom: 0;
  right: 0; */
  /* transform: translate(-225%, -175%); */
  transform: translate(-50%, -50%);

  font-size: 30px;
  color: #FFF;
  z-index: 999;
  pointer-events: none;
}

.middle .img .el-image {
  position: relative;
  width: 25%;
  margin-bottom: .5%;
  border-radius: 6%;
}

.middle .img .el-image:nth-child(3n-1) {
  margin-right: .5%;
  margin-left: .5%;
}

:deep(.middle .el-image-viewer__canvas) {
  transform: scale(1.6);
}

:deep(.middle .el-image-viewer__actions) {
  transform: translate(-50%, -50%) scale(1.5);

}

.mark {
  background-color: #26282B;
}

.mark::before {
  position: absolute;
  content: '';
  width: 100%;
  height: 100%;
  background-color: #26282B;
  color: #FFF;
  opacity: .5;
  font-size: 30px;

  pointer-events: none;
}

/* .mark::after {
  content: attr(data-content);
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  z-index: 99;
  color: #fff;
  font-size: 50px;
} */

.bottom {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 25px;
  cursor: pointer;
  color: #A3A3A3
}

.bottom .ico {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom .ico i {
  font-size: 36px;
}

.bottom .ico span {
  font-size: 24px;
  margin-left: 20px;
}

.bottom i:hover {
  background-color: #FFF2E5;
  border-radius: 50%;
}
</style>
