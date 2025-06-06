<template>
  <v-card>
    <!--    <v-app-bar>-->
    <!--      <v-btn icon @click.stop="drawer = !drawer">-->
    <!--        <v-icon>mdi-menu</v-icon>-->
    <!--      </v-btn>-->
    <!--    </v-app-bar>-->

    <v-navigation-drawer
      v-model="localdrawer"
      v-model:mini-variant="mini"
      permanent
    >
      <v-list-item class="px-4">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg" />
        </v-list-item-avatar>

        <v-list-item-title>John Leider</v-list-item-title>

      </v-list-item>

      <v-divider />

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
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
  export default {
    props: {
      drawer: {
        type: Boolean,
        required: true,
      },
    },
    data () {
      return {
        localdrawer: this.drawer,
        items: [
          { title: 'Out', icon: 'mdi-exit-run' ,route: '/' },
          { title: 'Task Management', icon: 'mdi-link', route: '/task-manager' },
          { title: 'Online Chat', icon: 'mdi-chat' ,route: '/online' },
          { title: 'Video Conference', icon: 'mdi-video', route: '/video' },
          { title: 'Settings', icon: 'mdi-menu' ,route: '/settings' },
        ],
        mini: true,
      }
    },
    watch: {
      drawer (newVal) {
        this.localdrawer = newVal;
      },
    },
    methods: {
      toggleDrawer () {
        this.$emit('toggle-drawer');
      },
      handleClick (item) {
        console.log(item.title);
        this.$router.push(item.route);
      },
    },
  }
</script>
