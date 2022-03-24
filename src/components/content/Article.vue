<template>
<div class="Article">
  <el-card shadow="hover" class="container">
    <div class="top">
      <img :src="article.header" alt="" @click="userClick(article)" />
      <span>{{ article.username }}</span>
      <time>{{ $filters.formatDate(article.createTime) }}</time>
      <el-icon @click="menuClick">
        <more-filled ref="icon" />
      </el-icon>
      <el-card v-if="isMenuShow" :body-style="{ padding: '0px' }">
        <ul v-if="article.uid != loginUser.id">
          <li @click="complaint(article)">举报</li>
          <li @click="complaint(article)">举报</li>
          <li @click="complaint(article)">举报</li>
        </ul>
        <ul v-else>
          <li>我的</li>
          <li>我的</li>
          <li>我的</li>
        </ul>
      </el-card>
    </div>
    <div class="middle">
      <div :class="{text:commentShow}" ref="text">
        <div :class="{ hide: !isShow}">
          <span class="btnShow" @click="showInfo" v-if="!isShow">展开</span>
          {{ article.articleText }}
          <span @click="showInfo" v-if="isHide">收起</span>
          <!-- <span @click="showInfo" v-if="!isShow">展开</span> -->
          <!-- <span @click="showInfo" v-if="isShow">收起</span> -->
        </div>
      </div>

      <div class="img" v-if="srcList.length != 0">
        <!-- v-if与v-for不能同时使用 -->
        <template v-for="(item, index) in srcList">
          <el-image :key="index" v-if="index < 6" :class="index === 5 && srcList.length > 6 ? 'mark' : ''" :src="item" :preview-src-list="srcList" @click="selectIndex(index)" :initial-index="curIndex" :hide-on-click-modal="true" :preview-teleported="true">
          </el-image>
        </template>
        <span v-if="srcList.length > 6">+{{ srcList.length - 6 }}</span>
      </div>
    </div>
    <div class="bottom" v-if="commentShow">
      <div class="ico" @click="zan">
        <i class="iconfont icon-dianzan_huaban" :class="{active:isZan}"></i>
        <span>{{tCount}}</span>
      </div>
      <div class="ico" @click="comment(article)">
        <i class="iconfont icon-pinglun"></i>
        <span>{{cCount}}</span>
      </div>
    </div>

  </el-card>
</div>
</template>

