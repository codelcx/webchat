<template>
<div class="chat">
  <div class="menu">
    <header><img v-if="curHeader != ''" :src="curHeader" alt="" /></header>
    <nav>
      <ul>
        <li v-for="(item,index) in iconList" :key="index" @click="menuClick(index)" :class="index===curIndex?'active':''">
          <el-icon>
            <el-badge :value="unReadValue(index)" :max="99">
              <i class="iconfont" :class="item.icon"></i>
            </el-badge>
          </el-icon>
        </li>
      </ul>
    </nav>
  </div>
  <el-container class="content">
    <el-aside>
      <section :class="curIndex===0?'show':''">
        <!--已创建的会话-->
        <div class="session" v-if="session_yes.length != 0">
          <el-table :highlight-current-row="true" :show-header="false" :data="session_yes" style="width: 100%">
            <el-table-column>
              <template v-slot="scope" style="width: 100%">
                <!-- 开始会话，将选中的session对象作为参数进行传递 -->
                <el-row @click="startSession(scope.row)">
                  <el-col :span="6">
                    <img :src="scope.row.toHeader" alt="" />
                  </el-col>
                  <el-col :span="18">
                    <span>{{ scope.row.toUserName }}</span>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
      <section :class="curIndex===1?'show':''">
        <div class="newFriend">
          <el-table v-if="newFriendList.length != 0" :show-header="false" :data="newFriendList" style="width: 100%">
            <el-table-column>
              <template v-slot="scope">
                <!-- 开始创建会话，将选中的好友对象作为参数进行传递 -->
                <el-row @click="userClick(scope.row)">
                  <el-col :span="5">
                    <img :src="scope.row.header" alt="" />
                  </el-col>
                  <el-col :span="11">
                    <span>{{ scope.row.username }}</span>
                    <span>{{ scope.row.content }}</span>
                  </el-col>
                  <el-col class="btn" :span="7">
                    <el-button type="primary">同意</el-button>
                    <el-button type="primary">拒绝</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
      <section :class="curIndex===2?'show':''">
        <div class="friend">
          <el-table v-if="friendList.length != 0" :show-header="false" :data="friendList" style="width: 100%">
            <el-table-column>
              <template v-slot="scope">
                <!-- 开始创建会话，将选中的好友对象作为参数进行传递 -->
                <el-row @click="createSession(scope.row)">
                  <el-col :span="6">
                    <img :src="scope.row.header" alt="" />
                  </el-col>
                  <el-col :span="18">
                    <span>{{ scope.row.username }}</span>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
    </el-aside>
    <el-container>
      <el-header>{{ curSessionUserName }}</el-header>
      <!--消息窗口-->
      <el-main ref="message">
        <div class="msg" v-for="(item, i) in msgList" :key="i">
          <!-- 判断消息是否为当前用户发送的，是则在右边显示，否则左边显示 -->
          <img v-if="item.fromUserId === curUserId" class="rShow" :src="curHeader" />
          <img v-else :src="toHeader" alt="" />
          <div :class="item.fromUserId === curUserId ? 'msg_right' : 'msg_left'">
            <span v-if="item.contentType === 0">{{ item.content }}</span>
            <img v-else-if="item.contentType === 1" class="chatImg" :src="'http://localhost:1997/mimg/' + item.content" alt="" />
          </div>
        </div>
      </el-main>
      <el-footer>
        <!-- 将需要发送的信息存储 -->
        <div class="icon">
          <i class="iconfont icon-biaoqing">
            <emoji @hemoji="hemoji"></emoji>
          </i>
          <el-upload class="upload-demo" action="http://127.0.0.1:1997/chatImg" :on-success="handleSucess" :on-error="handleError" :file-list="fileList" :show-file-list="false" :data="paramsImg" list-type="picture">
            <i class="iconfont icon-tupian"></i>
          </el-upload>
        </div>
        <el-input ref="textarea" class="comments" type="textarea" placeholder="请输入内容，回车发送！" @keyup.enter.native="sendMsg" v-model="textarea" resize="none" />
      </el-footer>
    </el-container>
  </el-container>
