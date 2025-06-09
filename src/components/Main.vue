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
          <!-- CSV导入部分 -->
          <v-expansion-panels class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-header>CSV文件导入课表</v-expansion-panel-header>
              <v-expansion-panel-content>
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
                  @change="handleFileChange"
                />
                
                <!-- 上传按钮 -->
                <v-btn 
                  color="primary" 
                  :disabled="!file || uploading"
                  @click="uploadTimetable"
                  class="mb-3"
                >
                  <v-icon left>mdi-upload</v-icon>
                  {{ uploading ? '上传中...' : '上传课表' }}
                </v-btn>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- 手动添加课程按钮 -->
          <div class="mb-4">
            <v-btn 
              color="success" 
              @click="openAddCourseDialog"
              class="mr-2"
            >
              <v-icon left>mdi-plus</v-icon>
              添加课程
            </v-btn>
            <v-btn 
              color="info" 
              @click="refreshTimetable"
              :loading="loading"
            >
              <v-icon left>mdi-refresh</v-icon>
              刷新课表
            </v-btn>
          </div>
          
          <!-- 课表展示 -->
          <v-card class="mt-4">
            <v-card-title class="pa-2">
              <h5>本周课表</h5>
              <v-spacer />
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                hide-details
                label="搜索"
                single-line
              />
            </v-card-title>
            
            <v-data-table
              class="elevation-1"
              :headers="headers"
              :items="courses"
              :search="search"
              :sort-by="['day_of_week']"
              :sort-desc="[false]"
              :loading="loading"
              :footer-props="{
                'items-per-page-options': [5, 10, 15],
                'show-current-page': true,
                'show-first-last-page': true
              }"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="editCourse(item)"
                  color="primary"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  @click="deleteCourse(item)"
                  color="error"
                >
                  mdi-delete
                </v-icon>
              </template>
              
              <template v-slot:no-data>
                <div class="text-center pa-4">
                  <v-icon size="64" color="grey lighten-2">mdi-calendar-blank</v-icon>
                  <p class="mt-2 grey--text">暂无课程数据</p>
                  <p class="grey--text">您可以上传CSV文件或手动添加课程</p>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-card-text>
      </v-card>
      
      <!-- 添加/编辑课程对话框 -->
      <v-dialog v-model="editDialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ isAddMode ? '添加课程' : '编辑课程' }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedCourse.course_name"
                    label="课程名称"
                    required
                    :rules="[v => !!v || '课程名称是必填项']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedCourse.day_of_week"
                    :items="weekDays"
                    label="星期"
                    required
                    :rules="[v => !!v || '请选择星期']"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedCourse.location"
                    label="地点"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedCourse.start_time"
                    label="开始时间"
                    type="time"
                    required
                    :rules="[v => !!v || '开始时间是必填项']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedCourse.end_time"
                    label="结束时间"
                    type="time"
                    required
                    :rules="[v => !!v || '结束时间是必填项']"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="closeEditDialog"
            >
              取消
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveCourse"
              :loading="saving"
            >
              {{ isAddMode ? '添加' : '保存' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 删除确认对话框 -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="headline">确认删除</v-card-title>
          <v-card-text>
            确定要删除课程 "{{ courseToDelete?.course_name }}" 吗？
            <br>此操作不可撤销。
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="deleteDialog = false"
            >
              取消
            </v-btn>
            <v-btn
              color="red darken-1"
              text
              @click="confirmDelete"
              :loading="deleting"
            >
              删除
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- 提示信息 -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
      >
        {{ snackbar.message }}
        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="snackbar.show = false"
          >
            关闭
          </v-btn>
        </template>
      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'

// 配置基础API URL
const API_BASE_URL = 'http://localhost:8082'

export default {
  name: 'Main',
  data() {
    return {
      search: '',
      file: null,
      uploading: false,
      loading: false,
      saving: false,
      deleting: false,
      courses: [],
      headers: [
        { text: '课程名称', value: 'course_name' },
        { text: '星期', value: 'day_of_week' },
        { text: '开始时间', value: 'start_time' },
        { text: '结束时间', value: 'end_time' },
        { text: '地点', value: 'location' },
        { text: '操作', value: 'actions', sortable: false }
      ],
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      // 编辑相关
      editDialog: false,
      isAddMode: false, // 新增字段：区分添加和编辑模式
      editedCourse: {
        id: null,
        course_name: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        location: ''
      },
      defaultCourse: {
        id: null,
        course_name: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        location: ''
      },
      weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // 删除相关
      deleteDialog: false,
      courseToDelete: null
    }
  },
  
  computed: {
    userEmail() {
      // 从 Vuex 或 localStorage 获取用户邮箱
      return this.$store?.state?.user?.email || localStorage.getItem('userEmail') || 'test1@example.com'
    }
  },
  
  mounted() {
    // 组件加载时获取课表数据
    this.fetchTimetable()
  },
  
  methods: {
    // 处理文件选择
    handleFileChange(file) {
      console.log('选择的文件:', file)
      if (file && !file.name.endsWith('.csv')) {
        this.showMessage('请选择CSV格式的文件', 'error')
        this.file = null
      }
    },
    
    // 上传课表文件
    async uploadTimetable() {
      if (!this.file) {
        this.showMessage('请先选择文件', 'warning')
        return
      }
      
      this.uploading = true
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('email', this.userEmail)
      
      try {
        const response = await axios.post(`${API_BASE_URL}/api/timetable/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        this.showMessage('课表上传成功！', 'success')
        this.file = null
        
        // 上传成功后重新获取课表
        await this.fetchTimetable()
        
      } catch (error) {
        console.error('上传失败:', error)
        const errorMsg = error.response?.data?.detail || '上传失败，请重试'
        this.showMessage(errorMsg, 'error')
      } finally {
        this.uploading = false
      }
    },
    
    // 获取课表数据
    async fetchTimetable() {
      this.loading = true
      try {
        const response = await axios.get(`${API_BASE_URL}/api/timetable`, {
          params: { email: this.userEmail }
        })

        const dayOrder = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        this.courses = (response.data.timetable || []).sort((a, b) => {
          const dayDiff = dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week)
          if (dayDiff !== 0) return dayDiff
          return a.start_time.localeCompare(b.start_time)
        })
      } catch (error) {
        console.error('获取课表失败:', error)
        if (error.response?.status !== 404) {
          this.showMessage('获取课表数据失败', 'error')
        }
      } finally {
        this.loading = false
      }
    },

    
    // 新增：打开添加课程对话框
    openAddCourseDialog() {
      this.isAddMode = true
      this.editedCourse = Object.assign({}, this.defaultCourse)
      this.editDialog = true
    },
    
    // 编辑课程
    editCourse(course) {
      this.isAddMode = false
      this.editedCourse = Object.assign({}, course)
      this.editDialog = true
    },
    
    // 关闭编辑对话框
    closeEditDialog() {
      this.editDialog = false
      this.$nextTick(() => {
        this.editedCourse = Object.assign({}, this.defaultCourse)
        this.isAddMode = false
      })
    },
    
    // 保存课程（添加或编辑）
    async saveCourse() {
      if (!this.validateCourse()) {
        return
      }
      
      this.saving = true
      try {
        if (this.isAddMode) {
          // 添加新课程
          await this.addNewCourse()
        } else {
          // 编辑现有课程
          await this.updateExistingCourse()
        }
        
        this.showMessage(`课程${this.isAddMode ? '添加' : '更新'}成功！`, 'success')
        this.closeEditDialog()
        
        // 成功后重新获取课表
        await this.fetchTimetable()
        
      } catch (error) {
        console.error(`${this.isAddMode ? '添加' : '更新'}失败:`, error)
        const errorMsg = error.response?.data?.detail || `${this.isAddMode ? '添加' : '更新'}失败，请重试`
        this.showMessage(errorMsg, 'error')
      } finally {
        this.saving = false
      }
    },
    
    // 新增：添加新课程
    async addNewCourse() {
      const courseData = {
        email: this.userEmail,
        course_name: this.editedCourse.course_name,
        day_of_week: this.editedCourse.day_of_week,
        start_time: this.editedCourse.start_time,
        end_time: this.editedCourse.end_time,
        location: this.editedCourse.location
      }
      
      // 由于后端没有专门的添加单个课程接口，我们可以通过模拟CSV上传的方式添加
      // 或者您可以在后端添加一个专门的添加课程接口
      const response = await axios.post(`${API_BASE_URL}/api/timetable/add`, courseData)
      return response
    },
    
    // 更新现有课程
    async updateExistingCourse() {
      const response = await axios.put(`${API_BASE_URL}/api/timetable/${this.editedCourse.id}`, {
        email: this.userEmail,
        course_name: this.editedCourse.course_name,
        day_of_week: this.editedCourse.day_of_week,
        start_time: this.editedCourse.start_time,
        end_time: this.editedCourse.end_time,
        location: this.editedCourse.location
      })
      return response
    },
    
    // 验证课程数据
    validateCourse() {
      if (!this.editedCourse.course_name.trim()) {
        this.showMessage('请输入课程名称', 'warning')
        return false
      }
      if (!this.editedCourse.day_of_week) {
        this.showMessage('请选择星期', 'warning')
        return false
      }
      if (!this.editedCourse.start_time || !this.editedCourse.end_time) {
        this.showMessage('请输入完整的时间', 'warning')
        return false
      }
      if (this.editedCourse.start_time >= this.editedCourse.end_time) {
        this.showMessage('结束时间必须晚于开始时间', 'warning')
        return false
      }

      // === 时间冲突检测 ===
      const isConflict = this.courses.some(course => {
        if (course.id === this.editedCourse.id) return false // 编辑时跳过自身
        if (course.day_of_week !== this.editedCourse.day_of_week) return false

        const startA = this.editedCourse.start_time
        const endA = this.editedCourse.end_time
        const startB = course.start_time
        const endB = course.end_time

        return !(endA <= startB || startA >= endB) // 时间重叠
      })

      if (isConflict) {
        this.showMessage('与已有课程时间冲突，请调整时间', 'error')
        return false
      }

      return true
    },

    // 删除课程
    deleteCourse(course) {
      this.courseToDelete = course
      this.deleteDialog = true
    },
    
    // 确认删除
    async confirmDelete() {
      if (!this.courseToDelete) return
      
      this.deleting = true
      try {
        await axios.delete(`${API_BASE_URL}/api/timetable/${this.courseToDelete.id}`, {
          params: { email: this.userEmail }
        })
        
        this.showMessage('课程删除成功！', 'success')
        this.deleteDialog = false
        this.courseToDelete = null
        
        // 删除成功后重新获取课表
        await this.fetchTimetable()
        
      } catch (error) {
        console.error('删除失败:', error)
        const errorMsg = error.response?.data?.detail || '删除失败，请重试'
        this.showMessage(errorMsg, 'error')
      } finally {
        this.deleting = false
      }
    },
    
    // 显示提示消息
    showMessage(message, color = 'success') {
      this.snackbar = {
        show: true,
        message,
        color
      }
    },
    
    // 刷新课表数据
    async refreshTimetable() {
      await this.fetchTimetable()
      this.showMessage('课表数据已刷新', 'success')
    },
    
    // 格式化时间显示
    formatTime(time) {
      // 可以在这里添加时间格式化逻辑
      return time
    },
    
    // 获取今日课程
    getTodayCourses() {
      const today = new Date()
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const todayWeekDay = weekDays[today.getDay()]
      
      return this.courses.filter(course => 
        course.day_of_week === todayWeekDay
      )
    },
    
    // 导出课表
    exportTimetable() {
      // 将课表数据导出为CSV
      if (this.courses.length === 0) {
        this.showMessage('没有课表数据可导出', 'warning')
        return
      }
      
      const csvContent = this.convertToCSV(this.courses)
      this.downloadCSV(csvContent, 'timetable.csv')
      this.showMessage('课表导出成功', 'success')
    },
    
    // 转换为CSV格式
    convertToCSV(data) {
      const headers = ['Course Name', 'Day', 'Start Time', 'End Time', 'Location']
      const csvRows = [headers.join(',')]
      
      data.forEach(course => {
        const row = [
          course.course_name,
          course.day_of_week,
          course.start_time,
          course.end_time,
          course.location
        ]
        csvRows.push(row.join(','))
      })
      
      return csvRows.join('\n')
    },
    
    // 下载CSV文件
    downloadCSV(csvContent, filename) {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }
}
</script>

<style scoped>
.headline {
  font-size: 24px;
}

.content-container {
  max-width: 1200px;
}

.v-card {
  margin-bottom: 16px;
}

.v-data-table {
  background-color: #fafafa;
}
</style>