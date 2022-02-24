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
export default {
  name: "Login",
  data() {
    return {
      userData: {
        id: 1,
        username: "admin1",
        password: "admin1",
      },
    };
  },
  methods: {
    handlerLogin() {
      if (this.userData.username == 'admin1') {
        this.userData = {
          id: 1,
          username: "admin1",
          password: "admin1",
          header:"http://localhost:1997/himg/h1.png"
        }
      } else if (this.userData.username == 'admin2') {
        this.userData = {
          id: 2,
          username: "admin2",
          password: "admin2",
          header:"http://localhost:1997/himg/h2.png"
        }
      } else {
        this.userData = {
          id: 3,
          username: "admin3",
          password: "admin3",
          header:"http://localhost:1997/himg/h3.png"
        }
      }
      this.$emit('handLogin', this.userData)
    }
  }
};
</script>

<style scoped>
.login {
  z-index: 9999;
  height: 200px;
  background-color: #324153;
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 700px;
  right: -230px;
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
