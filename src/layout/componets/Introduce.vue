<template>
  <v-carousel v-model="model"
  height="90vh"
  >
    <v-carousel-item
      v-for="(color, i) in colors"
      :key="color"
    >
      <v-sheet
        :color="color"
        height="100%"
        tile
      >
        <v-row
          align="center"
          class="fill-height"
          justify="center"
        >
          <div class="text-h2">
            Slide {{ i + 1 }}
          </div>
        </v-row>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>
<script>
  export default {
    data: () => ({
      model: 0,
      colors: [
        'primary',
        'secondary',
        'yellow darken-2',
        'red',
        'orange',
      ],
    }),
  }
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
