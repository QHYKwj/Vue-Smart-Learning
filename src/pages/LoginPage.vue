<template>
  <Vbar />
  <v-app>
    <v-main>
      <v-container>
        <LoginForm />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import Vbar from '@/components/Vbar.vue';
  import LoginForm from '@/components/LoginForm.vue';
</script>
