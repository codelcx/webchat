<template>
<div class='StartMember'>
  <aside>
    <section class="title">
      <span>推荐用户</span>
      <span>更多用户<el-icon>
          <arrow-right />
        </el-icon></span>
    </section>
  </aside>
  <el-card :body-style="{padding:0}" class="recommend">
    <section>
      <div v-for="item in userList" :key="item">
        <img :src="item.header" alt="" @click="userClick(item)">
        <span>{{item.username}}</span>
      </div>
    </section>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'StartMember',
  props: ['userList'],

  methods: {
    //点击头像跳转个人主页
    userClick(item) {
      this.$store.commit("curUser", item);
      this.$router.push({
        path: "/article",
        query: {
          id: item.id
        },
      });
    }
  }
}
</script>

<style lang="less" scoped>
.StartMember {
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
  //background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);
}

.title {
  display: flex;
  justify-content: space-between;

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

.recommend {
  padding: 2%;
  margin: 2% 0;

  section {
    display: flex;
    justify-content: space-around;

    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  img {
    display: block;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    cursor: pointer;
  }

  span {
    color: black;
    align-self: center;
  }

}
</style>
