<template>
<div class='Menus'>
  <ul>
    <li><el-icon><home-filled /></el-icon>修改密码</li>
    <li @click="exitLogin"><el-icon><home-filled /></el-icon>退出</li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'Menus',
  methods:{
    exitLogin(){
      sessionStorage.clear();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.Menus {
  width: 150px;
}

ul {
  list-style: none;
  padding: 0;
  color: #fff;
  line-height: 40px;
  font-size: 16px;
  text-align: left;
  user-select: none;
}

li {
  cursor: pointer;
  background-color: #40485B;
}

li:hover {
  background-color: #343B4E;
}
.el-icon{
  font-size: 20px;
  vertical-align: middle;
  padding: 0 10px;
}
</style>
