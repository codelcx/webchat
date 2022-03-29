<template>
<div>
  <el-card>
    <div class="background">
      <el-card :body-style="{ padding: '0px' }" v-for="item in list" :key="item">
        <img :src="item.src" alt="" />
        <el-button size="large" type="success" round v-if="user.backgroundStyle == item.style">已装扮</el-button>
        <el-button size="large" type="success" round @click="itemClick(item)" v-else>立即装扮</el-button>
      </el-card>
    </div>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'Background',
  props: ['user','isMember'],
  data() {
    return {
      list: [{
          src: require("assets/img/style1.jpeg"),
          style: "background-style1",
        },
        {
          src: require("assets/img/style2.jpeg"),
          style: "background-style2",
        },
        {
          src: require("assets/img/style3.jpeg"),
          style: "background-style3",
        },
        {
          src: require("assets/img/style4.jpeg"),
          style: "background-style4",
        },
        {
          src: require("assets/img/style5.jpeg"),
          style: "background-style5",
        },
        {
          src: require("assets/img/style6.jpeg"),
          style: "background-style6",
        },
        {
          src: require("assets/img/style7.jpeg"),
          style: "background-style7",
        },
        {
          src: require("assets/img/style8.jpeg"),
          style: "background-style8",
        },
        {
          src: require("assets/img/style9.jpeg"),
          style: 'background-style9'
        },
      ],
    }
  },
  methods: {
    itemClick(item) {
      if (this.isMember) {
        this.$store.commit('changeBackground', item.style);
      } else {
        this.$emit('dialog')
      }

      // backgroundStyle(this.user.id, item.style).then(res => {
      //   console.log(res);
      // })
    },
  }
}
</script>

<style lang="less" scoped>
.el-card {
  border: 0;
}

//背景装扮
.background {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  transform-style: preserve-3d;
  perspective: 800px;

  .el-card {
    position: relative;
    width: 32%;
    margin-bottom: 20px;
    transition: all 0.5;

    &:hover {
      box-shadow: 3px 3px 2px 2px #ccc, -2px -2px 2px 2px #ccc;
      // transform: translateZ(2px);
    }

    &:nth-child(3n-1) {
      margin-left: 2%;
      margin-right: 2%;
    }

    .el-button {
      position: absolute;
      bottom: 2%;
      left: 50%;
      transform: translate(-50%, -10px);
      background-color: #f27abf;
    }
  }

  img {
    width: 100%;
    height: 500px;
    vertical-align: middle;
  }
}
</style>
