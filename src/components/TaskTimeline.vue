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
          v-for="event in timeline"
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
  export default {
    props: {
      taskTitle: String,
      taskDescription: String,
      picker: String,
    },
    data: () => ({
      events: [],
      input: null,
      nonce: 0,
      editingEventId: null, // 新增字段，用于跟踪正在编辑的事件
    }),

    computed: {
      timeline () {
        return this.events.slice().sort((a, b) => new Date(b.time) - new Date(a.time))
      },
    },

    methods: {
      comment () {
        const time = this.picker ? new Date(this.picker).toLocaleDateString('zh-CN') : '';
        this.events.push({
          id: this.nonce++,
          text: this.taskTitle,
          time,
          description: this.taskDescription,
        });
        this.input = null; // 清空输入框内容
      },

      edit (event) {
        this.editingEventId = event.id; // 设置正在编辑的事件ID
      },

      saveEdit (event) {
        // 保存编辑内容，这里不需要特别的逻辑，因为v-model已经双向绑定了
        this.editingEventId = null; // 清除正在编辑的事件ID，使显示恢复为原始内容
      },

      deleteEvent (event) {
        this.events = this.events.filter(e => e.id !== event.id);
      },
    },
  }
</script>
