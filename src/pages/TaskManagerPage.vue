<template>
  <Vbar2 />
  <v-app>
    <v-main>
      <v-container>
        <TaskManager />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import TaskManager from "@/components/TaskManager.vue";
import TaskTimeline from "@/components/TaskTimeline.vue";
import Vbar2 from '@/components/Vbar2.vue';
</script>
