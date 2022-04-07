<template>
<div class="Person">
  <el-scrollbar height="96vh" ref="scrollbar" @scroll="scroll">
    <el-card :body-style="{ padding: 0 }" v-cloak>
      <img src="https://img1.baidu.com/it/u=2944027237,203973857&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" />
      <div class="bottom">
        <div class="base">
          <img :src="curUser.header" alt="" />
          <span>{{ curUser.username }}</span>
          <el-icon v-if="isSelf" @click="centerDialogVisible=!centerDialogVisible">
            <edit />
          </el-icon>
          <el-button round v-if="!isSelf" @click="complaint">举报</el-button>
          <el-button round v-if="isFriend && !isSelf" @click="deleteFriend">删除好友</el-button>
          <el-button round v-else-if="!isFriend && !isSelf" @click="makeFriend">加好友</el-button>
        </div>
        <div class="descript">
          <div class="tag">
            <el-tag class="mx-1" size="large" v-for="item in curUser.tags" :key="item">{{item}}</el-tag>
          </div>
          <el-icon @click="change" :class="isClass ? 'rotate' : ''">
            <arrow-up />
          </el-icon>

          <el-descriptions v-if="isShow" title="" :column="2" direction="horizontal" border>
            <el-descriptions-item :span="2" label="昵称">{{
              curUser.username
            }}</el-descriptions-item>
            <el-descriptions-item :span="2" label="性别">{{
              curUser.sex
            }}</el-descriptions-item>
            <el-descriptions-item :span="2" label="星座">{{
              curUser.star
            }}</el-descriptions-item>
            <el-descriptions-item :span="2" label="年龄">{{
              curUser.age
            }}</el-descriptions-item>

            <el-descriptions-item :span="2" label="个人简介">
              {{curUser.profil}}
            </el-descriptions-item>
            <el-descriptions-item v-if="loginUser.member===1||isSelf" :span="2" label="大学/职业">
              {{curUser.vocation}}
            </el-descriptions-item>
            <el-descriptions-item v-else :span="2" label="大学/职业">
              <span>***************</span>
            </el-descriptions-item>
            <el-descriptions-item v-if="loginUser.member===1||isSelf" :span="2" label="所在地">{{
              curUser.location
            }}</el-descriptions-item>
            <el-descriptions-item v-else :span="2" label="所在地">
              <span>***************</span>
            </el-descriptions-item>
            <el-descriptions-item v-if="loginUser.member===1||isSelf" :span="2" label="情感状态">
              {{curUser.emotion}}
            </el-descriptions-item>
            <el-descriptions-item v-else :span="2" label="情感状态">
              <span>***************</span>
            </el-descriptions-item>
            <el-descriptions-item v-if="loginUser.member===1||isSelf" :span="2" label="微信/QQ">{{
              curUser.chat
            }}</el-descriptions-item>
            <el-descriptions-item v-else :span="2" label="微信/QQ">
              <span>***************</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="nav">
          <nav :class="curIndex === index ? 'select' : ''" v-for="(item, index) in navList" :key="index" @click="navClick(item, index)">
            {{ item.name }}
          </nav>
        </div>
      </div>
    </el-card>
    <div class="box-card">
      <router-view v-slot="{ Component }">
        <transition>
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </el-scrollbar>

  <el-dialog v-model="centerDialogVisible" width="900px" top="3vh">
    <person-edit @edit="edit"></person-edit>
  </el-dialog>

</div>
</template>

<script>
import {
  getFriendById,
  makeFriend,
  deleteFriend,
  getUserById
} from "@/network/ajax";
import Essay from "views/person/child/Articles";
import Album from "views/person/child/Albums";
import PersonEdit from './child/PersonEdit';

