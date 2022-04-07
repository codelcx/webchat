<template>
<div class="member">
  <el-scrollbar height="100vh">
    <el-card class="box-card">
      <template #header>
        <aside class="card-header">
          <section class="card">
            <img :src="user.header" alt="" />
            <span class="name">{{ user.username }}</span>
            <span v-if="isMember == false">您还不是会员</span>
            <span v-else>已成为会员</span>
            <el-button round v-if="isMember == false" @click="centerDialogVisible=true">开通会员</el-button>
            <el-button round v-else disabled>已开通</el-button>
          </section>
        </aside>
      </template>
      <section class="poster">
        <span>VIP</span>
        <span> 会员招募</span>
      </section>
    </el-card>

    <el-card class="nav">
      <nav>
        <i class="iconfont icon-pifu"></i>
        <span>聊天背景</span>
      </nav>
      <nav>
        <i class="iconfont icon-24gl-bubble"></i>
        <span>气泡</span>
      </nav>
      <nav>
        <i class="iconfont icon-touxiang"></i>
        <span>头像挂件</span>
      </nav>
    </el-card>

    <background :user="user" :isMember="isMember" @dialog="centerDialogVisible=true"></background>

    <el-dialog v-model="centerDialogVisible" width="900px" title="会员开通">
      <el-card class="memberOpen" :body-style="{ padding: '0px' }">
        <div slot="header">
          <section>
            <img :src="user.header" alt="" />
            <span>{{ user.username }}</span>
          </section>
        </div>
        <div>
          <aside>
            <el-card :body-style="{ padding: '0px' }" v-for="(item,index) in memberPrice" :key="item" :class="curIndex==index?'active':''" @click="priceClick(item,index)">
              <template #header>
                <div class="card-header">
                  <span>{{ item.month }}</span>
                </div>
              </template>
              <div class="price">
                <span>￥{{ item.price }}</span>
              </div>
            </el-card>
            <el-button round @click="memberOpen">立即开通</el-button>
          </aside>
        </div>
      </el-card>
    </el-dialog>
  </el-scrollbar>
</div>
</template>

<script>
import {
  memberOpen
} from '@/network/ajax'

import Background from './child/Background'
export default {
  name: "member",
  components: {
    Background
  },
  data() {
    return {
      memberPrice: [{
        month: "1个月",
        price: 10,
      }, {
        month: "3个月",
        price: 25,
      }, {
        month: "6个月",
        price: 50,
      }, {
        month: "12个月",
        price: 100,
      }],
      memberType: null,
      isMember: false,
      curIndex: 0,
      centerDialogVisible: false,
    };
  },
  computed: {
    user() {
      let user = JSON.parse(this.$store.state.user);
      this.isMember = user.member;
      return user;
    }
  },
  created() {
    // console.log('created');
    //this.user = JSON.parse(this.$store.state.user);
  },
  updated() {
    // console.log('updated');
    //this.user = JSON.parse(this.$store.state.user);
  },
  methods: {
    priceClick(item, index) {
      this.memberType = item;
      this.curIndex = index;
    },
    memberOpen() {
      if (this.memberType == null) this.memberType = this.memberPrice[0];
      memberOpen(this.user.id).then(res => {
        if (res.code == 200) {
          this.$store.commit('changeMember', true);
          this.centerDialogVisible = false;
          this.$message.success('会员已开通');
        }
      })

    }
  },
};
</script>

<style lang="less" scoped>
.member {
  width: 1200px;

  color: #ffff;
  margin: 0 auto;
}

//清除所有卡片边框白线
.el-card {
  border: 0;
}

//顶部卡片
.box-card {
  position: relative;
  height: 400px;
  margin-bottom: 10px;
  background-image: linear-gradient(to right,
      black 0%,
      #434343 20%,
      black 100%);

  //清除底部白线
  :deep(.el-card__header) {
    border-bottom: 0;
  }

  .poster {
    position: absolute;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
    font-size: 60px;

    background-image: linear-gradient(to bottom,
        #fffcfa,
        #ffefde,
        #ffe1c0,
        #ffd3a2,
        #ffc280);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.1rem;
    text-shadow: 1px 3px 1px rgba(204, 165, 165, 0.43);

    span:nth-child(2) {
      font-size: 50px;
    }
  }

  .card-header {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(-20%, -50%);
  }

  //会员开通卡片
  .card {
    width: 400px;
    height: 200px;
    background-color: #272727;

    position: relative;

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;

      position: absolute;
      top: -25px;
      left: 50%;
      transform: translate(-50%);
    }

    span {
      position: absolute;
      color: #939393;
      top: 60%;
      left: 50%;
      transform: translate(-50%);
    }

    .name {
      position: absolute;
      top: 32%;
      font-size: 30px;
      color: #ffff;
    }

    button {
      width: 300px;
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translate(-50%);
      color: black;
      background-image: linear-gradient(120deg,
          #feddae 0%,
          #f9d19a 50%,
          #f4c688 100%);
    }
  }
}

//导航栏
.nav {

  :deep(.el-card__body) {
    display: flex;
    justify-content: space-around;
  }

  i {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background-color: #F9F1E2;
    }
  }

  i {
    font-size: 30px;
  }

  nav {
    display: flex;
    flex-direction: column;
    align-items: center;

  }

}

//会员开通弹窗
.memberOpen {
  width: 100%;

  section {
    padding: 20px;
    position: relative;
    background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      vertical-align: middle;
    }

    span {
      position: relative;
      top: 10px;
      font-size: 20px;
      color: #fff;
    }
  }

  aside {
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 20px 20px 0;
    background-color: #f5f5f5;

    .active {
      background-color: #fffaf2;
    }

    .el-card {
      width: 24%;
      height: 200px;
      border-radius: 10px;
      text-align: center;

      // &:nth-child(2) {
      //   margin: 0 20px;
      // }

      span {
        user-select: none;
      }

      .card-header {
        font-size: 20px;

      }

      .price {
        position: relative;
        top: 40px;
        color: red;
        font-size: 30px;

      }
    }

    button {
      margin: 20px auto;
      width: 30%;
      height: 40px;
      background-image: linear-gradient(120deg,
          #feddae 0%,
          #f9d19a 50%,
          #f4c688 100%);

    }
  }
}
</style>
