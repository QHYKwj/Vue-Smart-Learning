<template>
  <v-app-bar
    :elevation="24"
    image="https://picsum.photos/1920/1080?random"
    scroll-behavior="hide elevate fade-image"
  >
    <template #prepend>
      <v-app-bar-nav-icon @click="toggleDrawer" />
    </template>

    <v-app-bar-title>智能学习与办公系统</v-app-bar-title>

    <template #append>
      <v-btn icon="mdi-heart" />

      <v-btn icon="mdi-magnify" />

      <v-btn icon="mdi-dots-vertical" />
    </template>
  </v-app-bar>
  <SmallNavigate2 :drawer="drawer" @toggle-drawer="drawer = !drawer" />
</template>

<script>
  import SmallNavigate2 from '@/layout/componets/SmallNavigate2.vue';

  export default {
    name: 'Vbar',

    components: { SmallNavigate2 },
    data () {
      return {
        drawer: false,
      }
    },
    methods: {
      toggleDrawer () {
        this.drawer = !this.drawer;
      },
    },
  }
</script>
