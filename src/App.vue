<template>
<div id="app">
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <canvas ref="start" id="start" height="930" width="1900"></canvas>
</div>
</template>

<script>
import NavBar from 'common/NavBar'
export default {
  components: {
    NavBar,
  },
  mounted() {
    this.startDraw()
  },

  methods: {
    startDraw() {
      let canvas = this.$refs.start;
      let context = canvas.getContext("2d");
      let starts = 1000,
        x, y, radius;

      for (let i = 0; i < starts; i++) {
        x = Math.random() * canvas.offsetWidth;
        y = Math.random() * canvas.offsetHeight;
        radius = Math.random() * 1.5;
        context.beginPath();
        context.arc(x, y, radius, 0, 360);
        context.fillStyle = "hsla(200,100%,50%,.6)";
        context.fill();
      }
    }
  }
};
</script>

<style>
#app {
  height: 100%;
  /* position: relative;
  left:50%;
  transform: translateX(-50%); */
  /* margin: 0 auto; */
}

canvas {
  background-color: #111;
  width: 100vw;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: -99;
}
</style>
