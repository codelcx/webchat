<template>
<div class="login">
  <el-form class="login-form" label-position="top" label-width="100px" style="max-width: 500px" :model="userData" @submit.native.prevent>
    <h2>用户登录</h2>
    <el-form-item label="用户名">
      <el-input v-model="userData.username" auto-complete="on" autofocus="true"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="userData.password" auto-complete="on"></el-input>
    </el-form-item>
    <el-button class="login-btn" native-type="submit" @click="handlerLogin" type="primary" round>登录</el-button>
  </el-form>
</div>
</template>

<script>
import {
  login
} from '@/network/ajax'
export default {
  name: "Login",
  data() {
    return {
      userData: {
        id: 1,
        username: "admin1",
        password: "123",
      },
    };
  },
  methods: {
    handlerLogin() {
      login(this.userData.username, this.userData.password).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success('登录成功');
          this.$store.commit('loginUser', res.data);
          this.$store.commit('curUser', res.data);
          this.$router.push('/home')
        } else {
          this.$message.error('登录失败')
        }
      })
      // this.$router.push('/home')
      // if (this.userData.username == 'admin1') {
      //   this.userData = {
      //     id: 1,
      //     username: "admin1",
      //     password: "admin1",
      //     tag: ['护肤达人', '间隙性高冷', '天然呆', '学霸脸', '喜欢电影院看电影'],
      //     sex: "男",
      //     profil: '奈何落了凡尘',
      //     header: "http://localhost:1997/himg/h1.png",
      //     member: true,
      //     location: '广西',
      //     star: '金牛座',
      //     vocation: '码农',
      //     chat: '123456789',
      //     backgroundStyle: ''
      //   }
      // } else if (this.userData.username == 'admin2') {
      //   this.userData = {
      //     id: 2,
      //     username: "admin2",
      //     password: "admin2",
      //     tag: ['护肤达人', '坚持夜跑', '短跑健将'],
      //     sex: '女',
      //     profil: '奈何落了凡尘',
      //     header: "http://localhost:1997/himg/h2.png",
      //     member: false,
      //     location: '广西',
      //     vocation: '护士',
      //     star: '双子座',
      //     chat: '123456789',
      //     backgroundStyle: 'background-style2',
      //   }
      // } else {
      //   this.userData = {
      //     id: 3,
      //     username: "admin3",
      //     password: "admin3",
      //     sex: '女',
      //     tag: ['护肤达人', '史莱姆', '王者荣耀'],
      //     header: "http://localhost:1997/himg/h3.png",
      //     member: true,
      //     profil: '奈何落了凡尘',
      //     location: '广西',
      //     vocation: '学生',
      //     star: '双鱼座',
      //     chat: '123456789',
      //     backgroundStyle: 'background-style9'
      //   }
      // }
      // this.$store.commit('loginUser', this.userData);
      // this.$store.commit('curUser', this.userData);
    }
  }
};
</script>

<style scoped>
.login {
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background-color: #324153;
  display: flex;
  justify-content: center;
  align-items: center;

  /* position: fixed;
  top: 700px;
  right: 100px; */
}

.login-form {
  position: relative;
  width: 320px;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f1f3f4;
}

.login-btn {
  position: relative;
  width: 80%;
  height: 40px;
  left: 50%;
  transform: translate(-50%);
}
</style>