export default {
  name: "Person",
  components: {
    Essay,
    Album,
    PersonEdit,
  },
  data() {
    return {
      loginUser: "",
      curUser: "",
      uid: "",
      fid: "",
      isShow: false,
      isClass: false,
      isFriend: false, //是否是朋友
      isSelf: false, //是否是登录者
      curIndex: 0,
      curPath: "/article",
      articleList: [],
      scrollTop: 0,
      navList: [{
          name: "文章",
          path: "/article",
        },
        {
          name: "相册",
          path: "/album",
        },
      ],
      centerDialogVisible: false
    };
  },
  created() {
    this.loginUser = JSON.parse(this.$store.state.user);
    let user = JSON.parse(this.$store.state.curUser);

    this.uid = this.loginUser.id; //登录用户ID
    this.fid = user.id; //当前用户ID

    this.getUserById();

    //判断是否是自己
    if (this.uid != this.fid && this.curUser != null) {
      this.isSelf = false; //不是自己
      getFriendById(this.uid, this.fid).then((res) => {
        //判断是否是不是朋友
        this.isFriend = res;
      });
    } else {
      this.isSelf = true;
    }
  },
  mounted() {
    // this.$refs.scrollbar.setScrollTop(this.scrollTop);
    //刷新后无法保持导航栏之前的选中状态
    switch (this.$route.name) {
      case "article":
        this.curIndex = 0;
        break;
      case "album":
        this.curIndex = 1;
        break;
    }
  },
  updated() {
    //点击回退按钮改变选中状态
    switch (this.$route.name) {
      case "article":
        this.curIndex = 0;
        break;
      case "album":
        this.curIndex = 1;
        break;
    }
  },
  methods: {
    //获取当前用户
    getUserById() {
      getUserById(this.fid).then(res => {
        this.curUser = res.data;
      })
    },

    change() {
      this.isShow = !this.isShow;
      this.isClass = !this.isClass;
    },
    navClick(item, index) {
      this.curIndex = index;
      this.$router.push({
        path: item.path,
        query: {
          id: this.curUser.id,
        },
      });
    },
    makeFriend() {
      makeFriend(this.uid, this.fid).then((res) => {
        console.log(res);
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success',
        })
      });
    },
    deleteFriend() {
      deleteFriend(this.uid, this.fid).then((res) => {
        this.isFriend = false;
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success',
        })
      });
    },
    complaint() {
      window.sessionStorage.setItem("complaint", JSON.stringify(this.curUser));
      this.$router.push({
        name: "complaint",
        // path: "/complaint",
      });
    },
    scroll({
      scrollTop
    }) {
      this.scrollTop = scrollTop;
      // console.log(this.scrollTop);
    },
    //修改资料成功
    edit() {
      this.getUserById()
    }
  },
};
</script>

<style scoped>
[v-cloak] {
  display: none !important;
  ;
}

.Person {
  position: relative;
}

.el-dialog {
  position: absolute;
  overflow: hidden;
}

.box-card {
  width: 100%;
  margin-top: 6px;
}

.el-card {
  width: 100%;
  margin: 0;
  border: 0;
}

.el-card img {
  width: 100%;
  height: 260px;
}

.base {
  position: relative;
}

.base .el-icon {
  font-size: 26px;
  position: relative;
  cursor: pointer;
  vertical-align: top;
}

.base img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: -40px;
  margin-left: 40px;
}

.base span {
  position: relative;
  font-size: 25px;
  vertical-align: top;
}

.base .el-button {
  width: 100px;
  height: 45px;
  margin: 8px 20px 0 0;

  float: right;
  position: relative;
}

.rotate {
  transform: rotateZ(180deg);
}

.descript .tag {
  margin-left: 40px;
  margin-bottom: 10px;
}

.descript .tag .el-tag {
  font-size: 20px;
  margin-right: 20px;
  user-select: none;
  border-radius: 50px;
}

.descript .el-icon {
  float: right;
  font-size: 24px;
  margin-right: 30px;
  margin-top: -36px;
  cursor: pointer;
}

.el-descriptions {
  padding-left: 40px;
}

.nav {
  display: flex;
  justify-content: space-around;
  cursor: pointer;
  padding: 15px 0;
  font-size: 24px;
  border-top: 1px solid #f2f2f2;
  user-select: none;
}

.select {
  color: blue;
  border-bottom: 2px solid red;
}

:deep(.el-collapse-item__content) {
  padding: 0;
  margin: 0;
}

:deep(.el-descriptions) {
  --el-descriptions-table-border: none;
}

:deep(.el-descriptions__label.el-descriptions__cell.is-bordered-label) {
  width: 15%;
}

:deep(.el-descriptions__label.el-descriptions__cell.is-bordered-label) {
  background-color: #fff;
}

:deep(.el-descriptions__body .el-descriptions__table .el-descriptions__cell) {
  font-size: 16px;
}
</style>
