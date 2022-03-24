<template>
<div class='Review'>
  <div class="item" v-for="item in commentList" :key="item">
    <div class="level1">
      <div class="left">
        <img :src="item.header" alt="" class="landlord">
      </div>
      <div class="right">
        <span>{{item.username}}</span>
        {{item.content}}
        <aside><time>{{ $filters.formatDate(item.createTime) }}</time><span @click="comment($event,item)">回复</span></aside>
      </div>

      <div class="level2" v-if="item.children.length != 0">
        <div v-for="item1 in item.children" :key="item1">
          <div class="left">
            <img :src="item1.header" alt="">
          </div>
          <div class="right">
            <article v-if="item.username==item1.targetName">{{item1.username}} {{item1.content}}</article>
            <article v-else>{{item1.username}}回复<span class="target">{{item1.targetName}}</span> :{{ item1.content }}</article>
            <aside><time>{{ $filters.formatDate(item1.createTime) }}</time><span @click="comment($event,item1)">回复</span></aside>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="senMsg" ref="senMsg" v-if="isComment">
    <el-input v-model="textarea" autosize type="textarea" resize="none" :placeholder="'回复'+commentTarget" />
    <el-button type="success" round @click="submit">发送</el-button>
  </div>
</div>
</template>

<script>
import {
  senComment
} from '@/network/ajax'
export default {
  name: "Review",
  props: ["commentList"],
  data() {
    return {
      textarea: "",
      isComment: false,
      commentTarget: "",
      data: {}
    };
  },
  methods: {
    comment(e, item) {
      this.isComment = true;
      this.data = {
        uid: this.$store.getters.getUser.id,
        aid: item.aid,
        targetName: item.username,
        pid: item.id
      }
      this.$nextTick(() => {
        let el = this.$refs.senMsg;
        this.commentTarget = item.username;
        e.path[2].appendChild(el);
      });
    },
    submit() {
      this.data.content = this.textarea;

      senComment(this.data).then(res => {
      this.textarea = "";
      this.isComment = false;
      
      this.$emit("comment");
      })
    }
  },
};
</script>

<style lang="less" scoped>
.item {
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 30px;
  border-bottom: 1px solid #E5E9EF;

  .landlord {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  aside {
    color: #b3b8b9;

    span {
      cursor: pointer;

      &:hover {
        color: #42b3ed;
      }
    }

    time {
      font-size: 16px;
      padding-right: 10px;
    }
  }
}

.left {
  float: left;
  padding-bottom: 999px;
  margin-bottom: -999px;

  img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
  }
}

.right {
  margin-left: 52px;
  margin-bottom: 20px;

  display: flex;
  flex-direction: column;

  .target {
    color: #C6B6D6;
  }
}

.level2,
.level3 {
  margin-top: 20px;
}

.level2 {
  margin-left: 45px;
}

.level3 {
  mark {
    background-color: transparent;
    color: blue;
  }
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
</style>
