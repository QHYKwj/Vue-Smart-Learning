<template>
  <v-carousel v-model="model" height="90vh">
    <v-carousel-item v-for="(src) in slides" :key="src">
      <v-sheet height="100%" tile>
        <v-row align="center" class="fill-height" justify="center">
          <v-img contain :src="src" />
        </v-row>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>
<script>
  export default {
    data: () => ({
      model: 0,
      slides: [
        'https://picsum.photos/1920/1080?random',
        'public/1.jpg',
        'public/2.jpg',
        'public/3.jpg',
        'public/4.jpg',
        'public/5.jpg',
      ],
    }),
  };
</script>
<style scoped>
.full-screen-carousel {
  width: 100vw;  /* 设置宽度为视口宽度 */
  margin: 0;
  padding: 0;
}

/* 确保没有外部元素限制 */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
