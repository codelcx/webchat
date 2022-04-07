<template>
  <div class="StarSwiper">
    <div>
      <!-- :navigation="true" 左右箭头-->
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="0"
        :loop="true"
        :effect="'fade'"
        :pagination="{ clickable: true }"
        :autoplay="{ autoplay: true, delay: 4000 }"
      >
        <swiper-slide
          ><img src="~assets/img/skin/style4.jpeg" alt=""
        /></swiper-slide>
        <swiper-slide
          ><img src="~assets/img/skin/style5.jpeg" alt=""
        /></swiper-slide>
        <swiper-slide
          ><img src="~assets/img/skin/style6.jpeg" alt=""
        /></swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import {
  EffectFade,
  Navigation,
  Pagination,
  Scrollbar,
  Autoplay,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";
import "swiper/swiper.min.css";
import "swiper/modules/effect-fade/effect-fade.min.css";
import "swiper/modules/navigation/navigation.min.css";
import "swiper/modules/pagination/pagination.min.css";
import "swiper/modules/scrollbar/scrollbar.min.css";
export default {
  name: "StarSwiper",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [EffectFade, Navigation, Pagination, Scrollbar, Autoplay],
    };
  },
};
</script>

<style scoped>
.el-card {
  border: 0;
}

.StarSwiper img {
  display: block;
  width: 100%;
  height: 400px;
}
</style>
