<template>
<div class="StartChatRoom">
  <!-- <el-card :body-style="{padding:0}" class="chatRoom"> -->
  <div class="chatRoom">
    <aside>
      <section>
        <span>群聊派对</span>
        <span>派对大厅<el-icon>
            <arrow-right />
          </el-icon></span>
      </section>
    </aside>
    <section>
      <el-card v-for="item in roomList" :key="item" @click="roomClick(item)">
        <span>{{ item.roomName }}</span>
      </el-card>
    </section>
  </div>

  <!-- </el-card> -->
</div>
</template>

<script>
import {
  getRoomList
} from "@/network/websocket";
export default {
  name: "StartChatRoom",
  data() {
    return {
      roomList: [],
    };
  },
  created() {
    this.getRoomList();
  },
  methods: {
    getRoomList() {
      getRoomList().then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.roomList = res.data;
        }
      });
    },
    roomClick(item) {
      this.$store.commit("room", item);
      this.$router.push({
        path: "/room",
        query: {
          id: item.id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.StartChatRoom {
  margin: 3%;
}

.el-card {
  padding: 0;
  border: 0;
}

aside {
  width: 100%;
  font-size: 25px;
  line-height: 28px;
  color: #fff;

  span {
    &:first-child {
      user-select: none;
    }

    &:last-child {
      display: inline-block;
      padding-left: 15px;
      font-size: 16px;
      background-image: linear-gradient(45deg, #475353 0%, #410e26 100%);
      border-radius: 5px;
      text-align: center;
      cursor: pointer;

      .el-icon {
        vertical-align: middle;
      }
    }
  }
}

.chatRoom {
  section {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-card {
      width: 48%;
      height: 260px;
      margin: 2% 0;
      background-repeat: no-repeat;
      background-size: cover;

      span {
        position: relative;
        font-size: 30px;
        z-index: 999;
        background-color: black;
        background-image: linear-gradient(to top, #4481eb 0%, #04befe 100%);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;

      }

      &:nth-child(1) {
        background-image: url("~assets/img/room/emotion.jpeg");
      }

      &:nth-child(2) {
        background-image: url("~assets/img/room/history.jpeg");
      }

      &:nth-child(3) {
        background-image: url("~assets/img/room/cooking.jpeg");
      }

      &:nth-child(4) {
        background-image: url("~assets/img/room/cartoon.jpeg");
      }
    }

  }
}
</style>