</div>
</template>

<script>
import Login from "common/Login";
import Emoji from "content/Emoji";
import {
  getFriendList,
  getNewFriendList
} from "@/network/user";
import {
  createSession,
  getSessionAlready,
  getMsgList,
} from "@/network/websocket";

export default {
  name: "Chat",
  components: {
    Login,
    Emoji,
  },
  data() {
    return {
      curUserId: "", //当前用户的id
      curUserName: "", //当前用户的用户名
      curHeader: "", //当前用户头像
      curSessionUserName: "", //正在与其聊天的对象用户名
      curSessionId: "", //当前会话Id
      toHeader: "", //当前对方头像
      textarea: "", //将要发送的消息
      session_yes: [], //已经建立的会话
      session_no: [], //还未建立的会话
      friendList: [], //好友列表,
      newFriendList: [],//申请好友列表
      msgList: [], //消息列表
      fileList: [],//上传的文件
      paramsImg: {
        id: "",
        fromUserId: "",
      },//发图片需要携带的参数
      curIndex: 0, //显示哪个菜单
      iconList: [{
          'icon': 'icon-pinglun4'
        },
        {
          'icon': 'icon-tianjiahaoyou'
        },
        {
          'icon': 'icon-biaoqing1'
        },
      ],
      comValue: '', //未读聊天数
      newValue: '', //未读好友申请数
    };
  },
  watch: {
    //监听消息数组的改变，使得每次新消息都显示在最底部
    msgList: {
      handler() {
        this.$nextTick(function () {
          let el = document.querySelector(".el-main");
          el.scrollTop = el.scrollHeight;
        });
      },
      deep: true,
    },
  },
  computed:{
    unReadValue(){
      return function(value){
        let newValue='';
        switch(value){
          case 0:newValue=this.comValue;break;
          case 1:newValue=this.newValue;break;
        }
        return newValue;
      }
    }
  },
  created() {
    let user = JSON.parse(this.$store.state.user);
    // console.log(user);
    this.curUserName = user.username;
    this.curUserId = user.id;
    this.curHeader = user.header;

    this.initWebSocket(this.curUserId, 9999);
    this.getFriendList(this.curUserId);
    this.getNewFriendList(this.curUserId);
  },
  methods: {
    menuClick(index) {
      this.curIndex = index;
    },
    //好友请求列表
    getNewFriendList(curUserId) {
      getNewFriendList(curUserId).then((res) => {
        // console.log(res);
        this.newFriendList = res;
      });
    },
    //开始建立会话与好友交流
    userClick(user) {
      let userData = {
        id: user.uid,
        username: user.username,
        header: user.header,
      };
      this.$store.commit("curUser", userData);
      this.$router.push({
        path: "/article",
        query: {
          id: user.uid,
        },
      });
    },
    //初始化websocket
    initWebSocket(curUserId, sessionId) {
      this.websocket = new WebSocket(
        "ws://127.0.0.1:1997/websocket/" + curUserId + "/" + sessionId
      );
      this.websocket.onopen = this.websocketonopen;
      this.websocket.onerror = this.websocketonerror;
      this.websocket.onmessage = this.websocketonmessage;
      this.websocket.onclose = this.websocketclose;
    },
    websocketonopen() {
      console.log("websocket连接成功");
    },
    websocketonerror() {
      console.log("websocket连接失败");
    },
    websocketonmessage(e) {
      let data = JSON.parse(e.data);
      console.log(data);
      if (data instanceof Array) {
        this.session_yes = data;
      } else {
        switch (data.contentType) {
          case 1:
            this.msgList.push(data);
            break;
          case 2:
            this.newFriendList.push(data);
            break;
        }
      }
    },
    websocketclose(e) {
      if (this.curUserId != null) {
        if (this.curSessionId != null) {
          this.initWebSocket(this.curUserId, this.curSessionId);
        } else {
          this.initWebSocket(this.curUserId, 99999999);
        }
      }
      console.log("websocket关闭");
    },
    //获取好友列表,需要传入当前登录用户的ID
    getFriendList(curUserId) {
      getFriendList(curUserId).then((res) => {
        this.friendList = res;
        // console.log(res);
        // console.log(this.friendList);
        this.getSessionListAlready();
      });
    },
    //创建会话，点击好友时，需要获取当前用户id，好友id，好友名字
    createSession(friend) {
      createSession(friend, this.curUserId, this.curUserName).then((res) => {
        this.getSessionListAlready();
      });
    },
    //开始会话
    startSession(session) {
      this.curSessionId = session.id;
      this.curSessionUserName = session.toUserName;
      this.toHeader = session.toHeader;
      this.paramsImg.id = this.curSessionId;
      this.paramsImg.fromUserId = this.curUserId;
      if (this.websock != undefined) {
        this.websock.close();
      }
      this.initWebSocket(this.curUserId, this.curSessionId);
      this.getMsgList(this.curSessionId);
    },
    //获取已存在的会话列表
    getSessionListAlready() {
      getSessionAlready(this.curUserId).then((res) => {
        this.session_yes = res;
        // console.log(res);
      });
    },
    //获取当前会话的历史消息
    getMsgList(sessionId) {
      //sessionId和curSessionId一样
      getMsgList(sessionId).then((res) => {
        this.msgList = res;
        // console.log(res);
      });
    },
    //文本消息发送
    sendMsg() {
      if (this.curSessionId == "") {
        return this.$message.error("请选择对象");
      }
      let data = {
        fromUserId: this.curUserId, //谁发送的
        content: this.textarea, //消息内容
        contentType: 0,
      };
      this.msgList.push(data);
      // console.log(data);
      this.websocket.send(this.textarea);
      this.textarea = "";
    },
    //表情
    hemoji(emoji) {
      let el = document.querySelector("textarea");
      //获取光标位置并插入
      //插入字符串后将光标移动至插入字符串的末尾------未解决
      let start = el.value.substr(0, el.selectionStart) + emoji.i;
      let end = el.value.substring(el.selectionStart, el.length);
      el.value = start + end;
    },
    //图片发送
    handleSucess(message) {
      let data = {
        fromUserId: this.curUserId, //谁发送的
        content: message, //消息内容
        contentType: 1,
      };
      this.msgList.push(data);
    },
    handleError(message) {
      console.log(message);
    },
  },
};
</script>

