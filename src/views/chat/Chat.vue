<template>
<div class="Chat">
  <el-container>
    <el-aside>
      <!--头像，用户名，已创建的会话-->
      <div class="user_self">
        <img v-if="curHeader!=''" :src="curHeader" alt="" />
        <span>{{ curUserName }}</span>
      </div>
      <!--已创建的会话-->
      <div class="user_session" v-if="session_yes.length!=0">
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
    </el-aside>
    <el-container>
      <el-header>{{ curSessionUserName }}</el-header>
      <!--消息窗口-->
      <el-main ref="message">
        <div class="msg" v-for="(item, i) in msgList" :key="i">
          <!-- 判断消息是否为当前用户发送的，是则在右边显示，否则左边显示 -->
          <img v-if="item.fromUserId === curUserId" class="r" :src="curHeader">
          <img v-else :src="toHeader" alt="" />
          <div :class="item.fromUserId === curUserId ? 'msg_right' : 'msg_left'">
            <span v-if="item.contentType===0">{{item.content}}</span>
            <img v-else-if="item.contentType===1" class="chatImg" :src="'http://localhost:1997/mimg/'+item.content" alt="">
          </div>
        </div>
      </el-main>
      <el-footer>
        <!-- 将需要发送的信心存储 -->
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
  <!-- 好友列表 -->
  <div class="aside_right">
    <div class="demo-collapse">
      <el-collapse accordion v-model="activeName">
        <el-collapse-item title="新朋友" name="1"> </el-collapse-item>
        <el-collapse-item title="好友" name="2">
          <el-table v-if="friendList.length!=0" :show-header="false" :data="friendList" style="width: 100%">
            <el-table-column>
              <template v-slot="scope">
                <!-- 开始创建会话，将选中的好友对象作为参数进行传递 -->
                <el-row @click="createSession(scope.row)">
                  <el-col :span="7">
                    <img :src="scope.row.header" alt="" width="60" height="60" />
                  </el-col>
                  <el-col :span="17">
                    <span>{{ scope.row.username }}</span>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
  <login @handLogin="Login"></login>
</div>
</template>

<script>
import Login from "common/Login";
import Emoji from "content/Emoji"
import {
  getFriendList
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
      friendList: [], //好友列表
      msgList: [], //消息列表
      currentRowId: "",
      activeName: "2",
      fileList: [],
      paramsImg: {
        id: "",
        fromUserId: ""
      }
    };
  },
  watch: {
    //监听消息数组的改变，使得每次新消息都显示在最底部
    msgList: {
      handler() {
        this.$nextTick(function () {
          let el = document.querySelector('.el-main');
          el.scrollTop = el.scrollHeight;
        })
      },
      deep: true

    }
  },
  methods: {
    //登录处理
    Login(user) {
      this.curUserName = user.username;
      this.curUserId = user.id;
      this.curHeader = user.header;
      this.getFriendList(this.curUserId);
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
      if (data instanceof Array) {
        this.session_yes = data;
      } else {
        this.msgList.push(data);
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
      this.paramsImg.fromUserId = this.curUserId
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
        contentType: 0
      };
      this.msgList.push(data);
      // console.log(data);
      this.websocket.send(this.textarea);
      this.textarea = "";
    },
    //表情
    hemoji(emoji) {
      let el = document.querySelector('textarea');
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
        contentType: 1
      };
      this.msgList.push(data);
    },
    handleError(message) {
      console.log(message);
    }
  },

};
</script>

<style lang="less" scoped>
.Chat {
  height: 100%;
  position: relative;
  left: -150px;
  box-shadow: 0 5px 10px #ccc;
}

.Chat::-webkit-scrollbar,
.el-main::-webkit-scrollbar {
  width: 0;
}

.aside_right {
  height: 100%;
  width: 300px;
  position: absolute;
  top: 0;
  padding-left: 12px;
  margin-left: 100%;
}

.el-header {
  background-color: #27C3FD;
  color: #fff;
  text-align: center;
  line-height: 60px;
}

.el-footer {
  width: 100%;
  height: 200px;
  line-height: 50px;
  padding: 0;
  position: relative;
  box-shadow: 0 5px 10px #ccc;
  background-color: #EEEE;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}

.el-aside {
  width: 300px;
  background-color: #FFFFFF;
  color: var(--el-text-color-primary);
}

.el-main {
  position: relative;
  background-color: #eeeeee;
  color: var(--el-text-color-primary);
}

.el-container {
  height: 100%;
  padding-top: 2px;
}

.user_self {
  height: 60px;
  background-color: #292B2E;
  color: #000000;
  font-size: 18px;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}

.user_self span {
  line-height: 60px;
  vertical-align: top;
  margin-left: 15px;
}

.user_self img {
  width: 60px;
  height: 60px;
}

.user_session img {
  width: 60px;
  height: 60px;
  display: block;
}

.user_session span {
  line-height: 60px;
  color: #000000;
  font-size: 16px;
}

.msg:last-child {
  margin-bottom: 0;
}

.msg {
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;
}

.msg img {
  display: block;
  width: 60px;
  height: 60px;
}

.msg .chatImg {
  display: block;
  width: 200px;
  height: 200px;
}

.msg_left,
.msg_right {
  background-color: #ffffff;
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
  margin-right: 70px;
}

.msg_right::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  top: 15px;
  right: 55px;
  border-color: transparent transparent transparent #ffffff;
  border-style: solid;
  border-width: 8px 0 8px 18px;
}

.r {
  position: relative;
  left: 92%;
}

:deep(.el-table .el-table__cell) {
  padding: 0;
  background-color: #FFFFFF;
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

:deep(.el-table__body tr:hover>td) {
  background-color: #EBEBEB !important;
}

:deep(.el-table__body tr.current-row>td) {
  background-color: #EBEBEB !important;
}

:deep(.el-textarea__inner) {
  height: 200px;
  border: 0;
  padding-top: 50px;
  font-size: 20px;
}

:deep(.el-collapse-item__content) {
  padding: 0
}

.icon {
  width: 100%;
  position: absolute;
  z-index: 999;
  display: flex;
  justify-content: flex-start;
}

i {
  font-size: 36px;
  margin-left: 8px;
}

.Emoji {
  display: none;
  position: absolute;
  top: -315px;
  left: 0;
}

.icon-biaoqing:hover .Emoji {
  display: block;
}
</style>
