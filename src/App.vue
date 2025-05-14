<template>
  <v-app :style="{ background: currentGradient, backgroundSize: '300% 300%', animation: `gradientBG ${animationDuration}s ease infinite` }">
    <v-main>
      <router-view v-slot="{ Component }">
        <v-fade-transition hide-on-leave>
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const animationDuration = ref(10); // 动画持续时间，单位为秒

const colors = ['#667eea', '#764ba2', '#ff758c', '#ff7eb3'];
let currentIndex = 0;
let colorChangeInterval;

const createGradient = (startColor, endColor) => {
  return `linear-gradient(135deg, ${startColor}, ${endColor})`;
};

const getCurrentGradient = () => {
  const nextIndex = (currentIndex + 1) % colors.length;
  return `linear-gradient(135deg, ${colors[currentIndex]}, ${colors[nextIndex]}, ${colors[(nextIndex + 1) % colors.length]}, ${colors[(nextIndex + 2) % colors.length]})`;
};

const changeColor = () => {
  currentIndex = (currentIndex + 1) % colors.length;
};

const currentGradient = ref(getCurrentGradient());

onMounted(() => {
  colorChangeInterval = setInterval(() => {
    changeColor();
    currentGradient.value = getCurrentGradient();
  }, animationDuration.value * 1000); // 根据动画持续时间设置间隔
});

onUnmounted(() => {
  clearInterval(colorChangeInterval);
});
</script>

<style>
@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

.v-app {
  background-size: 300% 300%;
  animation: gradientBG 10s ease infinite; /* 使用animationDuration.value来控制动画持续时间 */
}
</style>
