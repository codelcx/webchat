<template>
<div class="roomDetail">
  <section class="roomMsg">
    <el-card class="title" :body-style="{ padding: 0 }">
      <section>
        <span>ID:{{room.id}}</span>
        <span>{{room.roomName}}</span>
        <span @click="exitRoom">退出</span>
      </section>
    </el-card>
    <el-card class="room" ref="room">
      <section v-for="item in msgList" :key="item">
        <aside v-if="userId != item.sendId">
          <div class="left">
            <img :src="item.header" alt="" />
            <article>
              <aside><span v-if="room.uid===item.sendId" class="tag">群主</span>{{item.username}}</aside>
              <div>{{ item.msg }}</div>
            </article>
          </div>
        </aside>
        <aside v-else>
          <div class="right">
            <article>
              <aside><span v-if="room.uid===item.sendId" class="tag">群主</span>{{item.username}}</aside>
              <div>{{ item.msg }}</div>
            </article>
            <img :src="item.header" alt="" />
          </div>
        </aside>
      </section>
    </el-card>

    <el-card class="senMsg" :body-style="{ padding: 0 }">
      <section>
        <el-input v-model="message" placeholder="请输入内容" type="textarea" resize="none" @keyup.enter.native="sendMsg" :autosize="{ minRows: 3, maxRows:3}"></el-input>
      </section>
    </el-card>
  </section>

  <el-card class="member" :body-style="{paddng:0}">
    <section>
      <img :src="room.header" alt="">
      <span class="tag">群主</span>
      <span>{{room.username}}</span>
    </section>
    <aside>在线人数({{userList.length}})</aside>
    <ul>
      <li v-for="item in userList" :key="item" @click="userClick(item)">
        <img :src="item.header" alt="">
        <span>{{item.username}}</span>
      </li>
    </ul>
  </el-card>
</div>
</template>

<script>
import {
  getRoomMsg
} from "@/network/websocket";
export default {
  name: "RoomDetail",
  data() {
    return {
      message: "",
      msgList: [],
      userList: [],
      roomId: null,
      userId: null,
      msg: {},
    };
  },

  created() {
    //初始化登录者
    this.roomInit();
  },
  updated() {
    this.roomInit();
  },
  destoryed() {
    this.websocket.close();
  },
  //路由离开时
  beforeRouteLeave(to, from) {
    this.websocket.close();
  },
  watch: {
    //监听消息数组的改变，使得每次新消息都显示在最底部
    msgList: {
      handler() {
        this.$nextTick(function () {
          let el = this.$refs.room.$el;
          // let el = document.querySelector(".room");
          el.scrollTop = el.scrollHeight;
        });
      },
      deep: true,
    },
  },
  computed: {
    room() {
      let room = JSON.parse(this.$store.state.room);
      console.log(room);
      return room;
    },
    loginUser() {
      let user = this.$store.getters.getUser;
      return user;
    }

  },
  methods: {
    //房间初始化
    roomInit() {
      this.roomId = this.$route.query.id;
      this.userId = JSON.parse(this.$store.state.user).id;

      this.initWebSocket(this.roomId, this.userId);
      this.getRoomMsg();
    },

    //websocket初始化
    initWebSocket(roomId, userId) {
      this.websocket = new WebSocket(
        "ws://127.0.0.1:1997/chatRoom/" + roomId + "/" + userId
      );
      this.websocket.onopen = this.websocketonopen;
      this.websocket.onerror = this.websocketonerror;
      this.websocket.onmessage = this.websocketonmessage;
      this.websocket.onclose = this.websocketclose;
    },
    websocketonopen(e) {
      console.log("websocket连接成功");
    },
    websocketonerror() {
      console.log("websocket连接失败");
    },
    websocketclose(e) {
      console.log("websocket关闭");
    },
    websocketonmessage(e) {
      let data = JSON.parse(e.data);
      if (data instanceof Array) {
        this.userList = data;
        console.log(data);
      } else {
        this.msgList.push(data);
        this.getRoomMsg();
      }

    },

    //发送消息
    sendMsg() {
      this.websocket.send(this.message);
      this.msg = {
        username: this.loginUser.username,
        header: this.loginUser.header,
        sendId: this.userId,
        msg: this.message,
      };
      this.msgList.push(this.msg);
      this.message = "";
    },

    //退出房间
    exitRoom() {
      this.websocket.close();
      this.$router.push({
        path: "/star",
      });
    },

    //获取房间消息
    getRoomMsg() {
      getRoomMsg(this.roomId).then((res) => {
        // console.log(res);
        this.msgList = res.data;
      });
    },

    userClick(item) {
      this.$store.commit("curUser", item);
      this.$router.push({
        path: "/article",
        query: {
          id: item.id
        },
      });
    }
  },
};
</script>

<style lang="less" scoped>
.el-card {
  border: 0;
  border-radius: 0;
  background-color: #f4f4f6;
}

.roomDetail {
  width: 1200px;
  margin: 0 auto;
  position: relative;
}

//左侧内容
.roomMsg {
  margin-right: 300px;
}

//顶部消息
.title {
  padding: 10px;

  section {
    overflow: hidden;
  }

  span {
    padding: 3px;
    user-select: none;

    &:nth-child(1) {
      float: left;
      border: 1px solid red;
      color: red;
      align-self: center;
      margin-right: 20px;
    }

    &:nth-child(2) {
      float: left;
      font-size: 20px;
    }

    &:last-child {
      float: right;
      color: blue;
      cursor: pointer;
    }
  }
}

//消息窗口
.room {
  height: 90vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0;
  }

  //自己或者对方消息样式
  section {
    aside {
      overflow: hidden;
      margin: 10px 0;
    }

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    .left {
      float: left;

      article {
        float: right;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
      }

      div {
        float: right;
        max-width: 500px;
        align-self: flex-start;
        padding: 10px;
        background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
        word-break: break-all; //自动换行
      }
    }

    .right {
      float: right;

      article {
        float: left;
        display: flex;
        flex-direction: column;
        margin-right: 10px;

        aside {
          align-self: flex-end;
        }

        div {
          max-width: 500px;
          align-self: flex-end;
          padding: 10px;
          background-image: linear-gradient(to right, #fff1eb 0%, #ace0f9 100%);
          word-break: break-all; //自动换行
        }
      }
    }
  }
}

//底部消息
.senMsg {
  height: 10vh;

  section {
    height: 200px;
  }

  :deep(.el-textarea .el-textarea__inner) {
    border: 0;
    font-size: 18px;
    background-color: #f0f1f4;
    box-sizing: border-box;
    overscroll-behavior: none;

    &:focus {
      border-top: 1px solid #ff8200;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar {
      width: 5px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #00d46a;
      border: 1px solid #00c161;
    }
  }
}

.tag {
  padding: 2px;
  background-image: linear-gradient(to right, #9ad411 0%, #4ae41b 100%);
  color: #fff;
}

//右侧内容
.member {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;

  aside {
    padding: 10px;
    color: #ADADAD;
  }

  section {
    padding: 10px;
    border-bottom: 1px solid #ccc;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      vertical-align: middle;
    }

    span {
      margin-left: 5px;
    }

  }

  :deep(.el-card__body) {
    padding: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 10px;
      cursor: pointer;

      span {
        margin-left: 5px;

      }
    }

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      vertical-align: middle;
    }
  }
}
</style>
