<template>
  <Vbar />
  <v-app>
    <v-main>
      <v-container>
        <RegisterForm />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import RegisterForm from "@/components/RegisterForm.vue";
import Vbar from '@/components/Vbar.vue';
</script>
