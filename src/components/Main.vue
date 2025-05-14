<template>
  <v-card>
    <v-card-title class="headline">
      主界面
    </v-card-title>
    <v-card-text class="content-container">
      <p>欢迎进入智能学习与办公系统！选择左侧菜单以访问各个功能模块。</p>
      <!-- 课表导入模块 -->
      <v-card class="mb-4">
        <v-card-title class="pa-2">
          <h5 class="mb-0">课程表管理</h5>
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="file"
            accept=".csv"
            class="mb-3"
            counter
            dense
            label="导入CSV格式课表"
            outlined
            prepend-icon="mdi-paperclip"
            show-size
          />

          <!-- 课表展示 -->
          <v-card class="mt-4">
            <v-card-title class="pa-2">
              <h5>本周课表</h5>
            </v-card-title>
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              hide-details
              label="搜索"
              single-line
            />
            <v-spacer />
            <v-data-table
              class="elevation-1"
              :footer-props="{
                'items-per-page-options': [5, 10, 15],
                'show-current-page': true,
                'show-first-last-page': true
              }"
              :items="courses"
              :search="search"
              :sort-by="['day']"
              :sort-desc="[false]"
            >
            </v-data-table>
          </v-card>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      courses: [
        // 这里可以动态加载你的课程数据
        { name: '数学', day: '周三', time: '8:00-10:00', location: 'A101' },
        { name: '物理', day: '周二', time: '9:00-11:00', location: 'B202' },
        // 更多课程...
      ],
    };
  },
};
</script>

<style scoped>
.headline {
  font-size: 24px;
}
</style>