<script>
import {
  thumbUp
} from '@/network/ajax'
export default {
  name: "Article",
  props: ['article', 'isThumbUp'],
  data() {
    return {
      curUser: "", //主页的拥有者
      articleItem: null,
      srcList: [],
      curIndex: 1, //当前点击的图片
      isShow: true, //默认展开
      isHide: false, //默认不显示展开
      isMenuShow: false, //默认不显示菜单
      isReport: true, //是否举报
      isSelf: false, //是不是自己
      isZan: false, //是否点赞
      tCount: 0,
      cCount: 0,
      tagName: ["svg", 'path'],
    };
  },
  watch: {
    article: {
      handler(val) {
        this.srcList = val.articleImgList;
      }
    }
  },

  created() {
    //判断传过来的文章中是否有图片
    this.isZan = this.isThumbUp;
    this.tCount = this.article.tcount;
    this.cCount = this.article.ccount;
    if (this.article.articleImgList != null) {
      this.srcList = this.article.articleImgList;
    }

    document.addEventListener('click', e => {
      //点击以外地方隐藏
      if (this.tagName.indexOf(e.target.tagName) == -1) {
        this.isMenuShow = false;
      }
    })
  },
  computed: {
    loginUser() {
      let loginUser = JSON.parse(this.$store.state.user);
      return loginUser;
    },
    commentShow() {
      let flag = this.$route.path == '/comment' ? false : true;
      return flag;
    }
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
    });
  },
  methods: {
    menuClick() {
      this.isMenuShow = !this.isMenuShow;
    },
    selectIndex(index) {
      this.curIndex = index;
    },
    showInfo() {
      this.isShow = !this.isShow;
      this.isHide = !this.isHide;
    },
    userClick(article) {
      let userData = {
        id: article.uid,
        username: article.username,
        header: article.header,
      };
      //点击头像跳转到个人主页时，将导航栏选中第二个
      // this.$store.commit("curIndex", 2);
      this.$store.commit("curUser", userData);
      this.$router.push({
        path: "/article",
        query: {
          id: article.uid,
        },
      });
    },
    complaint(article) {
      //页面刷新参数会消失
      window.sessionStorage.setItem("complaint", JSON.stringify(article));
      this.$router.push({
        name: "complaint",
        // path: "/complaint",
      });
    },
    zan() {
      this.isZan = !this.isZan;
      this.tCount = this.isZan ? this.tCount + 1 : this.tCount - 1;
      let data = {
        uid: this.loginUser.id,
        aid: this.article.id,
        state: Number(this.isZan)
      }
      console.log(data);
      thumbUp(data).then(res => {
        console.log(res);
      })
    },
    comment(article) {
      window.sessionStorage.setItem("comment", JSON.stringify(article));
      this.$router.push({
        path: '/comment',
        query: {
          aid: article.id
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
.el-dialog {
  z-index: 9999;
}

.Article {
  position: relative;
  width: 100%;
}

.el-card {
  margin-bottom: 20px;
  position: relative;
  border-radius: 1%;
}

.container {
  width: 100%;
}

//顶部头像、事件、举报
.top {
  width: 100%;
  position: relative;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  span {
    position: relative;
    font-size: 20px;
    left: 8px;
    top: -40px;
  }

  time {
    position: relative;
    left: -68px;
    top: -14px;
    color: #af9393;
  }

  .el-icon {
    font-size: 32px;
    float: right;
  }

  .el-icon:hover {
    background-color: #fff2e5;
    border-radius: 50%;
  }

  .el-card {
    position: absolute;
    top: 24px;
    right: -20px;
    min-width: 100px;
    z-index: 9999;

    :deep(.el-card__body) {
      padding: 0;
    }

    ul {
      list-style: none;
      padding: 8px;
      margin: 0;
      line-height: 40px;
      font-size: 18px;
      text-align: left;
      user-select: none;

      li {
        padding-left: 8px;
        cursor: pointer;
      }

      li:hover {
        background-color: #f8f8fb;
      }
    }
  }
}

//中间文章文本、图片、预览
.middle {
  padding: 0 20px;

  .text {
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

    div {
      position: relative;
    }

    .btnShow {
      display: block;
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 99;
      background-color: #fff;
      border-radius: 50%;
    }

    span {
      text-align: right;
      color: #0078ff;
      z-index: 99;
      align-self: flex-end;
      cursor: pointer;
    }
  }
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
  left: 56%;
  transform: translate(-50%, -50%);

  font-size: 30px;
  color: #fff;
  z-index: 999;
  pointer-events: none;
}

.middle .img .el-image {
  position: relative;
  width: 22%;
  margin-bottom: 0.5%;
  border-radius: 6%;
}

.middle .img .el-image:nth-child(3n-1) {
  margin-right: 0.5%;
  margin-left: 0.5%;
}

.middle .img .el-image:nth-child(3n) {
  margin-right: 20%
}

:deep(.middle .el-image-viewer__canvas) {
  transform: scale(1.3);
}

:deep(.middle .el-image-viewer__actions) {
  transform: translate(-50%, -50%) scale(1.5);
}

.mark {
  background-color: #26282b;
}

.mark::before {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  background-color: #26282b;
  color: #fff;
  opacity: 0.5;
  font-size: 30px;
  pointer-events: none;
}

//底部点赞、评论标签
.bottom {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 25px;
  cursor: pointer;
  color: #a3a3a3;
  padding-right: 10%;

  .active {
    color: red
  }

  .ico {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 75px;
  }

  .ico i {
    font-size: 36px;
  }

  .ico span {
    font-size: 24px;
    text-align: left;
    padding-left: 5px;
  }

  i:hover {
    background-color: #fff2e5;
    border-radius: 50%;
  }
}
</style>
