<template>
<div class='ChatFriendList'>
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
</div>
</template>

<script>
export default {
  name: 'ChatFriendList',
  props:['friendList'],
  methods:{
    createSession(friend){
      this.$emit('createSession',friend);
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
