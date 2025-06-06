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
  <v-navigation-drawer v-model="drawer" app>
    <v-list dense>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
      >
        <v-list-item-icon @click="handleClick(item)">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
        <v-divider />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <!--  <SmallNavigate :drawer="drawer" @toggle-drawer="drawer = !drawer"></SmallNavigate>-->
  <v-container fluid>
    <h1>Introduction</h1>
    <Introduce />
    <v-row>
      <v-col cols="11" md="4">
        <IntroduceCard />
      </v-col>
      <v-col cols="11" md="4">
        <IntroduceCard />
      </v-col>
      <v-col cols="11" md="4">
        <IntroduceCard />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import SmallNavigate from '@/layout/componets/SmallNavigate.vue';
  import Introduce from '@/layout/componets/Introduce.vue';
  import IntroduceCard from '@/layout/componets/IntroduceCard.vue';
  export default {
    components: { IntroduceCard, Introduce, SmallNavigate },
    data () {
      return {
        drawer: true,
        items: [
          { title: 'Home', icon: 'mdi-home' ,route: '/' },
          { title: 'Login', icon: 'mdi-account', route: '/login' },
          { title: 'Register', icon: 'mdi-human-greeting-variant' ,route: '/register' },
        ],
      }
    },
    methods: {
      toggleDrawer () {
        this.drawer = !this.drawer;
      },
      handleClick (item) {
        this.$router.push(item.route);
      },
    },
  }
</script>

<style scoped>
/* 你可以在这里添加自定义样式 */
</style>
