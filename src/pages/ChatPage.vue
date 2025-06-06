<template>
  <Vbar2 />
  <v-app>
    <v-main>
      <v-container>
        <ChatView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import ChatView from '@/components/ChatView.vue';
  import Vbar2 from '@/components/Vbar2.vue';
</script>
