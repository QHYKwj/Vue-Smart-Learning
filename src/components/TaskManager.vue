<template>
  <v-card id="taskPage" class="content-container" elevation="4">
    <v-card-title class="text-h5">任务管理</v-card-title>
    <v-card-subtitle>创建、分配、追踪任务。</v-card-subtitle>

    <v-card-text>
      <v-form id="createTaskForm">
        <v-text-field
          v-model="taskTitle"
          class="mb-3"
          label="任务标题"
          outlined
          placeholder="请输入任务标题"
          required
        />

        <v-row>
          <v-col cols="8">
            <v-textarea
              v-model="taskDescription"
              auto-grow
              class="mb-3"
              label="任务描述"
              outlined
              placeholder="请输入任务描述"
              required
              rows="17"
            />
          </v-col>
          <v-col cols="4">
            <v-date-picker
              v-model="picker"
              full-width
              next-icon="mdi-skip-next"
              prev-icon="mdi-skip-previous"
              year-icon="mdi-calendar-blank"
            />
          </v-col>
        </v-row>

        <v-btn
          class="mt-3"
          color="primary"
          type="submit"
          @click="createTask"
        >
          reset
        </v-btn>
      </v-form>

      <v-list id="task-list" class="mt-3">
        <!-- 任务列表将在这里显示 -->
      </v-list>
    </v-card-text>
  </v-card>
  <TaskTimeline :taskTitle="taskTitle" :taskDescription="taskDescription" :picker="picker"/>
</template>

<script>
  import TaskTimeline from "@/components/TaskTimeline.vue";

  export default {
    components: {TaskTimeline},
    data () {
      return {
        taskTitle: '',
        taskDescription: '',
        picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      }
    },
    methods: {
      createTask () {
        this.taskTitle = '';
        this.taskDescription = '';
      },
    },
  }
</script>

<style scoped>
/* 可选：添加一些间距调整 */
.v-date-picker {
  margin-top: 16px;
}
</style>
