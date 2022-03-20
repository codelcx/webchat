<template>
<div class="Person">
  <el-scrollbar height="96vh" ref="scrollbar" @scroll="scroll">
    <el-card :body-style="{ padding: 0 }">
      <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" />
      <div class="bottom">
        <div class="base">
          <img :src="curUser.header" alt="" />
          <span>{{ curUser.username }}</span>
          <el-button round v-if="!isSelf" @click="complaint">举报</el-button>
          <el-button round v-if="isFriend && !isSelf" @click="deleteFriend">删除好友</el-button>
          <el-button round v-else-if="!isFriend && !isSelf" @click="makeFriend">加好友</el-button>
        </div>
        <div class="descript">
          <div class="tag">
            <el-tag class="mx-1" size="large" closable>Large</el-tag>
            <el-tag class="mx-1" size="large" closable>Large</el-tag>
            <el-tag class="mx-1" size="large" closable>Large</el-tag>
            <el-tag class="mx-1" size="large" closable>Large</el-tag>
          </div>
          <el-icon @click="change" :class="isClass ? 'rotate' : ''">
            <arrow-up />
          </el-icon>

          <el-descriptions v-if="isShow" title="" :column="2" direction="horizontal" border>
            <el-descriptions-item :span="2" label="id">{{
              curUser.id
            }}</el-descriptions-item>
            <el-descriptions-item :span="2" label="Username">{{
              curUser.username
            }}</el-descriptions-item>
            <el-descriptions-item :span="2" label="header">{{
              curUser.header
            }}</el-descriptions-item>
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
</div>
</template>

<script>
import {
  getFriendById,
  makeFriend,
  deleteFriend
} from "@/network/ajax";
import Essay from "views/person/child/Articles";
import Album from "views/person/child/Albums";
export default {
  name: "Person",
  components: {
    Essay,
    Album,
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
    };
  },
  created() {
    this.loginUser = JSON.parse(this.$store.state.user);
    this.curUser = JSON.parse(this.$store.state.curUser);

    this.uid = this.loginUser.id; //登录用户ID
    this.fid = this.curUser.id; //当前用户ID

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
      });
    },
    deleteFriend() {
      deleteFriend(this.uid, this.fid).then((res) => {
        this.isFriend = false;
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
  },
};
</script>

<style scoped>
.box-card {
  width: 100%;
  margin-top: 6px;
}

.el-card {
  width: 100%;
  margin: 0;
}

.el-card img {
  width: 100%;
  height: 260px;
}

.base {
  position: relative;
}

.base img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: -40px;
  margin-left: 40px;
}

.base span {
  position: absolute;
  font-size: 25px;
  left: 152px;
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
