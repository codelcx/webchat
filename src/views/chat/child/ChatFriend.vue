<template>
<div class='ChatFriend'>
  <div class="newFriend">
    <el-table v-if="newFriendList.length != 0" :show-header="false" :data="$filters.arrRemoval(newFriendList)" style="width: 100%">
      <el-table-column>
        <template v-slot="scope">
          <!-- 开始创建会话，将选中的好友对象作为参数进行传递 -->
          <el-row>
            <el-col :span="5">
              <img :src="scope.row.header" alt="" @click="userClick(scope.row)" />
            </el-col>
            <el-col :span="11">
              <span>{{ scope.row.username }}</span>
              <span>{{ scope.row.content }}</span>
            </el-col>
            <el-col class="btn" :span="7">
              <el-button type="primary" v-if="scope.row.unReadFlag==0||scope.row.unReadFlag==1" @click="btnClick(flag=1);addFriend(scope.row)">同意</el-button>
              <el-button type="primary" v-if="scope.row.unReadFlag==0||scope.row.unReadFlag==1" @click="btnClick(flag=0);addFriend(scope.row)">拒绝</el-button>
              <el-button type="primary" v-if="scope.row.unReadFlag==2">已同意</el-button>
              <el-button type="primary" v-if="scope.row.unReadFlag==3">已拒绝</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
import {
  addFriend
} from '@/network/ajax'
export default {
  name: 'ChatFriend',
  props: ['newFriendList', 'curUserId'],
  data() {
    return {
      flag:'',
    }
  },
  methods: {
    //点击了哪个申请的用户
    userClick(user) {
      console.log(user);
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
    addFriend(applicant) {
      addFriend(applicant.uid, this.curUserId, this.flag).then(res => {
        this.$emit("refresh");
        console.log(res);
      })
    },
    btnClick(flag) {
      this.flag = flag;
    }
  }
}
</script>

<style lang="less" scoped>
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
      cursor: pointer;
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
</style>
