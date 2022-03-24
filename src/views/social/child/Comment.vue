<template>
<div class="Comment">
  <el-scrollbar height="100vh">
    <essay class="article" :article="article" :isThumbUp="false"></essay>
    <el-card class="comm">
      <div class="senMsg">
        <el-input v-model="textarea" autosize type="textarea" resize="none" placeholder="评论" />
        <el-button type="success" round @click="senComment">发送</el-button>
      </div>
      <review :commentList="commentList" @comment="comment"></review>
    </el-card>
  </el-scrollbar>
</div>
</template>

<script>
import {
  comment,
  senComment
} from "@/network/ajax";

import Essay from "content/Article";
import SenMsg from "content/SenMsg";
import Review from 'views/social/child/Review'
export default {
  name: "Comment",
  components: {
    Essay,
    SenMsg,
    Review
  },
  data() {
    return {
      aid: 0,
      article: null,
      commentList: [],
      textarea: ''
    };
  },

  created() {
    // console.log('create');
    this.article = JSON.parse(window.sessionStorage.getItem("comment"));
    this.aid = this.$route.query.aid;
    this.comment();
  },

  updated() {
    // console.log('update');
    let id = this.$route.query.aid;
    //刷新界面时无须重新请求
    if (this.aid != id) {
      this.article = JSON.parse(window.sessionStorage.getItem("comment"));
      // console.log('comment');
      this.aid = id;
      this.comment();
    }
  },
  methods: {
    comment() {
      comment(this.aid).then((res) => {
        this.commentList = res.data;
        // console.log(res);
      });
    },
    senComment() {
      let data = {
        uid: this.$store.getters.getUser.id,
        aid: this.article.id,
        content: this.textarea,
      }
      senComment(data).then(res => {
        this.textarea = "";
        this.comment();
      })
    }
  },
};
</script>

<style lang="less" scoped>
.Comment {
  width: 1200px;
  color: red;
  margin: 0 auto;
}

.article {
  position: relative;
  word-wrap: break-word;
  /* white-space: pre-wrap; */
  word-break: break-all;
  font-size: 20px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  line-height: 30px;
  cursor: default;
}

.comm {
  position: relative;
  padding: 0 20px;
}

.senMsg {
  position: relative;
  margin-bottom: 10px;

  .el-button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}

:deep(.el-textarea__inner) {
  width: 94%;
  padding: 10px;
  overflow: hidden;
}

:deep(.btnShow) {
  display: none;
}

:deep(.hide) {
  overflow: hidden;
  white-space: pre-line;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 99;
  -webkit-box-orient: vertical;
}
</style>