<style lang="less" scoped>
.chat {
  width: 100%;
  height: 100%;
  position: relative;
  box-shadow: 0 5px 10px #ccc;
}

// 不显示滚动条
.chat::-webkit-scrollbar,
.el-main::-webkit-scrollbar {
  width: 0;
}

.aside_right {
  height: 100%;
  width: 500px;
  position: absolute;
  top: 0;
  margin-left: 100%;
  z-index: 99;
}

.aside_right img {
  cursor: pointer;
}

.el-footer {
  width: 100%;
  height: 200px;
  line-height: 50px;
  padding: 0;
  position: relative;
  box-shadow: 0 5px 10px #ccc;
  background-color: #eeee;
  // color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}

.el-aside {
  width: 300px;
  background-color: #402e58;
  // color: var(--el-text-color-primary);
}

.el-main {
  position: relative;
  background-color: #eeeeee;
  // color: var(--el-text-color-primary);
}

//右侧内容
.el-container {
  width: 95%;
  height: 96vh;
  overflow-y: hidden;
}

@menuWidth: 50px;

.content {
  margin-left: @menuWidth;
  background-color: #ffff;

  //顶部文字
  .el-header {
    background-color: #ffff;
    text-align: center;
    line-height: 60px;
    z-index: 99;
  }

  .el-aside {
    section {
      display: none;
    }

    .show {
      display: block;
    }
  }
}

//左侧菜单
.menu {
  width: @menuWidth;
  height: 96vh;
  background-color: #35244e;
  position: absolute;

  .el-badge {
    --el-badge-radius: 50%;
    --el-badge-padding: 0px;
    --el-badge-size: 10px;
    text-align: center;
  }

  :deep(.el-badge__content.is-fixed) {
    transform: translate(75%, -50%);
  }

  header {
    position: relative;
    background-color: blue;

    img {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      left: 50%;
      transform: translate(-50%);
    }
  }

  nav {
    position: relative;
    top: 40px;
    overflow: hidden;

    ul {
      width: 100%;
      list-style: none;
      margin: 0;
      padding: 0;
      box-sizing: border-box;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .active {
        box-sizing: border-box;
        border-left: 3px solid blue;
        color: #ffff;
        background-color: #3f2e58;
      }

      li {
        width: 100%;

        i {
          font-size: 30px;
          margin: 10px 0;

        }
      }
    }

    .el-icon {
      width: 100%;
      box-sizing: border-box;
      pointer-events: none;
      color: #6A5983;
    }
  }
}

//已创建的会话
.session,
.friend {
  .el-row {
    background-color: #402e58;
    overflow-x: hidden;

    img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      display: block;
      padding: 5px;
      pointer-events: none;
    }

    span {
      line-height: 40px;
      color: #ffff;
      user-select: none;
      pointer-events: none;
    }

    &:hover {
      background-color: #493664;
    }
  }
}

