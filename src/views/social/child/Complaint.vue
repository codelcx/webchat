<template>
<div class='Complaint'>
  <div class="common-layout">
    <el-container>
      <el-header>
        <section v-if="isArticle">
          <header>我要投诉的是<span>{{complaint.username}}</span>发的文章</header>
          <article>
            <img :src="complaint.header" alt="">
            <aside>{{complaint.articleText}}</aside>
          </article>
        </section>
        <section v-else>
          <header>我要投诉的是<span>{{complaint.username}}</span></header>
          <article>
            <img :src="complaint.header" alt="">
          </article>
        </section>
      </el-header>
      <el-main>
        <div class="article" v-if="isArticle">
          <el-button type="primary" v-for="(item,i) in articleTag" :key="i" @click="btnClick(item)" :class="isActive(checkTag,item)?'active':''">{{item}}</el-button>
        </div>
        <div class="user" v-else>
          <el-button type="primary" v-for="(item,i) in userTag" :key="i" @click="btnClick(item)" :class="{active:isActive(checkTag,item)}">{{item}}</el-button>
        </div>
      </el-main>
      <el-footer>
        <el-button type="success" @click="submit">提交</el-button>
      </el-footer>
    </el-container>
  </div>
</div>
</template>

<script>
import {complaint} from '@/network/ajax'
export default {
  name: 'Complaint',
  data() {
    return {
      user: '',
      complaint: '',
      checkTag: [],
      isArticle: true,
      articleTag: ['政治敏感', '低俗色情', '攻击辱骂', '血腥暴力', '违法信息', '涉嫌诈骗'],
      userTag: ['聊天违规', '举报昵称', '举报头像', '举报背景图', '举报引力签']
    }
  },
  created() {
    this.user = JSON.parse(this.$store.state.user);
    this.complaint = JSON.parse(window.sessionStorage.getItem('complaint'));
    this.isArticle = this.complaint.hasOwnProperty('articleText') ? true : false;
    // console.log(this.user);
    // console.log(this.complaint);
  },
  updated() {
    console.log('updated');
    this.checkTag = [];//退出又回来时依旧保存上次的操作
    this.user = JSON.parse(this.$store.state.user);
    this.complaint = JSON.parse(window.sessionStorage.getItem('complaint'));
    this.isArticle = this.complaint.hasOwnProperty('articleText') ? true : false;
  },
  computed: {
    isActive() {
      return function (arr, value) {
        let indexOf = arr.indexOf(value);
        if (!~indexOf) {
          //不存在
          return false
        }
        return true
      }
    }
  },
  // watch:{
  //   checkTag:{
  //     deep:true,//深度监听
  //     handler(newValue,oldValue){
  //       console.log(newValue,oldValue);
  //     },
  //     immediate:false,//开始时是否自动执行一次
  //   }
  // },
  methods: {
    btnClick(value) {
      let indexOf = this.checkTag.indexOf(value);
      if (indexOf != -1) {
        //存在
        this.checkTag.splice(indexOf, 1);
      } else {
        this.checkTag.splice(this.checkTag.length, 0, value)
        // this.checkTag.push(value);

      }
    },
    submit() {
      let data={
        fromUserId:this.user.id,
        toUserId:this.isArticle?this.complaint.uid:this.complaint.id,
        articleId:this.isArticle?this.complaint.id:'',
        content:this.checkTag.toString()
      }
      console.log(data);

      complaint(data).then(res=>{
        console.log(res);
      })
    }
  }
}
</script>

<style lang="less" scoped>
.Complaint {
  width: 800px;
  height: 500px;
  margin-top: 30px;
  background-color: #fff;
  // font-size: 18px;

  position: relative;
  left: 50%;
  transform: translate(-50%);
}

.el-container {
  padding-top: 10px
}

.el-header {
  position: relative;

  header {
    span {
      color: #FF6D41;
    }
  }

  article {
    margin: 20px 0;
    display: flex;
    justify-content: flex-start;
    background-color: #F4F5F6;

    aside {
      font-size: 12px;
      line-height: 25px;
      overflow: hidden;
      white-space: pre-line;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

    }

    img {
      width: 50px;
      height: 50px;
    }
  }
}

.el-main {
  position: relative;
  margin-top: 30px;

  .article,
  .user {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    .el-button {
      width: 21%;
      margin: 10px 0;

      &:nth-child(2n) {
        margin: 10px 15px;
      }
    }

    .active {
      color: red;
    }
  }

}

.el-footer {
  padding-top: 12px;
  border-top: 1px solid #F1F1F1;
}
</style>
