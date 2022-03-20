<template>
<div class='ChatMessage' v-if="msgList.length!=0">
  <div class="msg" v-for="(item, i) in msgList" :key="i">
    <!-- 判断消息是否为当前用户发送的，是则在右边显示，否则左边显示 -->
    <div v-if="item.contentType!=2">
      <img v-if="item.fromUserId === curUserId" class="rShow" :src="curHeader" />
      <img v-else :src="toHeader" alt="" />
      <div :class="item.fromUserId === curUserId ? 'msg_right' : 'msg_left'">
        <span v-if="item.contentType === 0">{{ item.content }}</span>
        <img v-else-if="item.contentType === 1" class="chatImg" :src="'http://localhost:1997/mimg/' + item.content" alt="" />
      </div>
    </div>

  </div>
</div>
</template>

<script>
export default {
  name: 'ChatMessage',
  props: ['curUserId', 'curHeader', 'toHeader', 'msgList'],
}
</script>

<style lang="less" scoped>
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
    border-radius: 50%;
  }

  .chatImg {
    display: block;
    width: 200px;
    height: 200px;
    border-radius: 0;
  }

  .msg_left,
  .msg_right {
    background-color: #FEFEFE;
    padding: 10px;
    border-radius: 10px;
  }

  .msg_left {
    float: left;
    margin-top: -48px;
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
    margin-top: -48px;
    margin-right: 10%;
  }

  .msg_right::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 20px;
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
</style>
