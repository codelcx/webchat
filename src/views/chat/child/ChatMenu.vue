<template>
<div class='chatmenu'>
  <header><img v-if="headerImg != ''" :src="headerImg" alt="" /></header>
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
</template>

<script>
export default {
  name: 'ChatMenu',
  props: {
    headerImg: '', //头像地址
    comValue: '', //未读聊天数
    newValue: '', //未读好友申请数
  },
  data() {
    return {
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
    }
  },
  computed: {
    unReadValue() {
      return function (value) {
        let newValue = '';
        switch (value) {
          case 0:
            newValue = this.comValue==0?'':this.comValue;
            break;
          case 1:
            newValue = this.newValue==0?'':this.newValue;
            break;
        }
        return newValue;
      }
    }
  },
  methods: {
    menuClick(index) {
      this.curIndex = index;
      this.$emit('curMenu', index);
    },
  }
}
</script>

<style lang="less" scoped>
@menuWidth: 60px;

//左侧菜单
.chatmenu {
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
</style>
