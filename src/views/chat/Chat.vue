<template>
<div class="chat">
  <!-- 左侧菜单 -->
  <chat-menu :headerImg="curHeader" :comValue="cValue" :newValue="fValue" @curMenu="menuClick"></chat-menu>
  <el-container class="content">
    <el-aside>
      <section :class="curIndex===0?'show':''">
        <!--已创建的会话-->
        <chat-session :sessionList="sessionList" @startSession="startSession" :curSessionId="curSessionId"></chat-session>
      </section>
      <!-- 好友申请 -->
      <section :class="curIndex===1?'show':''">
        <chat-friend :newFriendList="newFriendList" :curUserId="curUserId" @refresh="getNewFriendList"></chat-friend>
      </section>
      <!-- 好友列表 -->
      <section :class="curIndex===2?'show':''">
        <chat-friend-list :friendList="friendList" @createSession="createSession"></chat-friend-list>
      </section>
    </el-aside>
    <el-container>
      <el-header>{{ curSessionUserName }}</el-header>
      <!--消息窗口-->
      <el-main ref="message">
        <chat-message :msgList="msgList" :curUserId="curUserId" :curHeader="curHeader" :toHeader="toHeader"></chat-message>
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
import Emoji from "content/Emoji";
import {
  getFriendList,
  getNewFriendList,
  unReadCount,
  clearApply
} from "@/network/ajax";


import {
  createSession,
  getSessionAlready,
  getMsgList,
} from "@/network/websocket";

import ChatMenu from './child/ChatMenu'
import ChatFriend from './child/ChatFriend'
import ChatMessage from './child/ChatMessage'
import ChatSession from './child/ChatSession'
import ChatFriendList from './child/ChatFriendList'
export default {
  name: "Chat",
  components: {
    Emoji,
    ChatMenu,
    ChatFriend,
    ChatMessage,
    ChatSession,
    ChatFriendList
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
      sessionList: [], //已经建立的会话
      friendList: [], //好友列表,
      newFriendList: [], //申请好友列表
      msgList: [], //消息列表
      fileList: [], //上传的文件
      paramsImg: {
        id: "",
        fromUserId: "",
      }, //发图片需要携带的参数
      curIndex: 0, //显示哪个菜单
      cValue: '', //未读聊天数
      fValue: '', //未读好友申请数
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
  created() {
    //初始化登录者信息
    let user = JSON.parse(this.$store.state.user);
    this.curUserName = user.username;
    this.curUserId = user.id;
    this.curHeader = user.header;

    //初始化websocket链接
    this.initWebSocket(this.curUserId, 9999);

    //初始化未读消息
    this.unReadCount()

    //          
    this.getSessionListAlready();
  },
  methods: {
    unReadCount() {
      unReadCount(this.curUserId).then(res => {
        this.cValue = res.msgCount == 0 ? '' : res.msgCount;
        this.fValue = res.friendCount == 0 ? '' : res.friendCount;
      })
    },
    clearApply() {
      clearApply(this.curUserId).then(res => {
        // console.log(res);
      })
    },
    //点击哪个菜单
    menuClick(index) {
      this.curIndex = index;
      switch (index) {
        case 0:
          this.getSessionListAlready();
          break;
        case 1:
          this.fValue = '';
          this.clearApply();
          this.getNewFriendList();
          break;
        case 2:
          this.getFriendList();
          break;
      }
    },
    //获取已存在的会话列表
    getSessionListAlready() {
      getSessionAlready(this.curUserId).then((res) => {
        this.sessionList = res;
      });
    },
    //好友请求列表
    getNewFriendList() {
      getNewFriendList(this.curUserId).then((res) => {
        this.newFriendList = res;
      });
    },
    //获取好友列表,需要传入当前登录用户的ID
    getFriendList() {
      getFriendList(this.curUserId).then((res) => {
        // console.log(res);
        this.friendList = res;
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
      this.unReadCount();//获取未读数
      this.getSessionListAlready();//刷新会话列表显示未读数
      if (data instanceof Array) {
        this.sessionList = data;
      } else if (data != null) {
        switch (data.contentType) {
          case 0:
            this.msgList.push(data);
            break;
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

    //创建会话，点击好友时，需要获取当前用户id，好友id，好友名字
    createSession(friend) {
      createSession(friend, this.curUserId).then((res) => {
        this.getSessionListAlready();
      });
    },
    //开始会话
    startSession(session) {
      // console.log(session);
      this.curSessionId = session.id;
      this.curSessionUserName = session.toUserName;
      this.toHeader = session.toHeader;
      this.paramsImg.id = this.curSessionId;
      this.paramsImg.fromUserId = this.curUserId;

      if (this.websock != undefined) {
        this.websock.close();
      }
      this.initWebSocket(this.curUserId, this.curSessionId);
      this.getMsgList(this.curSessionId);//获取消息列表
      this.getSessionListAlready();//重新刷新会话列表
      this.cValue = this.cValue - session.unReadCount;
    },
    //获取当前会话的历史消息
    getMsgList(sessionId) {
      //sessionId和curSessionId一样
      getMsgList(sessionId).then((res) => {
        this.msgList = res;
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
  // box-shadow: 0 5px 10px #ccc;
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
  padding: 0;
  position: relative;
  box-shadow: 0 5px 10px #ccc;
  background-color: #eeee;
  // color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}

//菜单右侧的宽度
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
  min-width: 500px;
  height: 96vh;
  overflow-y: hidden;
}

@menuWidth: 60px;

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
    &:hover{
      display: block;
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
