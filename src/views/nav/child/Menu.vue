<template>
<div class='Menus'>
  <ul>
    <li @click="member"><i class="iconfont icon-huiyuan"></i>会员开通</li>
    <li><i class="iconfont icon-xiugaimima"></i>修改密码</li>
    <li @click="exitLogin"><i class="iconfont icon-tuichudenglu"></i>退出</li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'Menus',
  methods:{
    member(){
      this.$router.push('/member');
    },
    exitLogin(){
      sessionStorage.clear();
      this.$emit('reIndex');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.Menus {
  width: 150px;
  z-index: 99999;
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
i{
  font-size: 20px;
  vertical-align: middle;
  padding: 0 10px;
}
</style>
