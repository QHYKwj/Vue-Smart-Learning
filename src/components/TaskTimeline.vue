<template>
  <v-container style="max-width: 600px;">
    <v-timeline
      clipped
      dense
    >
      <v-timeline-item
        class="white--text mb-12"
        color="orange"
        fill-dot
        large
      >
        <v-btn
          class="mx-0"
          depressed
          @click="comment"
        >
          创建任务
        </v-btn>
        <!--        <template #icon>-->
        <!--          <span>JL</span>-->
        <!--        </template>-->
        <!--        <v-text-field-->
        <!--          v-model="input"-->
        <!--          flat-->
        <!--          hide-details-->
        <!--          label="Leave a comment..."-->
        <!--          solo-->
        <!--          width="200%"-->
        <!--          @keydown.enter="comment"-->
        <!--        >-->
        <!--          <template #append>-->
        <!--            <v-btn-->
        <!--              class="mx-0"-->
        <!--              depressed-->
        <!--              @click="comment"-->
        <!--            >-->
        <!--              Post-->
        <!--            </v-btn>-->
        <!--          </template>-->
        <!--        </v-text-field>-->
      </v-timeline-item>

      <v-slide-x-transition
        group
      >
        <v-timeline-item
          v-for="event in events.slice().sort((a, b) => new Date(b.time) - new Date(a.time))"
          :key="event.id"
          class="mb-4"
          :color="event.id === editingEventId ? 'blue' : 'pink'"
          small
        >
          <v-row justify="space-between">
            <v-col cols="7">
              <span v-if="event.id !== editingEventId" style="font-size: 30px; font-family: Arial, sans-serif; color: #31d6c4;" v-text="event.text" />
              <v-text-field
                v-else
                v-model="event.text"
                flat
                hide-details
                solo
              />
            </v-col>
            <v-col
              class="text-right"
              cols="5"
              v-text="event.time"
            />
          </v-row>
          <v-divider />
          <v-row
            justify="space-between"
          >
            <v-col
              cols="12"
            >
              <span v-if="event.id !== editingEventId" v-text="event.description" />
              <v-text-field
                v-else
                v-model="event.description"
                flat
                hide-details
                solo
              />
            </v-col>
            <v-col
              class="text-right"
              cols="12"
            >
              <v-row
                justify="space-between"
              >
                <v-btn
                  v-if="event.id !== editingEventId"
                  class="mr-2"
                  @click="edit(event)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  class="mr-2"
                  @click="saveEdit(event)"
                >
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-btn
                  @click="deleteEvent(event)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-slide-x-transition>
    </v-timeline>
  </v-container>
</template>

<script>
  import axios from 'axios';
  import API from '@/config/api.js';
  export default {
    props: {
      taskTitle: String,
      taskDescription: String,
      picker: String,
    },
    data: () => ({
      currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
      events: [],
      input: null,
      nonce: 0,
      editingEventId: null, // 新增字段，用于跟踪正在编辑的事件
    }),

    // computed: {
    //   timeline () {
    //     return this.events.slice().sort((a, b) => new Date(b.time) - new Date(a.time))
    //   },
    // },

    mounted () {
      this.fetchTasks();
    },

    methods: {
      fetchTasks () {
        const email = this.currentUser.email;
        axios.get(API.GET_TASKS, { params: { email } })
          .then(response => {
            console.log('获取的任务数据:', response.data);
            this.events = response.data.tasks.map((task, index) => ({
              id: index, // 使用数组的索引作为id，从0开始
              text: task.title,
              description: task.description,
              time: new Date(task.due_date).toLocaleDateString('zh-CN'),
            }));
            this.nonce = response.data.tasks.length;
          })
          .catch(error => {
            console.error('加载任务失败:', error.response?.data || error.message);
          });
      },
      comment () {
        axios.post(API.ADD_TASK, new URLSearchParams({
          email: this.currentUser.email,
          title: this.taskTitle,
          description: this.taskDescription,
          due_date: this.formatDate(this.picker),
        })).then(() => {
          this.fetchTasks(); // 保存后刷新列表
        });
        this.input = null; // 清空输入框内容
      },

      edit (event) {
        this.editingEventId = event.id; // 设置正在编辑的事件ID
      },

      saveEdit (event) {
        // 保存编辑内容，这里不需要特别的逻辑，因为v-model已经双向绑定了
        const email = this.currentUser.email;
        axios.post(API.EDIT_TASK, new URLSearchParams({
          email,
          task_index: event.id,
          title: event.text,
          description: event.description,
          due_date: this.formatDate(this.picker),
        }))
          .then(() => {
            this.editingEventId = null;
            this.fetchTasks(); // 可选：刷新列表
          })
          .catch(error => {
            console.error('编辑失败:', error.response?.data || error.message);
          });
      },

      deleteEvent (event) {
        const email = this.currentUser.email;
        axios.post(API.DELETE_TASK, new URLSearchParams({
          email,
          task_index: event.id,
        }))
          .then(() => {
            this.events = this.events.filter(e => e.id !== event.id);
          })
          .catch(error => {
            console.error('删除失败:', error.response?.data || error.message);
          });
      },
      formatDate (dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
    },
  }
</script>