//消息窗口
.msg {
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }

  img {
    display: block;
    width: 60px;
    height: 60px;
  }

  .chatImg {
    display: block;
    width: 200px;
    height: 200px;
  }

  .msg_left,
  .msg_right {
    background-color: #FEFEFE;
    padding: 10px;
  }

  .msg_left {
    float: left;
    margin-top: -58px;
    margin-left: 80px;
  }

  .msg_left::before {
    content: "";
    position: absolute;
    left: 65px;
    width: 0;
    height: 0;
    border-color: transparent #ffffff transparent transparent;
    border-style: solid;
    border-width: 8px 18px 8px 0;
  }

  .msg_right {
    float: right;
    margin-top: -58px;
    margin-right: 9%;
  }

  .msg_right::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 15px;
    right: 8%;
    border-color: transparent transparent transparent #ffffff;
    border-style: solid;
    border-width: 8px 0 8px 18px;
  }

  .rShow {
    position: relative;
    left: 92%;
  }
}

//底部消息发送框
.icon {
  width: 100%;
  position: absolute;
  z-index: 999;
  display: flex;
  justify-content: flex-start;

  i {
    font-size: 36px;
    margin-left: 8px;
  }

  .icon-biaoqing:hover .Emoji {
    display: block;
  }

  .Emoji {
    display: none;
    position: absolute;
    top: -315px;
    left: 0;
  }
}

//新朋友
.newFriend {
  width: 100%;

  .el-row {
    color: #fff;
    background-color: #493664;
  }

  .el-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 12px;
    user-select: none;

    span:nth-child(2) {
      color: #ccc;
    }

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      padding: 5px;
    }
  }

  .btn {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    .el-button {
      width: 45px;
      height: 25px;
      font-size: 14px;
    }
  }

}

//el-row底部白线问题
:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  border-bottom: 0;
}

//el-table底部白线问题
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}

:deep(.el-table .el-table__cell) {
  padding: 0;
  background-color: #ffffff;
}

:deep(.el-table .cell) {
  padding: 0;
}

:deep(.el-table::before) {
  height: 0px;
}

:deep(.el-table__inner-wrapper::after) {
  height: 0;
}

:deep(.el-table__body tr:hover > td) {
  background-color: #ebebeb !important;
}

:deep(.el-table__body tr.current-row > td) {
  background-color: #ebebeb !important;
}

:deep(.el-textarea__inner) {
  height: 200px;
  border: 0;
  padding-top: 50px;
  font-size: 20px;
}

:deep(.el-collapse-item__content) {
  padding: 0;
}
</style>
