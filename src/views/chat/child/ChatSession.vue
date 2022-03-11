<template>
<div class='ChatSession'>
  <div class="session" v-if="sessionList.length != 0">
    <el-table :highlight-current-row="true" :show-header="false" :data="sessionList" style="width: 100%">
      <el-table-column>
        <template v-slot="scope" style="width: 100%">
          <!-- 开始会话，将选中的session对象作为参数进行传递 -->
          <el-row @click="startSession(scope.row)"  :class="curSessionId===scope.row.id?'select':''">
            <el-col :span="6">
              <img :src="scope.row.toHeader" alt="" />
            </el-col>
            <el-col :span="12">
              <span>{{ scope.row.toUserName }}</span>
            </el-col>
            <el-col :span="6">
              <el-badge :value="unReadValue(scope.row)" :max="99">
              </el-badge>
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
  name: 'ChatSession',
  props: ['sessionList','curSessionId'],
    computed: {
    unReadValue() {
      return function (session) {
        let newValue = '';
        if(this.curSessionId!=session.id){
          newValue=session.unReadCount==0?'':session.unReadCount;
        }
        return newValue;
      }
    }
  },
  methods: {
    startSession(session) {
      this.$emit('startSession', session);
    }
  }
}
</script>

<style lang="less" scoped>
.session {
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

    .el-col:last-child{
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:hover {
      background-color: #493664;
    }
  }
  .select{
    background-color: #493664;
  }
}
</style>
